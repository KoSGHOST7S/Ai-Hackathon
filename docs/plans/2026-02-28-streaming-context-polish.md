# Streaming, Full Context & UI Polish Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace fake timer-based progress with real SSE streaming from the AI pipeline, feed agents the full assignment context (Canvas rubric, grading type, file names), populate the analysisResults map so Sparkles indicators work, and polish the UI throughout.

**Architecture:** Python agents emits SSE as each of the 3 agent steps starts; Node.js server proxies the SSE stream while intercepting the final `done` event to save to DB; extension consumes the stream via `fetch` + ReadableStream to drive real step indicators. A new `GET /assignments/results` endpoint lets the extension bulk-fetch which assignments have been analyzed. Canvas submission attachments and existing rubric data are fetched server-side and passed to agents as enriched context.

**Tech Stack:** FastAPI `StreamingResponse` (SSE) — Node.js `fetch` streaming proxy (Node 20) — React `useAnalysis` with async generator / ReadableStream — Prisma — Tailwind CSS

---

## Task 1: Full assignment context — agents model + prompts

**Files:**
- Modify: `apps/agents/models/assignment.py`
- Modify: `apps/agents/lib/prompts.py`

**Step 1: Add context fields to `AnalyzeRequest` in `apps/agents/models/assignment.py`**

Replace the `AnalyzeRequest` class only — all other classes stay exactly as-is:

```python
class AnalyzeRequest(BaseModel):
    name: str
    description: str
    points_possible: float = 100.0
    submission_types: list[str] = []
    due_at: str | None = None
    grading_type: str = "points"
    allowed_attempts: int | None = None
    attachment_names: list[str] = []
    # Field names are camelCase to match LLM JSON output directly (no alias needed)
    canvas_rubric_summary: str | None = None  # existing Canvas rubric as plain text, if any
```

**Step 2: Enrich `apps/agents/lib/prompts.py` to use the new fields**

Replace all three prompt constants:

```python
RUBRIC_SYSTEM = """You are an academic rubric expert. Given an assignment, \
generate a detailed grading rubric as valid JSON matching this exact schema:
{"criteria":[{"name":str,"description":str,"weight":int,"levels":[{"label":str,"points":int,"description":str}]}],"totalPoints":int}
Rules:
- All criteria weights must sum to totalPoints (use the assignment's points_possible as totalPoints).
- Each criterion must have exactly 4 levels: Excellent, Proficient, Developing, Beginning.
- If a Canvas rubric is provided, use it as the basis and improve it.
- If attachment files are listed, reference them in criteria where relevant.
Return ONLY the JSON object, no markdown, no explanation."""

VALIDATOR_SYSTEM = """You are a rubric quality reviewer. Given an assignment and a draft rubric, \
verify that: (1) all criteria weights sum to totalPoints, (2) each criterion directly maps to \
something in the assignment description, (3) levels are meaningfully differentiated. \
Return the improved rubric as valid JSON with the same schema. Return ONLY the JSON object."""

MILESTONE_SYSTEM = """You are a study planning expert. Given an assignment description and its grading rubric, \
break the work into 4-7 ordered, actionable milestones as valid JSON matching this exact schema:
{"milestones":[{"order":int,"title":str,"description":str,"estimatedHours":float,"deliverable":str}]}
Rules:
- Each milestone must correspond to one or more rubric criteria.
- estimatedHours should be realistic for a student.
- deliverable is a concrete artifact (e.g. "working function", "test file", "written paragraph").
- If a due date is provided, distribute milestones proportionally.
Return ONLY the JSON object."""
```

**Step 3: Verify imports still work**
```bash
cd /home/max/Documents/Projects/Ai-Hackathon/apps/agents
uv run python -c "from models.assignment import AnalyzeRequest; from lib.prompts import RUBRIC_SYSTEM, VALIDATOR_SYSTEM, MILESTONE_SYSTEM; print('OK')"
```
Expected: `OK`

**Step 4: Commit**
```bash
git add apps/agents/models/assignment.py apps/agents/lib/prompts.py
git commit -m "feat(agents): richer AnalyzeRequest fields + improved prompts"
```

---

## Task 2: Full assignment context — server fetching

**Files:**
- Modify: `apps/server/src/lib/agents.ts`
- Modify: `apps/server/src/routes/assignments.ts`

**Step 1: Add new fields to `AgentsAnalyzeRequest` in `apps/server/src/lib/agents.ts`**

Add to the existing interface (keep all existing fields, just add these):
```typescript
export interface AgentsAnalyzeRequest {
  name: string;
  description: string;
  points_possible: number;
  submission_types: string[];
  due_at: string | null;
  grading_type: string;
  allowed_attempts: number | null;
  attachment_names: string[];
  canvas_rubric_summary: string | null;
}
```

**Step 2: Enrich the analyze handler in `apps/server/src/routes/assignments.ts`**

Inside `POST /assignments/analyze`, after fetching the Canvas assignment object and building `description`, replace the `callAgentsService` call setup with this enriched version:

```typescript
    // Extract Canvas rubric summary if present
    let canvas_rubric_summary: string | null = null;
    if (Array.isArray(assignment.rubric) && assignment.rubric.length > 0) {
      canvas_rubric_summary = (assignment.rubric as Array<{ description?: string; points?: number }>)
        .map((c) => `- ${c.description ?? "criterion"} (${c.points ?? 0} pts)`)
        .join("\n");
    }

    // Try to fetch file attachment names from the student's own submission
    let attachment_names: string[] = [];
    try {
      const submission = await canvasFetch(
        creds.baseUrl, creds.apiKey,
        `/courses/${courseId}/assignments/${assignmentId}/submissions/self`
      );
      if (Array.isArray(submission?.attachments)) {
        attachment_names = (submission.attachments as Array<{ display_name?: string }>)
          .map((f) => f.display_name ?? "untitled")
          .filter(Boolean);
      }
    } catch {
      // non-fatal — student may not have submitted yet
    }

    const result = await callAgentsService({
      name: assignment.name,
      description,
      points_possible: assignment.points_possible ?? 100,
      submission_types: assignment.submission_types ?? [],
      due_at: assignment.due_at ?? null,
      grading_type: assignment.grading_type ?? "points",
      allowed_attempts: assignment.allowed_attempts ?? null,
      attachment_names,
      canvas_rubric_summary,
    });
```

**Step 3: Update the agent context message format in `apps/agents/agents/rubric_generator.py`**

Replace the `user_msg` build in `generate_rubric` to include the new fields:
```python
    parts = [
        f"Assignment: {assignment.name}",
        f"Points possible: {assignment.points_possible}",
        f"Grading type: {assignment.grading_type}",
        f"Submission types: {', '.join(assignment.submission_types) or 'not specified'}",
    ]
    if assignment.allowed_attempts and assignment.allowed_attempts > 0:
        parts.append(f"Allowed attempts: {assignment.allowed_attempts}")
    if assignment.attachment_names:
        parts.append(f"Submitted files: {', '.join(assignment.attachment_names)}")
    if assignment.canvas_rubric_summary:
        parts.append(f"\nExisting Canvas rubric (use as basis):\n{assignment.canvas_rubric_summary}")
    parts.append(f"\nAssignment description:\n{assignment.description}")
    user_msg = "\n".join(parts)
```

**Step 4: tsc check**
```bash
cd /home/max/Documents/Projects/Ai-Hackathon/apps/server && npx tsc --noEmit
```
Expected: no errors.

**Step 5: Commit**
```bash
git add apps/server/src/lib/agents.ts apps/server/src/routes/assignments.ts apps/agents/agents/rubric_generator.py
git commit -m "feat(context): richer assignment context — Canvas rubric, grading type, file names"
```

---

## Task 3: SSE streaming — agents service

**Files:**
- Modify: `apps/agents/workflow/pipeline.py`
- Modify: `apps/agents/main.py`

**Step 1: Add `stream_pipeline` generator to `apps/agents/workflow/pipeline.py`**

Keep `run_pipeline` exactly as-is (non-streaming path still needed for tests). Add below it:

```python
import json
from collections.abc import AsyncGenerator


async def stream_pipeline(assignment: AnalyzeRequest) -> AsyncGenerator[str, None]:
    """Yield SSE-formatted strings as each pipeline step starts/completes."""
    model = get_model()

    yield f'event: progress\ndata: {json.dumps({"step": 0, "label": "Generating rubric\u2026"})}\n\n'
    rubric = await generate_rubric(assignment, model)

    yield f'event: progress\ndata: {json.dumps({"step": 1, "label": "Validating rubric\u2026"})}\n\n'
    rubric = await validate_rubric(assignment, rubric, model)

    yield f'event: progress\ndata: {json.dumps({"step": 2, "label": "Building milestones\u2026"})}\n\n'
    milestones = await generate_milestones(assignment, rubric, model)

    response = AnalyzeResponse(rubric=rubric, milestones=milestones)
    yield f'event: done\ndata: {response.model_dump_json()}\n\n'
```

Add the `json` import at the top of the file and `from collections.abc import AsyncGenerator`.

**Step 2: Add `POST /analyze/stream` to `apps/agents/main.py`**

Add after the existing `/analyze` route:

```python
from fastapi.responses import StreamingResponse
from workflow.pipeline import stream_pipeline


@app.post("/analyze/stream")
async def analyze_stream(req: AnalyzeRequest) -> StreamingResponse:
    async def event_generator():
        try:
            async for chunk in stream_pipeline(req):
                yield chunk
        except Exception as exc:
            logging.exception("Stream pipeline failed")
            yield f'event: error\ndata: {json.dumps({"error": str(exc)})}\n\n'

    return StreamingResponse(event_generator(), media_type="text/event-stream")
```

Add `import json` to the imports at the top of `main.py`.

**Step 3: Live test the streaming endpoint**

Start the server: `cd /home/max/Documents/Projects/Ai-Hackathon/apps/agents && uv run uvicorn main:app --port 8000 &`
Wait 2s, then:
```bash
curl -N -X POST http://localhost:8000/analyze/stream \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Assignment","description":"Write a 500-word essay on recursion.","points_possible":50}' \
  2>/dev/null | head -20
```
Expected: see `event: progress` lines appearing one by one, finally `event: done` with JSON.
Kill server after: `kill $(lsof -ti:8000) 2>/dev/null || true`

**Step 4: Commit**
```bash
git add apps/agents/workflow/pipeline.py apps/agents/main.py
git commit -m "feat(agents): SSE streaming endpoint — real progress events per pipeline step"
```

---

## Task 4: SSE streaming — server proxy

**Files:**
- Modify: `apps/server/src/lib/agents.ts`
- Modify: `apps/server/src/routes/assignments.ts`

**Step 1: Add SSE stream helper to `apps/server/src/lib/agents.ts`**

Add below `callAgentsService`:

```typescript
export type SseProgressEvent = { type: "progress"; step: number; label: string };
export type SseDoneEvent     = { type: "done"; result: AgentsAnalyzeResponse };
export type SseErrorEvent    = { type: "error"; error: string };
export type SseEvent = SseProgressEvent | SseDoneEvent | SseErrorEvent;

/** Streams SSE events from the agents /analyze/stream endpoint. */
export async function* streamFromAgentsService(
  req: AgentsAnalyzeRequest
): AsyncGenerator<SseEvent> {
  const res = await fetch(`${AGENTS_URL}/analyze/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok || !res.body) {
    yield { type: "error", error: `Agents service error ${res.status}` };
    return;
  }

  const decoder = new TextDecoder();
  let buffer = "";
  // @ts-expect-error — Node 20 body is async iterable
  for await (const chunk of res.body) {
    buffer += decoder.decode(chunk as Uint8Array, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";

    for (const raw of events) {
      if (!raw.trim()) continue;
      const lines = raw.split("\n");
      const eventType = lines.find((l) => l.startsWith("event:"))?.slice(6).trim();
      const dataStr   = lines.find((l) => l.startsWith("data:"))?.slice(5).trim();
      if (!dataStr) continue;
      try {
        const data = JSON.parse(dataStr) as Record<string, unknown>;
        if (eventType === "progress") {
          yield { type: "progress", step: data.step as number, label: data.label as string };
        } else if (eventType === "done") {
          yield { type: "done", result: data as unknown as AgentsAnalyzeResponse };
        } else if (eventType === "error") {
          yield { type: "error", error: (data.error as string) ?? "Unknown error" };
        }
      } catch { /* malformed event — skip */ }
    }
  }
}
```

**Step 2: Add `POST /assignments/analyze/stream` to `apps/server/src/routes/assignments.ts`**

Add this route after the existing `POST /analyze` route, before `GET /:courseId/:assignmentId/result`:

```typescript
// POST /assignments/analyze/stream — SSE streaming version
router.post("/analyze/stream", requireAuth, async (req: AuthRequest, res: Response) => {
  const { courseId, assignmentId } = req.body as { courseId: string; assignmentId: string };
  if (!courseId || !assignmentId) {
    res.status(400).json({ error: "courseId and assignmentId required" }); return;
  }

  try {
    const creds = await getCanvasCredentials(req.userId!);
    if (!creds) { res.status(400).json({ error: "Canvas not configured" }); return; }

    const assignment = await canvasFetch(creds.baseUrl, creds.apiKey,
      `/courses/${courseId}/assignments/${assignmentId}`);

    const description = (assignment.description ?? "")
      .replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

    let canvas_rubric_summary: string | null = null;
    if (Array.isArray(assignment.rubric) && assignment.rubric.length > 0) {
      canvas_rubric_summary = (assignment.rubric as Array<{ description?: string; points?: number }>)
        .map((c) => `- ${c.description ?? "criterion"} (${c.points ?? 0} pts)`).join("\n");
    }

    let attachment_names: string[] = [];
    try {
      const submission = await canvasFetch(creds.baseUrl, creds.apiKey,
        `/courses/${courseId}/assignments/${assignmentId}/submissions/self`);
      if (Array.isArray(submission?.attachments)) {
        attachment_names = (submission.attachments as Array<{ display_name?: string }>)
          .map((f) => f.display_name ?? "").filter(Boolean);
      }
    } catch { /* non-fatal */ }

    const agentReq: AgentsAnalyzeRequest = {
      name: assignment.name,
      description,
      points_possible: assignment.points_possible ?? 100,
      submission_types: assignment.submission_types ?? [],
      due_at: assignment.due_at ?? null,
      grading_type: assignment.grading_type ?? "points",
      allowed_attempts: assignment.allowed_attempts ?? null,
      attachment_names,
      canvas_rubric_summary,
    };

    // Set SSE headers — must be set before any write
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    for await (const event of streamFromAgentsService(agentReq)) {
      if (event.type === "progress") {
        res.write(`event: progress\ndata: ${JSON.stringify({ step: event.step, label: event.label })}\n\n`);
      } else if (event.type === "done") {
        // Persist before forwarding
        try {
          await prisma.analysisResult.upsert({
            where:  { userId_courseId_assignmentId: { userId: req.userId!, courseId, assignmentId } },
            update: { rubric: event.result.rubric as object, milestones: event.result.milestones as object },
            create: { userId: req.userId!, courseId, assignmentId, rubric: event.result.rubric as object, milestones: event.result.milestones as object },
          });
        } catch (dbErr) {
          console.error("DB upsert failed during stream:", dbErr);
        }
        res.write(`event: done\ndata: ${JSON.stringify(event.result)}\n\n`);
        res.end();
        return;
      } else if (event.type === "error") {
        res.write(`event: error\ndata: ${JSON.stringify({ error: event.error })}\n\n`);
        res.end();
        return;
      }
    }
    res.end();
  } catch (err) {
    console.error("analyze/stream error:", err);
    if (!res.headersSent) {
      res.status(502).json({ error: err instanceof Error ? err.message : "Stream failed" });
    } else {
      res.write(`event: error\ndata: ${JSON.stringify({ error: "Internal server error" })}\n\n`);
      res.end();
    }
  }
});
```

Add import at the top of `assignments.ts` (add to existing import from `../lib/agents`):
```typescript
import { callAgentsService, streamFromAgentsService, type AgentsAnalyzeRequest } from "../lib/agents";
```

**Step 3: tsc check**
```bash
cd /home/max/Documents/Projects/Ai-Hackathon/apps/server && npx tsc --noEmit
```
Expected: no errors (the `@ts-expect-error` handles the Node body iteration typing).

**Step 4: Commit**
```bash
git add apps/server/src/lib/agents.ts apps/server/src/routes/assignments.ts
git commit -m "feat(server): SSE proxy for analyze/stream — persists on done event"
```

---

## Task 5: SSE streaming — extension

**Files:**
- Modify: `apps/extension/src/lib/api.ts`
- Modify: `apps/extension/src/hooks/useAnalysis.ts`
- Modify: `apps/extension/src/components/views/AssignmentDetailView.tsx`

**Step 1: Add `streamAnalysis` async generator to `apps/extension/src/lib/api.ts`**

Add after `getAnalysisResult`:

```typescript
export type StreamEvent =
  | { type: "progress"; step: number; label: string }
  | { type: "done";     result: AnalysisResult }
  | { type: "error";    error: string };

export async function* streamAnalysis(
  jwt: string,
  courseId: string,
  assignmentId: string
): AsyncGenerator<StreamEvent> {
  const response = await fetch(`${BASE_URL}/assignments/analyze/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`,
    },
    body: JSON.stringify({ courseId, assignmentId }),
  });

  if (!response.ok || !response.body) {
    yield { type: "error", error: `HTTP ${response.status}` };
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";

    for (const raw of events) {
      if (!raw.trim()) continue;
      const lines = raw.split("\n");
      const eventType = lines.find((l) => l.startsWith("event:"))?.slice(6).trim();
      const dataStr   = lines.find((l) => l.startsWith("data:"))?.slice(5).trim();
      if (!dataStr) continue;
      try {
        const data = JSON.parse(dataStr) as Record<string, unknown>;
        if (eventType === "progress") {
          yield { type: "progress", step: data.step as number, label: data.label as string };
        } else if (eventType === "done") {
          yield { type: "done", result: data as unknown as AnalysisResult };
        } else if (eventType === "error") {
          yield { type: "error", error: (data.error as string) ?? "Unknown error" };
        }
      } catch { /* malformed chunk — skip */ }
    }
  }
}
```

**Step 2: Rewrite `apps/extension/src/hooks/useAnalysis.ts`**

Replace the entire file:

```typescript
import { useState } from "react";
import { streamAnalysis, getAnalysisResult } from "@/lib/api";
import type { AnalysisResult } from "@/types/analysis";

export type AnalysisStatus = "idle" | "loading" | "done" | "error";

export function useAnalysis(jwt: string | null) {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [error, setError]   = useState<string | null>(null);
  const [step, setStep]     = useState(0);

  async function loadExisting(courseId: string, assignmentId: string) {
    if (!jwt) return;
    const existing = await getAnalysisResult(jwt, courseId, assignmentId);
    if (existing) { setResult(existing); setStatus("done"); }
  }

  async function analyze(courseId: string, assignmentId: string) {
    if (!jwt) return;
    setStatus("loading");
    setStep(0);
    setError(null);
    try {
      for await (const event of streamAnalysis(jwt, courseId, assignmentId)) {
        if (event.type === "progress") {
          setStep(event.step);
        } else if (event.type === "done") {
          setResult(event.result);
          setStatus("done");
        } else if (event.type === "error") {
          setError(event.error);
          setStatus("error");
        }
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Analysis failed");
      setStatus("error");
    }
  }

  function reset() { setResult(null); setStatus("idle"); setError(null); setStep(0); }

  return { result, status, error, step, analyze, loadExisting, reset };
}
```

**Step 3: Update `AssignmentDetailView` to use real `step` from hook, remove timer**

In `apps/extension/src/components/views/AssignmentDetailView.tsx`:

1. Change the `useAnalysis` destructure to include `step`:
```tsx
  const { result, status, error, step, analyze, loadExisting } = useAnalysis(jwt);
```

2. Remove the `stepIdx` state and its timer `useEffect` (both lines):
```tsx
  // DELETE: const [stepIdx, setStepIdx] = useState(0);
  // DELETE: the useEffect for the timer
```

3. Replace `stepIdx` with `step` in the loading JSX — change every `stepIdx` reference to `step`.

The loading section becomes:
```tsx
        {status === "loading" && (
          <div className="flex flex-col items-center justify-center flex-1 gap-5 px-4">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <div className="w-full flex flex-col gap-2">
              {STEPS.map((label, i) => (
                <div key={label} className={`flex items-center gap-3 text-sm transition-all duration-500 ${i <= step ? "opacity-100" : "opacity-30"}`}>
                  {i < step ? (
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  ) : i === step ? (
                    <Loader2 className="h-4 w-4 text-primary animate-spin shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                  <span className={i === step ? "text-foreground font-medium" : "text-muted-foreground"}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
```

**Step 4: Verify TypeScript**
```bash
cd /home/max/Documents/Projects/Ai-Hackathon/apps/extension && pnpm exec tsc --noEmit
```

**Step 5: Build check**
```bash
cd /home/max/Documents/Projects/Ai-Hackathon/apps/extension && pnpm build
```
Expected: success, no errors.

**Step 6: Commit**
```bash
git add apps/extension/src/lib/api.ts apps/extension/src/hooks/useAnalysis.ts apps/extension/src/components/views/AssignmentDetailView.tsx
git commit -m "feat(extension): SSE streaming — real step progress replaces fake timer"
```

---

## Task 6: analysisResults map — server endpoint + extension

**Files:**
- Modify: `apps/server/src/routes/assignments.ts`
- Modify: `apps/extension/src/lib/api.ts`
- Modify: `apps/extension/src/App.tsx`

**Step 1: Add `GET /assignments/results` to `apps/server/src/routes/assignments.ts`**

Add before `export default router`:
```typescript
// GET /assignments/results — list all analyzed assignments for current user
router.get("/results", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const results = await prisma.analysisResult.findMany({
      where: { userId: req.userId! },
      select: { courseId: true, assignmentId: true, updatedAt: true },
    });
    res.json(results);
  } catch (err) {
    console.error("get results error:", err);
    res.status(500).json({ error: "Failed to retrieve results" });
  }
});
```

**Step 2: Add `fetchAnalysisResults` to `apps/extension/src/lib/api.ts`**

Add after `streamAnalysis`:
```typescript
export interface AnalysisResultMeta {
  courseId: string;
  assignmentId: string;
  updatedAt: string;
}

export async function fetchAnalysisResults(jwt: string): Promise<AnalysisResultMeta[]> {
  return apiFetch<AnalysisResultMeta[]>("/assignments/results", {}, jwt);
}
```

**Step 3: Update `apps/extension/src/App.tsx`**

Change `analysisResults` from static empty state to populated state:

1. Replace:
```typescript
  const [analysisResults] = useState<Record<string, AnalysisResult>>({});
```
With:
```typescript
  const [analysisResultKeys, setAnalysisResultKeys] = useState<Set<string>>(new Set());
```

2. Add a new import at the top:
```typescript
import { apiFetch, fetchAnalysisResults } from "@/lib/api";
```
(replace the existing `apiFetch` import)

3. Add a `useEffect` after the existing `useAssignments` call that fetches result keys when JWT is available:
```typescript
  useEffect(() => {
    if (!jwt) return;
    fetchAnalysisResults(jwt)
      .then((results) => {
        setAnalysisResultKeys(new Set(results.map((r) => `${r.courseId}-${r.assignmentId}`)));
      })
      .catch(() => { /* non-fatal */ });
  }, [jwt]);
```

4. Add a callback passed to `AssignmentDetailView` to update the set when an analysis completes. Update the `AssignmentDetailView` render to pass a callback:

Add a handler function in the component:
```typescript
  const handleAnalysisDone = (courseId: string, assignmentId: string) => {
    setAnalysisResultKeys((prev) => new Set([...prev, `${courseId}-${assignmentId}`]));
  };
```

5. Update `TodayView` props — replace `analysisResults={analysisResults}` with:
```tsx
  analysisResults={Object.fromEntries([...analysisResultKeys].map(k => [k, {} as AnalysisResult]))}
```

Actually, simpler: change `TodayView`'s prop from `Record<string, AnalysisResult>` to `Set<string>` (just needs to know which keys exist, not the full data). But that requires updating `TodayView` too. Instead, keep the interface and pass a record with empty AnalysisResult values — `hasAnalysis` only checks `key in analysisResults`.

So pass: `analysisResults={Object.fromEntries([...analysisResultKeys].map((k) => [k, null as unknown as AnalysisResult]))}` — this is a bit ugly. Better approach:

Change `analysisResults` prop in `TodayView` to just `analyzedKeys: Set<string>`. Update TodayView to use `analyzedKeys.has(key)` instead of `key in analysisResults`. This is cleaner.

**TodayView interface change** (in `apps/extension/src/components/views/TodayView.tsx`):
- Change `analysisResults: Record<string, AnalysisResult>` → `analyzedKeys: Set<string>`
- Change `hasAnalysis={key in analysisResults}` → `hasAnalysis={analyzedKeys.has(key)}`
- Remove the `AnalysisResult` import since it's no longer used

In `App.tsx` pass `analyzedKeys={analysisResultKeys}` instead.

**Step 4: Pass `onAnalysisDone` to `AssignmentDetailView`**

Add `onAnalysisDone?: (courseId: string, assignmentId: string) => void` to `AssignmentDetailView`'s Props interface, and call it when `status === "done"` in the analyze flow. Actually simpler: add `onAnalysisDone` callback prop, call it inside a `useEffect` when status transitions to "done":

In `AssignmentDetailView.tsx`, add to Props:
```tsx
  onAnalysisDone?: (courseId: string, assignmentId: string) => void;
```

Add a `useEffect`:
```tsx
  useEffect(() => {
    if (status === "done" && result) {
      onAnalysisDone?.(courseId, assignmentId);
    }
  }, [status, result]);
```

In `App.tsx`, pass `onAnalysisDone={handleAnalysisDone}`.

**Step 5: tsc + build**
```bash
cd /home/max/Documents/Projects/Ai-Hackathon/apps/server && npx tsc --noEmit
cd /home/max/Documents/Projects/Ai-Hackathon/apps/extension && pnpm exec tsc --noEmit && pnpm build
```

**Step 6: Commit**
```bash
git add apps/server/src/routes/assignments.ts apps/extension/src/lib/api.ts apps/extension/src/App.tsx apps/extension/src/components/views/TodayView.tsx apps/extension/src/components/views/AssignmentDetailView.tsx
git commit -m "feat: analysisResults map populated from DB — Sparkles indicator now live"
```

---

## Task 7: UI polish

**Files:**
- Modify: `apps/extension/src/components/views/AssignmentDetailView.tsx`
- Modify: `apps/extension/src/components/views/TodayView.tsx`
- Modify: `apps/extension/src/components/AssignmentCard.tsx`

### AssignmentDetailView improvements

**A — Assignment description preview above the Analyze button (idle state)**

In the idle state div, after the badge and before the button, add:
```tsx
            {assignment.description && (
              <div className="w-full text-left bg-muted/40 rounded-lg p-3">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Assignment</p>
                <p className="text-xs text-foreground leading-relaxed line-clamp-5">
                  {assignment.description.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()}
                </p>
              </div>
            )}
```

**B — Color-coded rubric levels**

Replace the level rows in the expanded criterion section with color-coded variants:

```tsx
                        {c.levels.map((l, j) => {
                          const levelColor = j === 0
                            ? "text-emerald-600 dark:text-emerald-400"   // Excellent
                            : j === 1
                            ? "text-blue-600 dark:text-blue-400"         // Proficient
                            : j === 2
                            ? "text-amber-600 dark:text-amber-400"       // Developing
                            : "text-rose-600 dark:text-rose-400";        // Beginning
                          return (
                            <div key={j} className="flex justify-between items-center text-xs py-0.5">
                              <span className={`font-medium ${levelColor}`}>{l.label}</span>
                              <span className="text-muted-foreground">{l.points} pts</span>
                            </div>
                          );
                        })}
```

**C — Milestone order badge**

In the milestone cards, show the order number prominently. Replace the `Circle`/`CheckCircle2` section:

```tsx
                    <button
                      className="w-full p-3 text-left flex items-start gap-3"
                      onClick={() => toggleMilestone(i)}
                    >
                      <div className="shrink-0 mt-0.5">
                        {checkedMilestones.has(i) ? (
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        ) : (
                          <div className="h-4 w-4 rounded-full bg-muted border border-border flex items-center justify-center">
                            <span className="text-[9px] font-bold text-muted-foreground">{m.order}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className={`text-sm font-medium leading-snug ${checkedMilestones.has(i) ? "line-through text-muted-foreground" : "text-foreground"}`}>
                          {m.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{m.description}</p>
                        <p className="text-[10px] text-muted-foreground/70 mt-1">~{m.estimatedHours}h · {m.deliverable}</p>
                      </div>
                    </button>
```

**D — Rubric header with total points**

Replace the rubric section header:
```tsx
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Rubric</p>
                <span className="text-[10px] text-muted-foreground">{result.rubric.totalPoints} pts total</span>
              </div>
```

### TodayView stats row

Add a quick stats row between the greeting and the assignment list. After the greeting `<div className="shrink-0">`, add before the list div:

```tsx
      {!loading && assignments.length > 0 && (
        <div className="grid grid-cols-3 gap-2 shrink-0">
          {[
            { label: "Due today", value: dueToday },
            { label: "Upcoming",  value: upcoming.length },
            { label: "All",       value: assignments.length },
          ].map((s) => (
            <div key={s.label} className="bg-muted/40 rounded-lg py-2 px-2 text-center">
              <p className="text-lg font-bold text-primary leading-none">{s.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-none">{s.label}</p>
            </div>
          ))}
        </div>
      )}
```

### AssignmentCard — richer analyzed indicator

Replace the Sparkles span with a small labeled badge when analyzed:
```tsx
            {hasAnalysis && (
              <span className="inline-flex items-center gap-0.5 bg-primary/10 text-primary rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide shrink-0">
                <Sparkles className="h-2.5 w-2.5" />
                AI
              </span>
            )}
```

**Step 1: Apply all UI changes described above**

Read each file, apply the changes, and verify they look correct.

**Step 2: tsc + build**
```bash
cd /home/max/Documents/Projects/Ai-Hackathon/apps/extension && pnpm exec tsc --noEmit && pnpm build
```

**Step 3: Commit**
```bash
git add apps/extension/src/components/views/AssignmentDetailView.tsx apps/extension/src/components/views/TodayView.tsx apps/extension/src/components/AssignmentCard.tsx
git commit -m "feat(ui): color-coded rubric levels, milestone order badges, stats row, description preview, AI badge"
```
