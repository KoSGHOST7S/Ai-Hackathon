# Assignment Workspace Orchestration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace generic Canvas proxy behavior with a single-workspace-per-assignment orchestration API that streams progress, produces a normalized plan, and supports async feedback jobs.

**Architecture:** Keep FastAPI + SQLAlchemy + Alembic, add durable workspace/job/submission/feedback tables, and expose assignment-scoped endpoints. Use background workers with DB-backed state transitions and SSE streams for reactive UI. Ensure idempotent `start` behavior (`resume` default, `reprocess=true` replaces in place).

**Tech Stack:** FastAPI, SQLAlchemy 2.x, Alembic, Pydantic, httpx, pytest, SSE via `StreamingResponse`.

---

### Task 1: Add Persistence Models and Migrations

**Files:**
- Create: `app/models/assignment_workspace.py`
- Create: `app/models/processing_job.py`
- Create: `app/models/milestone_submission.py`
- Create: `app/models/feedback_record.py`
- Modify: `app/models/__init__.py`
- Create: `alembic/versions/0003_assignment_workspace_models.py`
- Test: `tests/test_models_workspace.py`

**Step 1: Write the failing test**

```python
def test_workspace_unique_key(db_session):
    ...  # two rows with same user/course/assignment should fail
```

**Step 2: Run test to verify it fails**

Run: `pytest tests/test_models_workspace.py::test_workspace_unique_key -v`
Expected: FAIL with missing model/table.

**Step 3: Write minimal implementation**

```python
class AssignmentWorkspace(Base):
    __tablename__ = "assignment_workspaces"
    __table_args__ = (UniqueConstraint("user_id", "course_id", "assignment_id"),)
```

Add companion models and migration creating all new tables and indexes.

**Step 4: Run test to verify it passes**

Run: `pytest tests/test_models_workspace.py::test_workspace_unique_key -v`
Expected: PASS.

**Step 5: Commit**

```bash
git add app/models/*.py app/models/__init__.py alembic/versions/0003_assignment_workspace_models.py tests/test_models_workspace.py
git commit -m "feat: add assignment workspace persistence models"
```

### Task 2: Add Workspace and Plan Schemas

**Files:**
- Create: `app/schemas/workspace.py`
- Create: `app/schemas/plan.py`
- Create: `app/schemas/feedback.py`
- Test: `tests/test_schemas_plan.py`

**Step 1: Write the failing test**

```python
def test_plan_schema_accepts_expected_shape():
    PlanResponse.model_validate({...})
```

**Step 2: Run test to verify it fails**

Run: `pytest tests/test_schemas_plan.py::test_plan_schema_accepts_expected_shape -v`
Expected: FAIL with import or validation mismatch.

**Step 3: Write minimal implementation**

```python
class PlanResponse(BaseModel):
    assignment_summary: AssignmentSummary
    milestones: list[Milestone]
    risks: list[RiskItem]
    submission_strategy: SubmissionStrategy
```

Include stable fields agreed in design.

**Step 4: Run test to verify it passes**

Run: `pytest tests/test_schemas_plan.py::test_plan_schema_accepts_expected_shape -v`
Expected: PASS.

**Step 5: Commit**

```bash
git add app/schemas/workspace.py app/schemas/plan.py app/schemas/feedback.py tests/test_schemas_plan.py
git commit -m "feat: add workspace plan and feedback schemas"
```

### Task 3: Replace Canvas Proxy with Context Fetch Service

**Files:**
- Create: `app/services/canvas_context_service.py`
- Modify: `app/services/canvas_client.py`
- Test: `tests/test_canvas_context_service.py`

**Step 1: Write the failing test**

```python
def test_fetch_assignment_context_returns_assignment_and_rubric(monkeypatch):
    ...
```

**Step 2: Run test to verify it fails**

Run: `pytest tests/test_canvas_context_service.py::test_fetch_assignment_context_returns_assignment_and_rubric -v`
Expected: FAIL due missing service behavior.

**Step 3: Write minimal implementation**

```python
async def fetch_assignment_context(*, base_url, api_key, course_id, assignment_id):
    return {
        "assignment": ...,
        "rubric": ...,
        "course": ...,
    }
```

Remove direct passthrough response behavior.

**Step 4: Run test to verify it passes**

Run: `pytest tests/test_canvas_context_service.py::test_fetch_assignment_context_returns_assignment_and_rubric -v`
Expected: PASS.

**Step 5: Commit**

```bash
git add app/services/canvas_context_service.py app/services/canvas_client.py tests/test_canvas_context_service.py
git commit -m "feat: add canvas context fetch service"
```

### Task 4: Implement Assignment Workspace Start/Resume/Reprocess API

**Files:**
- Create: `app/api/routes/assignments.py`
- Modify: `app/api/router.py`
- Create: `app/services/workspace_service.py`
- Test: `tests/test_assignment_start.py`

**Step 1: Write the failing test**

```python
def test_start_resumes_existing_workspace(client):
    ...

def test_start_reprocess_replaces_plan(client):
    ...
```

**Step 2: Run test to verify it fails**

Run: `pytest tests/test_assignment_start.py -v`
Expected: FAIL with missing route/logic.

**Step 3: Write minimal implementation**

```python
@router.post("/assignments/{course_id}/{assignment_id}/start")
def start_assignment(..., reprocess: bool = False):
    ...  # resume default, replace in place on reprocess
```

Add docstrings on endpoint functions.

**Step 4: Run test to verify it passes**

Run: `pytest tests/test_assignment_start.py -v`
Expected: PASS.

**Step 5: Commit**

```bash
git add app/api/routes/assignments.py app/api/router.py app/services/workspace_service.py tests/test_assignment_start.py
git commit -m "feat: add assignment start resume and reprocess endpoints"
```

### Task 5: Implement SSE Progress Stream

**Files:**
- Create: `app/services/event_stream_service.py`
- Modify: `app/api/routes/assignments.py`
- Test: `tests/test_assignment_events.py`

**Step 1: Write the failing test**

```python
def test_events_stream_emits_progress_events(client):
    ...
```

**Step 2: Run test to verify it fails**

Run: `pytest tests/test_assignment_events.py::test_events_stream_emits_progress_events -v`
Expected: FAIL due missing SSE endpoint/format.

**Step 3: Write minimal implementation**

```python
@router.get("/assignments/{course_id}/{assignment_id}/events")
async def assignment_events(...):
    return StreamingResponse(event_generator(), media_type="text/event-stream")
```

Emit normalized SSE event JSON strings with stage/status/progress.

**Step 4: Run test to verify it passes**

Run: `pytest tests/test_assignment_events.py::test_events_stream_emits_progress_events -v`
Expected: PASS.

**Step 5: Commit**

```bash
git add app/services/event_stream_service.py app/api/routes/assignments.py tests/test_assignment_events.py
git commit -m "feat: stream assignment processing progress over sse"
```

### Task 6: Implement Plan Retrieval Endpoint

**Files:**
- Modify: `app/api/routes/assignments.py`
- Modify: `app/services/workspace_service.py`
- Test: `tests/test_assignment_plan.py`

**Step 1: Write the failing test**

```python
def test_get_plan_returns_normalized_plan(client):
    ...
```

**Step 2: Run test to verify it fails**

Run: `pytest tests/test_assignment_plan.py::test_get_plan_returns_normalized_plan -v`
Expected: FAIL with missing plan endpoint.

**Step 3: Write minimal implementation**

```python
@router.get("/assignments/{course_id}/{assignment_id}/plan", response_model=PlanResponse)
def get_plan(...):
    ...
```

Ensure endpoint has docstring for OpenAPI generation.

**Step 4: Run test to verify it passes**

Run: `pytest tests/test_assignment_plan.py::test_get_plan_returns_normalized_plan -v`
Expected: PASS.

**Step 5: Commit**

```bash
git add app/api/routes/assignments.py app/services/workspace_service.py tests/test_assignment_plan.py
git commit -m "feat: expose normalized assignment plan endpoint"
```

### Task 7: Implement Async Feedback Jobs (Milestone and Assignment)

**Files:**
- Create: `app/services/feedback_service.py`
- Modify: `app/api/routes/assignments.py`
- Create: `app/schemas/submission.py`
- Test: `tests/test_feedback_jobs.py`

**Step 1: Write the failing test**

```python
def test_start_milestone_feedback_creates_async_job(client):
    ...

def test_start_assignment_feedback_creates_async_job(client):
    ...
```

**Step 2: Run test to verify it fails**

Run: `pytest tests/test_feedback_jobs.py -v`
Expected: FAIL with missing endpoints/job persistence.

**Step 3: Write minimal implementation**

```python
@router.post("/assignments/{course_id}/{assignment_id}/milestones/{milestone_id}/submissions/start")
def start_milestone_feedback(...):
    ...

@router.post("/assignments/{course_id}/{assignment_id}/submissions/start")
def start_assignment_feedback(...):
    ...
```

Store async jobs and placeholder result progression.

**Step 4: Run test to verify it passes**

Run: `pytest tests/test_feedback_jobs.py -v`
Expected: PASS.

**Step 5: Commit**

```bash
git add app/services/feedback_service.py app/api/routes/assignments.py app/schemas/submission.py tests/test_feedback_jobs.py
git commit -m "feat: add async feedback job endpoints"
```

### Task 8: Add Feedback Job Status Endpoint and Docstrings Audit

**Files:**
- Modify: `app/api/routes/assignments.py`
- Test: `tests/test_feedback_jobs.py`

**Step 1: Write the failing test**

```python
def test_feedback_job_status_returns_result_when_ready(client):
    ...
```

**Step 2: Run test to verify it fails**

Run: `pytest tests/test_feedback_jobs.py::test_feedback_job_status_returns_result_when_ready -v`
Expected: FAIL due missing status endpoint/result shape.

**Step 3: Write minimal implementation**

```python
@router.get("/assignments/{course_id}/{assignment_id}/feedback/jobs/{job_id}")
def get_feedback_job(...):
    ...
```

Confirm every assignment endpoint has docstrings.

**Step 4: Run test to verify it passes**

Run: `pytest tests/test_feedback_jobs.py -v`
Expected: PASS.

**Step 5: Commit**

```bash
git add app/api/routes/assignments.py tests/test_feedback_jobs.py
git commit -m "feat: add feedback job status endpoint"
```

### Task 9: Final Verification and Documentation Update

**Files:**
- Modify: `README.md`
- Modify: `.env.example`
- Test: `tests/test_auth.py`
- Test: `tests/test_assignment_start.py`
- Test: `tests/test_assignment_events.py`
- Test: `tests/test_assignment_plan.py`
- Test: `tests/test_feedback_jobs.py`

**Step 1: Update docs**

Add extension-oriented API usage, SSE behavior, and single-workspace semantics.

**Step 2: Run full verification**

Run: `pytest -q`
Expected: all tests PASS.

Run: `alembic downgrade base && alembic upgrade head`
Expected: migrations run cleanly.

Run: `python -c "from app.main import app; print(app.title, len(app.routes))"`
Expected: app imports successfully and routes are registered.

**Step 3: Commit**

```bash
git add README.md .env.example tests/ app/ alembic/
git commit -m "feat: implement assignment workspace orchestration api"
```

## Notes for Execution
- Use @superpowers:test-driven-development for each behavior change.
- Use @superpowers:verification-before-completion before completion claims.
- Preserve existing auth and user Canvas credential APIs.
- Remove or deprecate direct `/canvas/{path}` passthrough behavior in favor of assignment processing endpoints.
