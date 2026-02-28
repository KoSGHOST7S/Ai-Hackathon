# Submit for Review — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a "Submit for Review" feature where students upload their work (PDF/DOCX/text) and a team of 3 AI agents scores it against the generated rubric, producing a full scorecard with per-criterion feedback, strengths, improvements, and next steps.

**Architecture:** Three new agents (scorer → feedback writer → reviewer) in a sequential pipeline, mirroring the existing analysis pipeline pattern. New Prisma model `ReviewResult`. Server handles file upload + forwarding. Extension adds SubmitPage (file/text input) and ReviewPage (scorecard display) as sub-pages.

**Tech Stack:** Same as existing — Python FastAPI, Express, React, Prisma, SSE streaming.

---

## Tasks

### Task 1: Review models + prompts (Python)

**Files:**
- Create: `apps/agents/models/review.py`
- Modify: `apps/agents/lib/prompts.py`

**Step 1: Create `apps/agents/models/review.py`**

```python
from pydantic import BaseModel
from models.assignment import FileContent, Rubric


class ReviewRequest(BaseModel):
    assignment_name: str
    assignment_description: str
    rubric: Rubric
    submission_text: str = ""
    submission_files: list[FileContent] = []


class CriterionScore(BaseModel):
    criterionName: str
    level: str
    points: int
    maxPoints: int
    feedback: str


class ReviewResponse(BaseModel):
    scores: list[CriterionScore]
    totalScore: int
    totalPossible: int
    strengths: list[str]
    improvements: list[str]
    nextSteps: list[str]
```

**Step 2: Add 3 prompts to `apps/agents/lib/prompts.py`**

Append:
```python
SCORER_SYSTEM = """You are an academic grading expert. Given a student submission, an assignment description, \
and a grading rubric, score each rubric criterion. Return valid JSON matching this exact schema:
{"scores":[{"criterionName":str,"level":str,"points":int,"maxPoints":int,"feedback":str}],"totalScore":int,"totalPossible":int}
Rules:
- level must be one of: Excellent, Proficient, Developing, Beginning
- points must match the level's point value from the rubric
- feedback must be 1-2 sentences explaining why the student earned that level, citing specific evidence from their submission
- totalScore must equal the sum of all criterion points
- totalPossible must equal the sum of all criterion maxPoints
Return ONLY the JSON object."""

FEEDBACK_SYSTEM = """You are an encouraging academic mentor. Given a scored rubric and the student's submission, \
write constructive feedback. Return valid JSON matching this exact schema:
{"strengths":[str],"improvements":[str],"nextSteps":[str]}
Rules:
- strengths: 2-4 specific things the student did well, citing evidence
- improvements: 2-4 specific areas to improve, with concrete examples from their work
- nextSteps: 2-4 actionable steps the student should take next, ordered by priority
- Be encouraging but honest. Reference specific parts of the submission.
Return ONLY the JSON object."""

REVIEW_VALIDATOR_SYSTEM = """You are an academic quality assurance reviewer. Given a complete review (scores + feedback), \
verify that: (1) every rubric criterion was scored, (2) assigned levels match the point values, \
(3) feedback is specific and evidence-based, (4) strengths/improvements/nextSteps are actionable. \
Return the complete corrected review as valid JSON matching this schema:
{"scores":[{"criterionName":str,"level":str,"points":int,"maxPoints":int,"feedback":str}],"totalScore":int,"totalPossible":int,"strengths":[str],"improvements":[str],"nextSteps":[str]}
Return ONLY the JSON object."""
```

**Step 3: Verify**
```bash
cd apps/agents && uv run python -c "from models.review import ReviewRequest, ReviewResponse; from lib.prompts import SCORER_SYSTEM; print('OK')"
```

**Step 4: Commit**
```bash
git add apps/agents/
git commit -m "feat(agents): review models + scorer/feedback/reviewer prompts"
```

---

### Task 2: Review agents + pipeline (Python)

**Files:**
- Create: `apps/agents/agents/scorer.py`
- Create: `apps/agents/agents/feedback_writer.py`
- Create: `apps/agents/agents/review_validator.py`
- Create: `apps/agents/workflow/review_pipeline.py`

**Step 1: Create `apps/agents/agents/scorer.py`**

```python
import json
from ibm_watsonx_ai.foundation_models import ModelInference
from models.review import ReviewRequest
from lib.prompts import SCORER_SYSTEM


async def score_submission(request: ReviewRequest, model: ModelInference) -> dict:
    submission = request.submission_text
    if request.submission_files:
        for f in request.submission_files:
            submission += f"\n\n--- {f.name} ---\n{f.text[:5000]}"

    user_msg = (
        f"Assignment: {request.assignment_name}\n\n"
        f"Description:\n{request.assignment_description}\n\n"
        f"Rubric:\n{request.rubric.model_dump_json(indent=2)}\n\n"
        f"Student submission:\n{submission}"
    )
    resp = model.chat(messages=[
        {"role": "system", "content": SCORER_SYSTEM},
        {"role": "user", "content": user_msg},
    ])
    raw = resp["choices"][0]["message"]["content"].strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1].lstrip()
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()
    return json.loads(raw)
```

**Step 2: Create `apps/agents/agents/feedback_writer.py`**

```python
import json
from ibm_watsonx_ai.foundation_models import ModelInference
from models.review import ReviewRequest
from lib.prompts import FEEDBACK_SYSTEM


async def write_feedback(request: ReviewRequest, scores: dict, model: ModelInference) -> dict:
    submission = request.submission_text
    if request.submission_files:
        for f in request.submission_files:
            submission += f"\n\n--- {f.name} ---\n{f.text[:5000]}"

    user_msg = (
        f"Assignment: {request.assignment_name}\n\n"
        f"Scored rubric:\n{json.dumps(scores, indent=2)}\n\n"
        f"Student submission:\n{submission}"
    )
    resp = model.chat(messages=[
        {"role": "system", "content": FEEDBACK_SYSTEM},
        {"role": "user", "content": user_msg},
    ])
    raw = resp["choices"][0]["message"]["content"].strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1].lstrip()
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()
    return json.loads(raw)
```

**Step 3: Create `apps/agents/agents/review_validator.py`**

```python
import json
from ibm_watsonx_ai.foundation_models import ModelInference
from models.review import ReviewResponse
from lib.prompts import REVIEW_VALIDATOR_SYSTEM


async def validate_review(combined: dict, model: ModelInference) -> ReviewResponse:
    user_msg = f"Complete review to validate:\n{json.dumps(combined, indent=2)}"
    resp = model.chat(messages=[
        {"role": "system", "content": REVIEW_VALIDATOR_SYSTEM},
        {"role": "user", "content": user_msg},
    ])
    raw = resp["choices"][0]["message"]["content"].strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1].lstrip()
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()
    try:
        return ReviewResponse.model_validate(json.loads(raw))
    except Exception:
        return ReviewResponse.model_validate(combined)
```

**Step 4: Create `apps/agents/workflow/review_pipeline.py`**

```python
import json
from collections.abc import AsyncGenerator

from models.review import ReviewRequest, ReviewResponse
from agents.scorer import score_submission
from agents.feedback_writer import write_feedback
from agents.review_validator import validate_review
from lib.watsonx import get_model


async def run_review(request: ReviewRequest) -> ReviewResponse:
    model = get_model()
    scores = await score_submission(request, model)
    feedback = await write_feedback(request, scores, model)
    combined = {**scores, **feedback}
    return await validate_review(combined, model)


async def stream_review(request: ReviewRequest) -> AsyncGenerator[str, None]:
    model = get_model()

    yield f'event: progress\ndata: {json.dumps({"step": 0, "label": "Scoring submission…"})}\n\n'
    scores = await score_submission(request, model)

    yield f'event: progress\ndata: {json.dumps({"step": 1, "label": "Writing feedback…"})}\n\n'
    feedback = await write_feedback(request, scores, model)

    yield f'event: progress\ndata: {json.dumps({"step": 2, "label": "Validating review…"})}\n\n'
    combined = {**scores, **feedback}
    result = await validate_review(combined, model)

    yield f'event: done\ndata: {result.model_dump_json()}\n\n'
```

**Step 5: Add endpoints to `apps/agents/main.py`**

Add imports and two routes:
```python
from models.review import ReviewRequest, ReviewResponse
from workflow.review_pipeline import run_review, stream_review

@app.post("/review", response_model=ReviewResponse)
async def review(req: ReviewRequest) -> ReviewResponse:
    try:
        return await run_review(req)
    except Exception as exc:
        logging.exception("Review pipeline failed")
        raise HTTPException(status_code=502, detail=str(exc))

@app.post("/review/stream")
async def review_stream(req: ReviewRequest) -> StreamingResponse:
    async def event_generator():
        try:
            async for chunk in stream_review(req):
                yield chunk
        except Exception as exc:
            logging.exception("Stream review failed")
            yield f'event: error\ndata: {json.dumps({"error": str(exc)})}\n\n'
    return StreamingResponse(event_generator(), media_type="text/event-stream")
```

**Step 6: Verify**
```bash
cd apps/agents && uv run python -c "from workflow.review_pipeline import run_review, stream_review; print('OK')"
```

**Step 7: Commit**
```bash
git add apps/agents/
git commit -m "feat(agents): review pipeline — scorer, feedback writer, reviewer agents + SSE streaming"
```

---

### Task 3: DB model + server endpoints

**Files:**
- Modify: `apps/server/prisma/schema.prisma`
- Modify: `apps/server/src/lib/agents.ts`
- Modify: `apps/server/src/routes/assignments.ts`

**Step 1: Add `ReviewResult` to Prisma schema**

Add to `schema.prisma` after `AnalysisResult`:
```prisma
model ReviewResult {
  id           String   @id @default(cuid())
  userId       String
  courseId      String
  assignmentId String
  scores       Json
  totalScore   Int
  totalPossible Int
  strengths    Json
  improvements Json
  nextSteps    Json
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, courseId, assignmentId])
}
```

Add `reviewResults ReviewResult[]` to the `User` model.

**Step 2: Run migration**
```bash
cd apps/server && npx prisma migrate dev --name add_review_result
```

**Step 3: Add review types to `agents.ts`**

```typescript
export interface CriterionScore {
  criterionName: string; level: string; points: number; maxPoints: number; feedback: string;
}
export interface ReviewResponse {
  scores: CriterionScore[];
  totalScore: number; totalPossible: number;
  strengths: string[]; improvements: string[]; nextSteps: string[];
}
export interface ReviewRequest {
  assignment_name: string;
  assignment_description: string;
  rubric: Rubric;
  submission_text: string;
  submission_files: FileContent[];
}

export async function* streamReview(req: ReviewRequest): AsyncGenerator<SseProgressEvent | { type: "done"; result: ReviewResponse } | SseErrorEvent> {
  const res = await fetch(`${AGENTS_URL}/review/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok || !res.body) {
    yield { type: "error", error: `Review service error ${res.status}` }; return;
  }
  const decoder = new TextDecoder();
  let buffer = "";
  for await (const chunk of res.body as AsyncIterable<Uint8Array>) {
    buffer += decoder.decode(chunk, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";
    for (const raw of events) {
      if (!raw.trim()) continue;
      const lines = raw.split("\n");
      const eventType = lines.find((l) => l.startsWith("event:"))?.slice(6).trim();
      const dataStr = lines.find((l) => l.startsWith("data:"))?.slice(5).trim();
      if (!dataStr) continue;
      try {
        const data = JSON.parse(dataStr);
        if (eventType === "progress") yield { type: "progress", step: data.step, label: data.label };
        else if (eventType === "done") yield { type: "done", result: data as ReviewResponse };
        else if (eventType === "error") yield { type: "error", error: data.error };
      } catch { /* skip */ }
    }
  }
}
```

**Step 4: Add review routes to `assignments.ts`**

Import `streamReview` and `ReviewRequest` from agents.ts. Add before `export default router`:

```typescript
// POST /assignments/:courseId/:assignmentId/review — submit work for review (SSE)
router.post("/:courseId/:assignmentId/review", requireAuth, async (req: AuthRequest, res: Response) => {
  const { courseId, assignmentId } = req.params;
  const { submission_text, submission_files } = req.body as {
    submission_text?: string;
    submission_files?: FileContent[];
  };
  if (!submission_text && (!submission_files || submission_files.length === 0)) {
    res.status(400).json({ error: "Provide submission_text or submission_files" }); return;
  }

  try {
    const analysis = await prisma.analysisResult.findUnique({
      where: { userId_courseId_assignmentId: { userId: req.userId!, courseId, assignmentId } },
    });
    if (!analysis) { res.status(404).json({ error: "Analyze the assignment first" }); return; }

    const creds = await getCanvasCredentials(req.userId!);
    if (!creds) { res.status(400).json({ error: "Canvas not configured" }); return; }

    const assignment = await canvasFetch(creds.baseUrl, creds.apiKey,
      `/courses/${courseId}/assignments/${assignmentId}`);
    const description = (assignment.description ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

    const reviewReq: ReviewRequest = {
      assignment_name: assignment.name,
      assignment_description: description,
      rubric: analysis.rubric as any,
      submission_text: submission_text ?? "",
      submission_files: submission_files ?? [],
    };

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    for await (const event of streamReview(reviewReq)) {
      if (event.type === "progress") {
        res.write(`event: progress\ndata: ${JSON.stringify({ step: event.step, label: event.label })}\n\n`);
      } else if (event.type === "done") {
        try {
          await prisma.reviewResult.upsert({
            where: { userId_courseId_assignmentId: { userId: req.userId!, courseId, assignmentId } },
            update: {
              scores: event.result.scores as object[], totalScore: event.result.totalScore,
              totalPossible: event.result.totalPossible, strengths: event.result.strengths,
              improvements: event.result.improvements, nextSteps: event.result.nextSteps,
            },
            create: {
              userId: req.userId!, courseId, assignmentId,
              scores: event.result.scores as object[], totalScore: event.result.totalScore,
              totalPossible: event.result.totalPossible, strengths: event.result.strengths,
              improvements: event.result.improvements, nextSteps: event.result.nextSteps,
            },
          });
        } catch (e) { console.error("Review DB upsert failed:", e); }
        res.write(`event: done\ndata: ${JSON.stringify(event.result)}\n\n`);
        res.end(); return;
      } else if (event.type === "error") {
        res.write(`event: error\ndata: ${JSON.stringify({ error: event.error })}\n\n`);
        res.end(); return;
      }
    }
    res.end();
  } catch (err) {
    console.error("review error:", err);
    if (!res.headersSent) res.status(502).json({ error: "Review failed" });
    else { res.write(`event: error\ndata: ${JSON.stringify({ error: "Internal error" })}\n\n`); res.end(); }
  }
});

// GET /assignments/:courseId/:assignmentId/review — get cached review
router.get("/:courseId/:assignmentId/review", requireAuth, async (req: AuthRequest, res: Response) => {
  const { courseId, assignmentId } = req.params;
  try {
    const result = await prisma.reviewResult.findUnique({
      where: { userId_courseId_assignmentId: { userId: req.userId!, courseId, assignmentId } },
    });
    if (!result) { res.status(404).json({ error: "No review found" }); return; }
    res.json(result);
  } catch (err) {
    console.error("get review error:", err);
    res.status(500).json({ error: "Failed to retrieve review" });
  }
});
```

Import `ReviewRequest` type from agents.

**Step 5: tsc check**
```bash
cd apps/server && npx tsc --noEmit
```

**Step 6: Commit**
```bash
git add apps/server/
git commit -m "feat(server): review endpoints + ReviewResult persistence"
```

---

### Task 4: Extension — review types + API + hook

**Files:**
- Modify: `apps/extension/src/types/analysis.ts`
- Modify: `apps/extension/src/lib/api.ts`
- Create: `apps/extension/src/hooks/useReview.ts`

**Step 1: Add review types to `analysis.ts`**

```typescript
export interface CriterionScore {
  criterionName: string; level: string; points: number; maxPoints: number; feedback: string;
}
export interface ReviewResult {
  scores: CriterionScore[];
  totalScore: number;
  totalPossible: number;
  strengths: string[];
  improvements: string[];
  nextSteps: string[];
}
```

**Step 2: Add API functions to `api.ts`**

```typescript
export type ReviewStreamEvent =
  | { type: "progress"; step: number; label: string }
  | { type: "done"; result: ReviewResult }
  | { type: "error"; error: string };

export async function* streamReviewSubmission(
  jwt: string, courseId: string, assignmentId: string,
  body: { submission_text?: string; submission_files?: Array<{ name: string; text: string }> }
): AsyncGenerator<ReviewStreamEvent> {
  const response = await fetch(`${BASE_URL}/assignments/${courseId}/${assignmentId}/review`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${jwt}` },
    body: JSON.stringify(body),
  });
  if (!response.ok || !response.body) {
    yield { type: "error", error: `HTTP ${response.status}` }; return;
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
      const dataStr = lines.find((l) => l.startsWith("data:"))?.slice(5).trim();
      if (!dataStr) continue;
      try {
        const data = JSON.parse(dataStr);
        if (eventType === "progress") yield { type: "progress", step: data.step, label: data.label };
        else if (eventType === "done") yield { type: "done", result: data as ReviewResult };
        else if (eventType === "error") yield { type: "error", error: data.error };
      } catch { /* skip */ }
    }
  }
}

export async function getReviewResult(
  jwt: string, courseId: string, assignmentId: string
): Promise<ReviewResult | null> {
  try { return await apiFetch<ReviewResult>(`/assignments/${courseId}/${assignmentId}/review`, {}, jwt); }
  catch { return null; }
}
```

**Step 3: Create `apps/extension/src/hooks/useReview.ts`**

```typescript
import { useState } from "react";
import { streamReviewSubmission, getReviewResult } from "@/lib/api";
import type { ReviewResult } from "@/types/analysis";

export type ReviewStatus = "idle" | "loading" | "done" | "error";

export function useReview(jwt: string | null) {
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [status, setStatus] = useState<ReviewStatus>("idle");
  const [error, setError]   = useState<string | null>(null);
  const [step, setStep]     = useState(0);

  async function loadExisting(courseId: string, assignmentId: string) {
    if (!jwt) return;
    const existing = await getReviewResult(jwt, courseId, assignmentId);
    if (existing) { setResult(existing); setStatus("done"); }
  }

  async function submitForReview(
    courseId: string, assignmentId: string,
    body: { submission_text?: string; submission_files?: Array<{ name: string; text: string }> }
  ) {
    if (!jwt) return;
    setStatus("loading"); setStep(0); setError(null);
    try {
      for await (const event of streamReviewSubmission(jwt, courseId, assignmentId, body)) {
        if (event.type === "progress") setStep(event.step);
        else if (event.type === "done") { setResult(event.result); setStatus("done"); }
        else if (event.type === "error") { setError(event.error); setStatus("error"); }
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Review failed"); setStatus("error");
    }
  }

  function reset() { setResult(null); setStatus("idle"); setError(null); setStep(0); }
  return { result, status, error, step, submitForReview, loadExisting, reset };
}
```

**Step 4: Commit**
```bash
git add apps/extension/src/
git commit -m "feat(extension): review types, API stream helper, useReview hook"
```

---

### Task 5: Extension — SubmitPage + ReviewPage + wire into detail view

**Files:**
- Create: `apps/extension/src/components/views/SubmitPage.tsx`
- Create: `apps/extension/src/components/views/ReviewPage.tsx`
- Modify: `apps/extension/src/hooks/useSubPage.ts` (add "submit" and "review" sub-page types)
- Modify: `apps/extension/src/components/views/AssignmentDetailView.tsx`

**Step 1: Update `useSubPage.ts`**

Add two new sub-page types:
```typescript
export type SubPage =
  | { type: "description" }
  | { type: "criterion"; index: number }
  | { type: "milestone"; index: number }
  | { type: "chat" }
  | { type: "submit" }
  | { type: "review" };
```

Add:
```typescript
  const openSubmit  = useCallback(() => setSubPage({ type: "submit" }), []);
  const openReview  = useCallback(() => setSubPage({ type: "review" }), []);
```

Return them.

**Step 2: Create `SubmitPage.tsx`**

Input form with two modes: file upload or text paste. Uses the `/parse-file` endpoint (via the existing agents service) to extract text from uploaded files. On submit, calls `useReview.submitForReview` then navigates to review page.

```tsx
import { useState, useRef } from "react";
import { Upload, FileText, Loader2, Send } from "lucide-react";
import { SubPageHeader } from "./SubPageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const REVIEW_STEPS = ["Scoring submission…", "Writing feedback…", "Validating review…"];

interface Props {
  assignmentName: string;
  courseId: string;
  assignmentId: string;
  jwt: string;
  reviewStep: number;
  reviewStatus: string;
  reviewError: string | null;
  onSubmit: (body: { submission_text?: string; submission_files?: Array<{ name: string; text: string }> }) => void;
  onBack: () => void;
}

export function SubmitPage({ assignmentName, courseId, assignmentId, jwt, reviewStep, reviewStatus, reviewError, onSubmit, onBack }: Props) {
  const [mode, setMode] = useState<"file" | "text">("file");
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileText, setFileText] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setParsing(true);
    setFileName(file.name);
    try {
      const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
      // Parse via agents service directly (the server doesn't have a parse endpoint, but we can go through /parse-file on agents)
      // Actually, let's send to agents directly since server proxies might not be set up for file parsing
      // Better: read as text if .txt, or use the API
      if (file.name.endsWith(".txt")) {
        setFileText(await file.text());
      } else {
        // Send to agents service parse-file endpoint via the existing infrastructure
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("http://localhost:8000/parse-file", { method: "POST", body: form });
        if (!res.ok) throw new Error("Failed to parse file");
        const data = await res.json();
        setFileText(data.text);
      }
    } catch {
      setFileText(null);
      setFileName(null);
    } finally {
      setParsing(false);
    }
  }

  function handleSubmit() {
    if (mode === "text" && text.trim()) {
      onSubmit({ submission_text: text.trim() });
    } else if (mode === "file" && fileText && fileName) {
      onSubmit({ submission_files: [{ name: fileName, text: fileText }] });
    }
  }

  const canSubmit = (mode === "text" && text.trim().length > 0) || (mode === "file" && fileText !== null);

  if (reviewStatus === "loading") {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <SubPageHeader title="Reviewing…" onBack={onBack} />
        <div className="flex-1 flex flex-col items-center justify-center gap-5 px-4">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <div className="w-full flex flex-col gap-2">
            {REVIEW_STEPS.map((label, i) => (
              <div key={label} className={`flex items-center gap-3 text-sm transition-all duration-500 ${i <= reviewStep ? "opacity-100" : "opacity-30"}`}>
                {i < reviewStep ? (
                  <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <span className="text-[9px] text-primary-foreground font-bold">✓</span>
                  </div>
                ) : i === reviewStep ? (
                  <Loader2 className="h-4 w-4 text-primary animate-spin shrink-0" />
                ) : (
                  <div className="h-4 w-4 rounded-full border border-muted-foreground/30 shrink-0" />
                )}
                <span className={i === reviewStep ? "text-foreground font-medium" : "text-muted-foreground"}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (reviewStatus === "error") {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <SubPageHeader title="Review Failed" onBack={onBack} />
        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-4 text-center">
          <p className="text-sm text-destructive font-medium">Review failed</p>
          <p className="text-xs text-muted-foreground">{reviewError}</p>
          <Button variant="outline" onClick={onBack}>Go back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <SubPageHeader title="Submit for Review" onBack={onBack} />
      <div className="flex-1 overflow-y-auto py-3 flex flex-col gap-3">
        <p className="text-xs text-muted-foreground">
          Upload or paste your work for <span className="font-medium text-foreground">{assignmentName}</span>. AI will score it against the rubric.
        </p>

        {/* Mode tabs */}
        <div className="flex gap-1 bg-muted rounded-lg p-0.5">
          <button
            onClick={() => setMode("file")}
            className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors ${mode === "file" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
          >
            Upload File
          </button>
          <button
            onClick={() => setMode("text")}
            className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors ${mode === "text" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
          >
            Paste Text
          </button>
        </div>

        {mode === "file" && (
          <div>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <Card
              className="shadow-none border-dashed cursor-pointer hover:bg-muted/40 transition-colors"
              onClick={() => fileRef.current?.click()}
            >
              <div className="p-6 flex flex-col items-center gap-2 text-center">
                {parsing ? (
                  <Loader2 className="h-6 w-6 text-primary animate-spin" />
                ) : fileName ? (
                  <>
                    <FileText className="h-6 w-6 text-primary" />
                    <p className="text-xs font-medium text-foreground">{fileName}</p>
                    <p className="text-[10px] text-muted-foreground">Click to replace</p>
                  </>
                ) : (
                  <>
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Click to upload .pdf, .docx, or .txt</p>
                  </>
                )}
              </div>
            </Card>
          </div>
        )}

        {mode === "text" && (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your work here…"
            className="w-full min-h-[160px] text-xs bg-muted rounded-lg p-3 outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground resize-none"
          />
        )}

        <Button className="w-full gap-2" disabled={!canSubmit} onClick={handleSubmit}>
          <Send className="h-3.5 w-3.5" />
          Submit for Review
        </Button>
      </div>
    </div>
  );
}
```

**Step 3: Create `ReviewPage.tsx`**

Full scorecard display.

```tsx
import { CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { SubPageHeader } from "./SubPageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ReviewResult } from "@/types/analysis";

interface Props {
  result: ReviewResult;
  onResubmit: () => void;
  onBack: () => void;
}

const LEVEL_COLORS: Record<string, string> = {
  "Excellent":   "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30",
  "Proficient":  "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30",
  "Developing":  "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30",
  "Beginning":   "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30",
};

function scoreColor(pct: number): string {
  if (pct >= 0.9) return "text-emerald-600 dark:text-emerald-400";
  if (pct >= 0.7) return "text-blue-600 dark:text-blue-400";
  if (pct >= 0.5) return "text-amber-600 dark:text-amber-400";
  return "text-rose-600 dark:text-rose-400";
}

export function ReviewPage({ result, onResubmit, onBack }: Props) {
  const pct = result.totalPossible > 0 ? result.totalScore / result.totalPossible : 0;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <SubPageHeader title="Review" onBack={onBack} />
      <div className="flex-1 overflow-y-auto py-3 flex flex-col gap-4">

        {/* Overall score */}
        <div className="text-center py-3">
          <p className={`text-3xl font-bold tabular-nums ${scoreColor(pct)}`}>
            {result.totalScore}<span className="text-lg text-muted-foreground font-normal">/{result.totalPossible}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">{Math.round(pct * 100)}%</p>
        </div>

        {/* Per-criterion scores */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Criteria Scores</p>
          <div className="flex flex-col gap-1.5">
            {result.scores.map((s, i) => (
              <Card key={i} className="shadow-none">
                <div className="p-3 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-foreground">{s.criterionName}</span>
                    <span className="text-[10px] tabular-nums text-muted-foreground">{s.points}/{s.maxPoints}</span>
                  </div>
                  <Badge className={`w-fit text-[10px] ${LEVEL_COLORS[s.level] ?? ""}`}>{s.level}</Badge>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{s.feedback}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Strengths */}
        {result.strengths.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Strengths</p>
            <div className="flex flex-col gap-1.5">
              {result.strengths.map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-foreground leading-relaxed">{s}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Improvements */}
        {result.improvements.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Areas to Improve</p>
            <div className="flex flex-col gap-1.5">
              {result.improvements.map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-foreground leading-relaxed">{s}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Steps */}
        {result.nextSteps.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Next Steps</p>
            <div className="flex flex-col gap-1.5">
              {result.nextSteps.map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[9px] font-bold text-primary">{i + 1}</span>
                  </div>
                  <p className="text-xs text-foreground leading-relaxed">{s}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Re-submit */}
        <Button variant="outline" className="w-full gap-2 text-xs" onClick={onResubmit}>
          <ArrowRight className="h-3 w-3" />
          Re-submit
        </Button>
      </div>
    </div>
  );
}
```

**Step 4: Wire into `AssignmentDetailView.tsx`**

Import `useReview`, `SubmitPage`, `ReviewPage`. Add `useReview(jwt)` call. Add sub-page routing for "submit" and "review". Add a "Submit for Review" entry point card in the done state (after milestones, before chat):

```tsx
// Entry point card (in the done state section)
<button
  onClick={reviewResult ? openReview : openSubmit}
  className="w-full flex items-center gap-3 bg-muted/40 rounded-lg p-3 hover:bg-muted/60 transition-colors"
>
  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
    <ClipboardCheck className="h-4 w-4 text-primary" />
  </div>
  <div className="flex-1 text-left">
    <p className="text-xs font-medium text-foreground">
      {reviewResult ? "View Review" : "Submit for Review"}
    </p>
    <p className="text-[10px] text-muted-foreground">
      {reviewResult ? `Score: ${reviewResult.totalScore}/${reviewResult.totalPossible}` : "Upload your work for AI scoring"}
    </p>
  </div>
  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
</button>
```

Sub-page routing additions:
```tsx
if (subPage.type === "submit") {
  return <SubmitPage
    assignmentName={assignment.name}
    courseId={courseId} assignmentId={assignmentId} jwt={jwt}
    reviewStep={reviewStep} reviewStatus={reviewStatus} reviewError={reviewError}
    onSubmit={(body) => { submitForReview(courseId, assignmentId, body); }}
    onBack={close}
  />;
}
if (subPage.type === "review" && reviewResult) {
  return <ReviewPage result={reviewResult} onResubmit={() => { reviewReset(); openSubmit(); }} onBack={close} />;
}
```

When review completes (status === "done"), auto-navigate to review page.

**Step 5: tsc + build**
```bash
cd apps/extension && pnpm exec tsc --noEmit && pnpm build
```

**Step 6: Commit**
```bash
git add apps/extension/src/
git commit -m "feat(extension): SubmitPage + ReviewPage — full AI scorecard with streaming"
```
