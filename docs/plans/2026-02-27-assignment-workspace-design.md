# Assignment Workspace + Agent Orchestration Design

## Goal
Build a FastAPI backend that, on explicit extension click, processes a Canvas assignment into a structured plan (milestones/tasks), streams progress reactively to the extension via SSE, and supports async feedback jobs for milestone-level or assignment-level submissions.

## Confirmed Decisions
- Do not expose an orchestration-prefixed API surface.
- Single workspace per `(user_id, course_id, assignment_id)`.
- `start` defaults to `resume`; optional `reprocess=true` replaces in place.
- Processing starts only when user clicks in extension.
- Reactive UI updates via SSE.
- Canvas context is always fetched fresh before planning.
- Persist workspace, plan, milestone state, and feedback history server-side.
- Extension identifies target via `course_id + assignment_id`.
- Extension authenticates to backend with backend JWT.
- Users store Canvas base URL + API key server-side.
- Submission feedback is async (jobs), not synchronous.

## API Contract
- `POST /assignments/{course_id}/{assignment_id}/start`
  - Starts processing for assignment workspace.
  - Default: resume existing state.
  - `?reprocess=true`: replace in place and rebuild plan.
- `GET /assignments/{course_id}/{assignment_id}`
  - Returns workspace snapshot (`status`, `stage`, `progress`, `updated_at`).
- `GET /assignments/{course_id}/{assignment_id}/events`
  - SSE stream for progress and partial outputs.
- `GET /assignments/{course_id}/{assignment_id}/plan`
  - Returns current normalized plan.
- `POST /assignments/{course_id}/{assignment_id}/milestones/{milestone_id}/submissions/start`
  - Starts async milestone feedback job (text submission).
- `POST /assignments/{course_id}/{assignment_id}/submissions/start`
  - Starts async assignment-level feedback job (text submission).
- `GET /assignments/{course_id}/{assignment_id}/feedback/jobs/{job_id}`
  - Returns feedback job status and result.

## Processing Pipeline
Planning pipeline stages:
1. `fetch_canvas_context`
2. `fetch_and_parse_attachments`
3. `distill_assignment_requirements`
4. `draft_plan`
5. `verify_against_source`
6. `finalize_plan`

Feedback pipeline stages:
1. `ingest_submission`
2. `analyze_against_plan_and_rubric`
3. `generate_feedback`
4. `finalize_feedback`

## SSE Event Model
Common event fields:
- `event_type`
- `workspace_id`
- `stage`
- `status`
- `progress` (0-100)
- `message`
- `timestamp`

Optional preview payloads:
- `draft_summary`
- `milestone_preview`
- `feedback_preview`

Terminal event types:
- `plan_ready`
- `feedback_ready`
- `failed`

## Data Model
### `assignment_workspaces`
- Unique: `(user_id, course_id, assignment_id)`
- Fields: `status`, `current_stage`, `progress`, `last_error`, `context_blob`, `plan_blob`, timestamps

### `processing_jobs`
- Fields: `workspace_id`, `job_type` (`plan|milestone_feedback|assignment_feedback`), `status`, `stage`, `progress`, `result_blob`, timestamps

### `milestone_submissions`
- Fields: `workspace_id`, `milestone_id`, `submission_text`, `job_id`, timestamps

### `feedback_records`
- Fields: `workspace_id`, `job_id`, `target_type` (`milestone|assignment`), `target_id`, `feedback_blob`, timestamps

## Output Schema (Stable for Extension)
Plan JSON:
- `assignment_summary`
  - `title`, `objective`, `success_definition`, `hard_constraints[]`, `grading_signals[]`
- `milestones[]`
  - `id`, `title`, `purpose`, `acceptance_criteria[]`, `due_strategy`, `order`
  - `tasks[]`
    - `id`, `title`, `description`, `deliverable`, `done_definition`, `estimated_effort`, `depends_on[]`
- `risks[]`
  - `risk`, `impact`, `mitigation`
- `submission_strategy`
  - `final_checklist[]`, `quality_bar`, `common_failure_modes[]`

Feedback JSON:
- `target`
  - `type`, `id`
- `scorecard`
  - `criterion_scores[]`, `overall_readiness`
- `strengths[]`
- `gaps[]`
- `required_fixes[]`
- `suggested_improvements[]`
- `next_actions[]`

## Behavior Rules
- `POST start` (no `reprocess`):
  - `ready`: return current workspace
  - `running`: return current running workspace
  - `failed`: return failed state (client decides to reprocess)
- `POST start?reprocess=true`:
  - replace existing plan/feedback in place
  - cancel/obsolete active planning job
- Feedback start endpoints:
  - always create new async feedback job
  - preserve job history

## Security and Safety
- Canvas API key stays server-side and encrypted at rest.
- Never include secrets in API payloads/events/logs.
- Attachment parser allowlist and size limits enforced.
- Persist raw extracted context separately from normalized outputs for traceability.

## Error Handling
- `400`: invalid request or missing workspace prerequisites
- `401`: invalid auth
- `404`: workspace or job not found
- `409`: conflicting start request while reprocess already running
- `422`: validation errors
- `502`: upstream Canvas failures

## Testing Strategy
- Unit tests: state transitions, idempotency rules, output normalizers
- API tests: start/resume/reprocess behavior, SSE events, plan retrieval
- Feedback tests: async job lifecycle and result persistence
- Integration tests: attachment text extraction from sample PDF/DOCX fixtures
