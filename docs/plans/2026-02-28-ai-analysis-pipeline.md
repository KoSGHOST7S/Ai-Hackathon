# AI Analysis Pipeline Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a multi-agent AI pipeline (IBM watsonx Granite) that analyzes a Canvas assignment and produces a validated rubric + milestone checklist, surfaced through a fully reworked extension UI with real assignment data.

**Architecture:** The Python `apps/agents` service owns all LLM calls — three sequential agents (rubric generator → validator → milestone builder) invoked via FastAPI. The Node.js server coordinates: it fetches Canvas content, calls the agents service, persists results in Postgres, and serves the extension. The extension replaces mock data with real Canvas assignments, adds a tappable `AssignmentDetailView`, and auto-navigates when a Canvas assignment is detected in the active tab.

**Tech Stack:** Python 3.13 / FastAPI / ibm-watsonx-ai 1.5.3 / Pydantic v2 / uv — Node.js / Express / Prisma / PostgreSQL — React 19 / TypeScript / Tailwind / Chrome MV3

---

## Design

### Data shapes

**AnalysisResult (Postgres — new model)**
```
userId, courseId, assignmentId (unique composite)
rubric: Json   — see rubric shape below
milestones: Json — see milestones shape below
createdAt, updatedAt
```

**Rubric JSON**
```json
{
  "criteria": [
    {
      "name": "Code Correctness",
      "description": "Program runs without errors and produces expected output.",
      "weight": 40,
      "levels": [
        { "label": "Excellent", "points": 40, "description": "..." },
        { "label": "Proficient", "points": 28, "description": "..." },
        { "label": "Developing", "points": 16, "description": "..." },
        { "label": "Beginning",  "points": 0,  "description": "..." }
      ]
    }
  ],
  "totalPoints": 100
}
```

**Milestones JSON**
```json
{
  "milestones": [
    {
      "order": 1,
      "title": "Read and annotate the requirements",
      "description": "Carefully read the assignment description...",
      "estimatedHours": 0.5,
      "deliverable": "Annotated spec or bullet-point notes"
    }
  ]
}
```

### Request / Response shapes (agents service)

```
POST /analyze
Body: { "name": str, "description": str, "points_possible": float,
        "submission_types": list[str], "due_at": str | null }
Response: { "rubric": <RubricJSON>, "milestones": <MilestonesJSON> }
```

### New server endpoints

```
POST /assignments/analyze
  Body: { courseId, assignmentId }
  → fetches Canvas detail, calls agents service, upserts AnalysisResult, returns { rubric, milestones }

GET /assignments/:courseId/:assignmentId/result
  → returns existing AnalysisResult or 404

GET /canvas/assignments
  → aggregate: fetches all active courses, then all assignments per course, returns flat list
```

### Extension navigation model

```
App state: selectedAssignment: { courseId, assignmentId, title, courseName } | null

If selectedAssignment → render AssignmentDetailView (full-screen, back → null)
Else → render tab views as today

On popup open: if assignmentInfo (from useCanvasUrl) detected → setSelectedAssignment automatically
AssignmentCard onClick → setSelectedAssignment
```

### Modular file layout

```
apps/agents/
  main.py                       FastAPI app, POST /analyze, GET /health
  models/
    assignment.py               AnalyzeRequest, RubricCriterion, RubricLevel, Rubric, Milestone, Milestones, AnalyzeResponse
  agents/
    rubric_generator.py         generate_rubric(assignment) -> Rubric
    rubric_validator.py         validate_rubric(assignment, rubric) -> Rubric
    milestone_generator.py      generate_milestones(assignment, rubric) -> Milestones
  workflow/
    pipeline.py                 run_pipeline(assignment) -> AnalyzeResponse  (calls all 3 agents)
  lib/
    watsonx.py                  get_model() -> ModelInference  (single shared factory)
    prompts.py                  RUBRIC_SYSTEM, VALIDATOR_SYSTEM, MILESTONE_SYSTEM

apps/server/src/
  routes/
    canvas.ts                   existing + GET /canvas/assignments
    assignments.ts              new: POST /analyze, GET /:courseId/:assignmentId/result
  lib/
    agents.ts                   callAgentsService(content) -> { rubric, milestones }

apps/extension/src/
  hooks/
    useAssignments.ts           fetches /canvas/assignments, returns { assignments, loading, error }
    useAnalysis.ts              { analyze, result, status } (idle|loading|done|error)
  types/index.ts                + CanvasAssignment, AnalysisResult
  components/
    AssignmentCard.tsx          reusable card: title, course, due, analysis badge, onClick
    views/
      TodayView.tsx             real data via useAssignments, tappable AssignmentCards
      PlanView.tsx              real data, calendar layout kept
      AssignmentDetailView.tsx  3-state: idle / processing / result
```

---

## Tasks

### Task 1: Python — project structure + fix deprecation

**Files:**
- Modify: `apps/agents/main.py`
- Create: `apps/agents/lib/__init__.py`
- Create: `apps/agents/lib/watsonx.py`
- Create: `apps/agents/lib/prompts.py`
- Create: `apps/agents/models/__init__.py`
- Create: `apps/agents/models/assignment.py`
- Create: `apps/agents/agents/__init__.py`
- Create: `apps/agents/workflow/__init__.py`

**Step 1: Add fastapi + uvicorn dependencies**
```bash
cd apps/agents
uv add fastapi uvicorn httpx python-dotenv
```
Expected: packages added to pyproject.toml and uv.lock.

**Step 2: Create `apps/agents/lib/watsonx.py`**

This fixes the deprecation by using `text/chat` exclusively. Single factory used by all agents.
```python
import os
from ibm_watsonx_ai import APIClient, Credentials
from ibm_watsonx_ai.foundation_models import ModelInference

def get_model(model_id: str | None = None) -> ModelInference:
    credentials = Credentials(
        url=os.environ["WATSONX_URL"],
        api_key=os.environ["WATSONX_API_KEY"],
    )
    client = APIClient(credentials=credentials)
    return ModelInference(
        model_id=model_id or os.environ.get("GRANITE_MODEL", "ibm/granite-4-h-small"),
        api_client=client,
        project_id=os.environ["WATSONX_PROJECT_ID"],
    )
```

**Step 3: Create `apps/agents/lib/prompts.py`**

All system prompts in one place for easy tuning.
```python
RUBRIC_SYSTEM = """You are an academic rubric expert. Given an assignment description, \
generate a detailed grading rubric as valid JSON matching this exact schema:
{"criteria":[{"name":str,"description":str,"weight":int,"levels":[{"label":str,"points":int,"description":str}]}],"totalPoints":int}
All criteria weights must sum to totalPoints. Return ONLY the JSON object, no markdown, no explanation."""

VALIDATOR_SYSTEM = """You are a rubric quality reviewer. Given an assignment description and a draft rubric, \
identify any gaps or misalignments and return an improved rubric as valid JSON with the same schema as the input. \
Return ONLY the JSON object."""

MILESTONE_SYSTEM = """You are a study planning expert. Given an assignment description and its grading rubric, \
break the work into ordered, actionable milestones as valid JSON matching this exact schema:
{"milestones":[{"order":int,"title":str,"description":str,"estimatedHours":float,"deliverable":str}]}
Return ONLY the JSON object."""
```

**Step 4: Create `apps/agents/models/assignment.py`**

Typed I/O for the entire pipeline — single source of truth.
```python
from pydantic import BaseModel

class AnalyzeRequest(BaseModel):
    name: str
    description: str
    points_possible: float = 100.0
    submission_types: list[str] = []
    due_at: str | None = None

class RubricLevel(BaseModel):
    label: str
    points: int
    description: str

class RubricCriterion(BaseModel):
    name: str
    description: str
    weight: int
    levels: list[RubricLevel]

class Rubric(BaseModel):
    criteria: list[RubricCriterion]
    totalPoints: int

class Milestone(BaseModel):
    order: int
    title: str
    description: str
    estimatedHours: float
    deliverable: str

class Milestones(BaseModel):
    milestones: list[Milestone]

class AnalyzeResponse(BaseModel):
    rubric: Rubric
    milestones: Milestones
```

**Step 5: Rewrite `apps/agents/main.py`**
```python
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from dotenv import load_dotenv
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../../../.env"))

from models.assignment import AnalyzeRequest, AnalyzeResponse
from workflow.pipeline import run_pipeline

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield  # add warm-up here if needed

app = FastAPI(title="Assignmint Agents", lifespan=lifespan)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(req: AnalyzeRequest) -> AnalyzeResponse:
    return await run_pipeline(req)
```

**Step 6: Verify health endpoint starts**
```bash
cd apps/agents
uv run uvicorn main:app --port 8000 --reload
# In another terminal:
curl http://localhost:8000/health
```
Expected: `{"status":"ok"}`

**Step 7: Commit**
```bash
git add apps/agents/
git commit -m "feat(agents): FastAPI scaffold + shared watsonx client (fixes text/chat deprecation)"
```

---

### Task 2: Python — three agents

**Files:**
- Create: `apps/agents/agents/rubric_generator.py`
- Create: `apps/agents/agents/rubric_validator.py`
- Create: `apps/agents/agents/milestone_generator.py`

**Step 1: Create `apps/agents/agents/rubric_generator.py`**
```python
import json
from ibm_watsonx_ai.foundation_models import ModelInference
from models.assignment import AnalyzeRequest, Rubric
from lib.prompts import RUBRIC_SYSTEM

async def generate_rubric(assignment: AnalyzeRequest, model: ModelInference) -> Rubric:
    user_msg = (
        f"Assignment: {assignment.name}\n"
        f"Points possible: {assignment.points_possible}\n"
        f"Submission types: {', '.join(assignment.submission_types)}\n\n"
        f"Description:\n{assignment.description}"
    )
    resp = model.chat(messages=[
        {"role": "system", "content": RUBRIC_SYSTEM},
        {"role": "user",   "content": user_msg},
    ])
    raw = resp["choices"][0]["message"]["content"].strip()
    # Strip markdown code fences if model wraps output
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return Rubric.model_validate(json.loads(raw))
```

**Step 2: Create `apps/agents/agents/rubric_validator.py`**
```python
import json
from ibm_watsonx_ai.foundation_models import ModelInference
from models.assignment import AnalyzeRequest, Rubric
from lib.prompts import VALIDATOR_SYSTEM

async def validate_rubric(
    assignment: AnalyzeRequest, rubric: Rubric, model: ModelInference
) -> Rubric:
    user_msg = (
        f"Assignment: {assignment.name}\n\n"
        f"Description:\n{assignment.description}\n\n"
        f"Draft rubric:\n{rubric.model_dump_json(indent=2)}"
    )
    resp = model.chat(messages=[
        {"role": "system", "content": VALIDATOR_SYSTEM},
        {"role": "user",   "content": user_msg},
    ])
    raw = resp["choices"][0]["message"]["content"].strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    try:
        return Rubric.model_validate(json.loads(raw))
    except Exception:
        return rubric  # graceful fallback: return original if validation fails
```

**Step 3: Create `apps/agents/agents/milestone_generator.py`**
```python
import json
from ibm_watsonx_ai.foundation_models import ModelInference
from models.assignment import AnalyzeRequest, Rubric, Milestones
from lib.prompts import MILESTONE_SYSTEM

async def generate_milestones(
    assignment: AnalyzeRequest, rubric: Rubric, model: ModelInference
) -> Milestones:
    user_msg = (
        f"Assignment: {assignment.name}\n"
        f"Due: {assignment.due_at or 'not specified'}\n\n"
        f"Description:\n{assignment.description}\n\n"
        f"Rubric:\n{rubric.model_dump_json(indent=2)}"
    )
    resp = model.chat(messages=[
        {"role": "system", "content": MILESTONE_SYSTEM},
        {"role": "user",   "content": user_msg},
    ])
    raw = resp["choices"][0]["message"]["content"].strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return Milestones.model_validate(json.loads(raw))
```

**Step 4: Commit**
```bash
git add apps/agents/agents/
git commit -m "feat(agents): rubric generator, validator, and milestone agent"
```

---

### Task 3: Python — workflow pipeline + live test

**Files:**
- Create: `apps/agents/workflow/pipeline.py`

**Step 1: Create `apps/agents/workflow/pipeline.py`**
```python
from models.assignment import AnalyzeRequest, AnalyzeResponse
from agents.rubric_generator import generate_rubric
from agents.rubric_validator import validate_rubric
from agents.milestone_generator import generate_milestones
from lib.watsonx import get_model

async def run_pipeline(assignment: AnalyzeRequest) -> AnalyzeResponse:
    model = get_model()  # one client, reused across all 3 agents
    rubric = await generate_rubric(assignment, model)
    rubric = await validate_rubric(assignment, rubric, model)
    milestones = await generate_milestones(assignment, rubric, model)
    return AnalyzeResponse(rubric=rubric, milestones=milestones)
```

**Step 2: Live end-to-end test**

Start the server: `cd apps/agents && uv run uvicorn main:app --port 8000`

```bash
curl -s -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Python Data Structures Assignment",
    "description": "Implement a linked list with insert, delete, and search operations. Include unit tests.",
    "points_possible": 100,
    "submission_types": ["online_upload"],
    "due_at": "2026-03-15T23:59:00Z"
  }' | python3 -m json.tool
```
Expected: JSON with `rubric.criteria` array and `milestones.milestones` array, no errors.

**Step 3: Commit**
```bash
git add apps/agents/workflow/
git commit -m "feat(agents): sequential pipeline orchestrating all 3 agents"
```

---

### Task 4: DB — AnalysisResult model + migration

**Files:**
- Modify: `apps/server/prisma/schema.prisma`
- Run migration

**Step 1: Add AnalysisResult to schema**

Add to `apps/server/prisma/schema.prisma` (after the Assignment model):
```prisma
model AnalysisResult {
  id           String   @id @default(cuid())
  userId       String
  courseId     String
  assignmentId String
  rubric       Json
  milestones   Json
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, courseId, assignmentId])
}
```

Also add `analysisResults AnalysisResult[]` to the `User` model.

**Step 2: Run migration**
```bash
cd apps/server
npx prisma migrate dev --name add_analysis_result
```
Expected: Migration created and applied. Prisma client regenerated.

**Step 3: Commit**
```bash
git add apps/server/prisma/
git commit -m "feat(db): add AnalysisResult model for rubric and milestone persistence"
```

---

### Task 5: Server — agents HTTP client + assignments routes

**Files:**
- Create: `apps/server/src/lib/agents.ts`
- Create: `apps/server/src/routes/assignments.ts`
- Modify: `apps/server/src/routes/canvas.ts` (add aggregate endpoint)
- Modify: `apps/server/src/index.ts` (mount new router)

**Step 1: Create `apps/server/src/lib/agents.ts`**
```typescript
const AGENTS_URL = process.env.AGENTS_URL ?? "http://localhost:8000";

export interface AgentsAnalyzeRequest {
  name: string;
  description: string;
  points_possible: number;
  submission_types: string[];
  due_at: string | null;
}

export interface RubricLevel  { label: string; points: number; description: string; }
export interface RubricCriterion { name: string; description: string; weight: number; levels: RubricLevel[]; }
export interface Rubric        { criteria: RubricCriterion[]; totalPoints: number; }
export interface Milestone     { order: number; title: string; description: string; estimatedHours: number; deliverable: string; }
export interface Milestones    { milestones: Milestone[]; }
export interface AgentsAnalyzeResponse { rubric: Rubric; milestones: Milestones; }

export async function callAgentsService(req: AgentsAnalyzeRequest): Promise<AgentsAnalyzeResponse> {
  const res = await fetch(`${AGENTS_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Agents service error ${res.status}: ${body}`);
  }
  return res.json();
}
```

**Step 2: Create `apps/server/src/routes/assignments.ts`**
```typescript
import { Router, Response } from "express";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { prisma } from "../lib/prisma";
import { callAgentsService } from "../lib/agents";
import { canvasFetch, getCanvasCredentials } from "../lib/canvas";

const router = Router();

// POST /assignments/analyze
router.post("/analyze", requireAuth, async (req: AuthRequest, res: Response) => {
  const { courseId, assignmentId } = req.body as { courseId: string; assignmentId: string };
  if (!courseId || !assignmentId) {
    res.status(400).json({ error: "courseId and assignmentId required" }); return;
  }
  const creds = await getCanvasCredentials(req.userId!);
  if (!creds) { res.status(400).json({ error: "Canvas not configured" }); return; }

  // Fetch Canvas assignment detail
  const assignment = await canvasFetch(creds.baseUrl, creds.apiKey,
    `/courses/${courseId}/assignments/${assignmentId}`);

  // Strip HTML from description for LLM
  const description = (assignment.description ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Call agents service
  const result = await callAgentsService({
    name: assignment.name,
    description,
    points_possible: assignment.points_possible ?? 100,
    submission_types: assignment.submission_types ?? [],
    due_at: assignment.due_at ?? null,
  });

  // Upsert result
  const saved = await prisma.analysisResult.upsert({
    where: { userId_courseId_assignmentId: { userId: req.userId!, courseId, assignmentId } },
    update: { rubric: result.rubric, milestones: result.milestones },
    create: { userId: req.userId!, courseId, assignmentId, rubric: result.rubric, milestones: result.milestones },
  });

  res.json({ rubric: saved.rubric, milestones: saved.milestones });
});

// GET /assignments/:courseId/:assignmentId/result
router.get("/:courseId/:assignmentId/result", requireAuth, async (req: AuthRequest, res: Response) => {
  const { courseId, assignmentId } = req.params;
  const result = await prisma.analysisResult.findUnique({
    where: { userId_courseId_assignmentId: { userId: req.userId!, courseId, assignmentId } },
  });
  if (!result) { res.status(404).json({ error: "No analysis found" }); return; }
  res.json({ rubric: result.rubric, milestones: result.milestones });
});

export default router;
```

**Step 3: Extract canvas helpers to `apps/server/src/lib/canvas.ts`**

Move `getCanvasCredentials` and `canvasFetch` out of `canvas.ts` route file into a shared lib so `assignments.ts` can import them too.

Create `apps/server/src/lib/canvas.ts`:
```typescript
import { decrypt } from "./crypto";
import { prisma } from "./prisma";

export async function getCanvasCredentials(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.canvasBaseUrl || !user?.canvasToken) return null;
  return { baseUrl: user.canvasBaseUrl, apiKey: decrypt(user.canvasToken) };
}

export async function canvasFetch(baseUrl: string, apiKey: string, path: string) {
  const res = await fetch(`${baseUrl}/api/v1${path}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) throw new Error(`Canvas API error: ${res.status}`);
  return res.json();
}
```

Update `apps/server/src/routes/canvas.ts` to import from `../lib/canvas`.

**Step 4: Add aggregate endpoint to `apps/server/src/routes/canvas.ts`**
```typescript
// GET /canvas/assignments — all assignments across all active courses
router.get("/assignments", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const creds = await getCanvasCredentials(req.userId!);
    if (!creds) { res.status(400).json({ error: "Canvas not configured" }); return; }

    const courses: Array<{ id: number; name: string; course_code: string }> =
      await canvasFetch(creds.baseUrl, creds.apiKey, "/courses?enrollment_state=active&per_page=50");

    const results = await Promise.all(
      courses.map(async (course) => {
        try {
          const assignments = await canvasFetch(
            creds.baseUrl, creds.apiKey,
            `/courses/${course.id}/assignments?per_page=50&order_by=due_at`
          );
          return assignments.map((a: Record<string, unknown>) => ({
            ...a,
            courseName: course.name,
            courseCode: course.course_code,
          }));
        } catch { return []; }
      })
    );

    res.json(results.flat());
  } catch (err) {
    console.error("canvas all-assignments error:", err);
    res.status(502).json({ error: "Failed to fetch assignments" });
  }
});
```

**Step 5: Mount new router in `apps/server/src/index.ts`**
```typescript
import assignmentsRouter from "./routes/assignments";
// ...
app.use("/assignments", assignmentsRouter);
```

**Step 6: Commit**
```bash
git add apps/server/src/
git commit -m "feat(server): analyze endpoint, AnalysisResult persistence, canvas helpers extracted"
```

---

### Task 6: Extension — types + API layer

**Files:**
- Modify: `packages/shared/src/index.ts` (check path first)
- Modify: `apps/extension/src/lib/api.ts`
- Create: `apps/extension/src/types/analysis.ts`

**Step 1: Check shared package path**
```bash
ls packages/shared/src/
```

**Step 2: Add new types to `apps/extension/src/types/analysis.ts`**
```typescript
export interface CanvasAssignment {
  id: number;
  name: string;
  description: string | null;
  due_at: string | null;
  points_possible: number;
  submission_types: string[];
  workflow_state: string;
  courseId?: number;
  courseName?: string;
  courseCode?: string;
}

export interface RubricLevel    { label: string; points: number; description: string; }
export interface RubricCriterion { name: string; description: string; weight: number; levels: RubricLevel[]; }
export interface Rubric          { criteria: RubricCriterion[]; totalPoints: number; }
export interface Milestone       { order: number; title: string; description: string; estimatedHours: number; deliverable: string; }
export interface Milestones      { milestones: Milestone[]; }
export interface AnalysisResult  { rubric: Rubric; milestones: Milestones; }
```

**Step 3: Add API functions to `apps/extension/src/lib/api.ts`**
```typescript
export async function fetchAllAssignments(jwt: string): Promise<CanvasAssignment[]> {
  return apiFetch<CanvasAssignment[]>("/canvas/assignments", {}, jwt);
}

export async function analyzeAssignment(
  jwt: string, courseId: string, assignmentId: string
): Promise<AnalysisResult> {
  return apiFetch<AnalysisResult>("/assignments/analyze", {
    method: "POST",
    body: JSON.stringify({ courseId, assignmentId }),
  }, jwt);
}

export async function getAnalysisResult(
  jwt: string, courseId: string, assignmentId: string
): Promise<AnalysisResult | null> {
  try {
    return await apiFetch<AnalysisResult>(`/assignments/${courseId}/${assignmentId}/result`, {}, jwt);
  } catch { return null; }
}
```

**Step 4: Commit**
```bash
git add apps/extension/src/types/ apps/extension/src/lib/
git commit -m "feat(extension): AnalysisResult types and API helpers"
```

---

### Task 7: Extension — data hooks

**Files:**
- Create: `apps/extension/src/hooks/useAssignments.ts`
- Create: `apps/extension/src/hooks/useAnalysis.ts`

**Step 1: Create `apps/extension/src/hooks/useAssignments.ts`**
```typescript
import { useState, useEffect } from "react";
import { fetchAllAssignments } from "@/lib/api";
import type { CanvasAssignment } from "@/types/analysis";

export function useAssignments(jwt: string | null) {
  const [assignments, setAssignments] = useState<CanvasAssignment[]>([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);

  useEffect(() => {
    if (!jwt) return;
    setLoading(true);
    fetchAllAssignments(jwt)
      .then(setAssignments)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [jwt]);

  return { assignments, loading, error };
}
```

**Step 2: Create `apps/extension/src/hooks/useAnalysis.ts`**
```typescript
import { useState } from "react";
import { analyzeAssignment, getAnalysisResult } from "@/lib/api";
import type { AnalysisResult } from "@/types/analysis";

type AnalysisStatus = "idle" | "loading" | "done" | "error";

export function useAnalysis(jwt: string | null) {
  const [result, setResult]   = useState<AnalysisResult | null>(null);
  const [status, setStatus]   = useState<AnalysisStatus>("idle");
  const [error, setError]     = useState<string | null>(null);

  async function loadExisting(courseId: string, assignmentId: string) {
    if (!jwt) return;
    const existing = await getAnalysisResult(jwt, courseId, assignmentId);
    if (existing) { setResult(existing); setStatus("done"); }
  }

  async function analyze(courseId: string, assignmentId: string) {
    if (!jwt) return;
    setStatus("loading");
    setError(null);
    try {
      const r = await analyzeAssignment(jwt, courseId, assignmentId);
      setResult(r);
      setStatus("done");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Analysis failed");
      setStatus("error");
    }
  }

  function reset() { setResult(null); setStatus("idle"); setError(null); }

  return { result, status, error, analyze, loadExisting, reset };
}
```

**Step 3: Commit**
```bash
git add apps/extension/src/hooks/
git commit -m "feat(extension): useAssignments and useAnalysis hooks"
```

---

### Task 8: Extension — AssignmentCard component

**Files:**
- Create: `apps/extension/src/components/AssignmentCard.tsx`

**Step 1: Create `apps/extension/src/components/AssignmentCard.tsx`**
```tsx
import { Clock, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CanvasAssignment } from "@/types/analysis";

interface Props {
  assignment: CanvasAssignment;
  hasAnalysis?: boolean;
  isActive?: boolean;
  onClick: () => void;
}

function dueBadge(dueAt: string | null): { label: string; variant: "secondary" | "default" | "muted" } {
  if (!dueAt) return { label: "No due date", variant: "muted" };
  const diff = new Date(dueAt).getTime() - Date.now();
  const days = diff / (1000 * 60 * 60 * 24);
  if (days < 0)  return { label: "Past due", variant: "secondary" };
  if (days < 1)  return { label: "Due today", variant: "secondary" };
  if (days < 3)  return { label: `${Math.ceil(days)}d left`, variant: "default" };
  return { label: `${Math.ceil(days)}d left`, variant: "muted" };
}

export function AssignmentCard({ assignment, hasAnalysis, isActive, onClick }: Props) {
  const due = dueBadge(assignment.due_at);
  return (
    <Card
      className={`shadow-none cursor-pointer transition-colors hover:bg-muted/40 ${isActive ? "border-primary" : ""}`}
      onClick={onClick}
    >
      <div className="p-3 flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-foreground leading-snug flex-1 min-w-0 line-clamp-2">
            {assignment.name}
          </p>
          <div className="flex items-center gap-1 shrink-0">
            {hasAnalysis && (
              <span title="Analyzed">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
              </span>
            )}
            <Badge variant={due.variant}>{due.label}</Badge>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-3 w-3 text-muted-foreground shrink-0" />
          <span className="text-xs text-muted-foreground truncate">
            {assignment.courseName ?? assignment.courseCode ?? "Unknown course"}
            {assignment.points_possible ? ` · ${assignment.points_possible} pts` : ""}
          </span>
        </div>
      </div>
    </Card>
  );
}
```

**Step 2: Commit**
```bash
git add apps/extension/src/components/AssignmentCard.tsx
git commit -m "feat(extension): AssignmentCard with due-date badge and analysis indicator"
```

---

### Task 9: Extension — AssignmentDetailView

**Files:**
- Create: `apps/extension/src/components/views/AssignmentDetailView.tsx`

**Step 1: Create `apps/extension/src/components/views/AssignmentDetailView.tsx`**

Three states: idle (Analyze button), loading (step-by-step progress), done (rubric accordion + milestone checklist).

```tsx
import { useEffect, useState } from "react";
import { ArrowLeft, Sparkles, CheckCircle2, Circle, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAnalysis } from "@/hooks/useAnalysis";
import type { CanvasAssignment } from "@/types/analysis";

const STEPS = ["Generating rubric…", "Validating rubric…", "Building milestones…"];

interface Props {
  assignment: CanvasAssignment;
  courseId: string;
  assignmentId: string;
  jwt: string;
  onBack: () => void;
}

export function AssignmentDetailView({ assignment, courseId, assignmentId, jwt, onBack }: Props) {
  const { result, status, error, analyze, loadExisting } = useAnalysis(jwt);
  const [stepIdx, setStepIdx] = useState(0);
  const [expandedCriteria, setExpandedCriteria] = useState<Set<number>>(new Set([0]));
  const [checkedMilestones, setCheckedMilestones] = useState<Set<number>>(new Set());

  // Check for existing analysis on mount
  useEffect(() => {
    loadExisting(courseId, assignmentId);
  }, [courseId, assignmentId]);

  // Simulate step progress while loading
  useEffect(() => {
    if (status !== "loading") { setStepIdx(0); return; }
    const interval = setInterval(() => {
      setStepIdx((i) => (i < STEPS.length - 1 ? i + 1 : i));
    }, 4000);
    return () => clearInterval(interval);
  }, [status]);

  const toggleCriterion = (i: number) =>
    setExpandedCriteria((s) => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; });
  const toggleMilestone = (i: number) =>
    setCheckedMilestones((s) => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-border shrink-0">
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors p-0.5">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{assignment.name}</p>
          <p className="text-xs text-muted-foreground">{assignment.courseName}</p>
        </div>
        {result && <Sparkles className="h-4 w-4 text-primary shrink-0" />}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto py-3 flex flex-col gap-4">

        {/* Idle state */}
        {status === "idle" && (
          <div className="flex flex-col items-center justify-center flex-1 gap-4 text-center px-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">Analyze this assignment</p>
              <p className="text-xs text-muted-foreground">
                AI will generate a grading rubric and a step-by-step milestone plan.
              </p>
            </div>
            {assignment.points_possible > 0 && (
              <Badge variant="muted">{assignment.points_possible} pts possible</Badge>
            )}
            <Button className="w-full gap-2" onClick={() => analyze(courseId, assignmentId)}>
              <Sparkles className="h-3.5 w-3.5" />
              Analyze with AI
            </Button>
          </div>
        )}

        {/* Loading state */}
        {status === "loading" && (
          <div className="flex flex-col items-center justify-center flex-1 gap-5 px-4">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <div className="w-full flex flex-col gap-2">
              {STEPS.map((step, i) => (
                <div key={step} className={`flex items-center gap-3 text-sm transition-opacity ${i <= stepIdx ? "opacity-100" : "opacity-30"}`}>
                  {i < stepIdx ? (
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  ) : i === stepIdx ? (
                    <Loader2 className="h-4 w-4 text-primary animate-spin shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                  <span className={i === stepIdx ? "text-foreground font-medium" : "text-muted-foreground"}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error state */}
        {status === "error" && (
          <div className="flex flex-col items-center gap-3 px-4 py-8 text-center">
            <p className="text-sm text-destructive font-medium">Analysis failed</p>
            <p className="text-xs text-muted-foreground">{error}</p>
            <Button variant="outline" onClick={() => analyze(courseId, assignmentId)}>Try again</Button>
          </div>
        )}

        {/* Result state */}
        {status === "done" && result && (
          <>
            {/* Rubric */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Rubric</p>
              <div className="flex flex-col gap-1.5">
                {result.rubric.criteria.map((c, i) => (
                  <Card key={i} className="shadow-none">
                    <button
                      className="w-full p-3 text-left flex items-center justify-between gap-2"
                      onClick={() => toggleCriterion(i)}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm font-medium text-foreground truncate">{c.name}</span>
                        <Badge variant="muted" className="shrink-0">{c.weight} pts</Badge>
                      </div>
                      {expandedCriteria.has(i)
                        ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
                    </button>
                    {expandedCriteria.has(i) && (
                      <div className="px-3 pb-3 flex flex-col gap-1.5 border-t border-border pt-2">
                        <p className="text-xs text-muted-foreground">{c.description}</p>
                        {c.levels.map((l, j) => (
                          <div key={j} className="flex justify-between text-xs">
                            <span className="text-foreground">{l.label}</span>
                            <span className="text-muted-foreground">{l.points} pts</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>

            {/* Milestones */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Milestones</p>
              <div className="flex flex-col gap-1.5">
                {result.milestones.milestones.map((m, i) => (
                  <Card key={i} className="shadow-none">
                    <button
                      className="w-full p-3 text-left flex items-start gap-3"
                      onClick={() => toggleMilestone(i)}
                    >
                      {checkedMilestones.has(i)
                        ? <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        : <Circle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />}
                      <div className="flex-1 min-w-0 text-left">
                        <p className={`text-sm font-medium leading-snug ${checkedMilestones.has(i) ? "line-through text-muted-foreground" : "text-foreground"}`}>
                          {m.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          ~{m.estimatedHours}h · {m.deliverable}
                        </p>
                      </div>
                    </button>
                  </Card>
                ))}
              </div>
            </div>

            {/* Re-analyze */}
            <Button variant="outline" className="w-full gap-2" onClick={() => analyze(courseId, assignmentId)}>
              <Sparkles className="h-3.5 w-3.5" />
              Re-analyze
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
```

**Step 2: Commit**
```bash
git add apps/extension/src/components/views/AssignmentDetailView.tsx
git commit -m "feat(extension): AssignmentDetailView with idle/loading/result states"
```

---

### Task 10: Extension — rework TodayView with real data

**Files:**
- Modify: `apps/extension/src/components/views/TodayView.tsx`
- Delete: `apps/extension/src/data/mock.ts` (after verifying nothing else imports it)

**Step 1: Check what imports mock data**
```bash
grep -r "from.*data/mock" apps/extension/src/
```
Expected: TodayView.tsx and PlanView.tsx. Do not delete until both are reworked.

**Step 2: Rewrite `TodayView.tsx`**

New props: `displayName`, `jwt`, `assignments`, `loading`, `analysisResults`, `onSelectAssignment`.
```tsx
import { Clock, Loader2 } from "lucide-react";
import { AssignmentCard } from "@/components/AssignmentCard";
import type { CanvasAssignment, AnalysisResult } from "@/types/analysis";

interface Props {
  displayName?: string | null;
  jwt: string;
  assignments: CanvasAssignment[];
  loading: boolean;
  analysisResults: Record<string, AnalysisResult>;
  onSelectAssignment: (a: CanvasAssignment) => void;
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function isToday(dueAt: string | null): boolean {
  if (!dueAt) return false;
  const d = new Date(dueAt);
  const t = new Date();
  return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
}

export function TodayView({ displayName, assignments, loading, analysisResults, onSelectAssignment }: Props) {
  const firstName = displayName ? displayName.split(" ")[0] : null;
  const dueToday = assignments.filter((a) => isToday(a.due_at)).length;
  const upcoming = [...assignments]
    .filter((a) => a.due_at && new Date(a.due_at) >= new Date())
    .sort((a, b) => new Date(a.due_at!).getTime() - new Date(b.due_at!).getTime())
    .slice(0, 6);

  return (
    <div className="flex flex-col gap-3 h-full overflow-hidden">
      <div className="shrink-0">
        <h2 className="text-[15px] font-semibold text-foreground tracking-tight">
          {greeting()}{firstName ? `, ${firstName}` : ""}
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {loading ? "Loading assignments…" : `${dueToday} assignment${dueToday !== 1 ? "s" : ""} due today`}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col gap-2 min-h-0">
        {loading && (
          <div className="flex items-center justify-center flex-1">
            <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
          </div>
        )}
        {!loading && upcoming.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">No upcoming assignments</p>
          </div>
        )}
        {!loading && upcoming.map((a) => {
          const key = `${a.courseId}-${a.id}`;
          return (
            <AssignmentCard
              key={key}
              assignment={a}
              hasAnalysis={key in analysisResults}
              onClick={() => onSelectAssignment(a)}
            />
          );
        })}
      </div>
    </div>
  );
}
```

**Step 3: Commit**
```bash
git add apps/extension/src/components/views/TodayView.tsx
git commit -m "feat(extension): TodayView uses real Canvas assignments"
```

---

### Task 11: Extension — rework PlanView with real data

**Files:**
- Modify: `apps/extension/src/components/views/PlanView.tsx`

Keep the calendar strip layout. Replace mock assignments with real data.

**Step 1: Update PlanView props**
```tsx
interface Props {
  assignments: CanvasAssignment[];
  loading: boolean;
  onSelectAssignment: (a: CanvasAssignment) => void;
}
```

Group assignments by due date relative to today. Map them into the existing timeline layout but using real data. Tap row opens detail view via `onSelectAssignment`.

**Step 2: Commit**
```bash
git add apps/extension/src/components/views/PlanView.tsx
git commit -m "feat(extension): PlanView uses real Canvas assignments"
```

---

### Task 12: Extension — App.tsx navigation + auto-detect

**Files:**
- Modify: `apps/extension/src/App.tsx`

**Step 1: Add selectedAssignment state and hooks**

```typescript
const [selectedAssignment, setSelectedAssignment] = useState<CanvasAssignment | null>(null);
const { assignments, loading: assignmentsLoading } = useAssignments(jwt);
const [analysisResults, setAnalysisResults] = useState<Record<string, AnalysisResult>>({});
```

**Step 2: Auto-navigate when Canvas assignment detected**

```typescript
useEffect(() => {
  if (!assignmentInfo || assignments.length === 0) return;
  const match = assignments.find(
    (a) => String(a.id) === assignmentInfo.assignmentId &&
           String(a.courseId) === assignmentInfo.courseId
  );
  if (match) setSelectedAssignment(match);
}, [assignmentInfo, assignments]);
```

**Step 3: Render AssignmentDetailView when selectedAssignment is set**

```tsx
{selectedAssignment ? (
  <AssignmentDetailView
    assignment={selectedAssignment}
    courseId={String(selectedAssignment.courseId)}
    assignmentId={String(selectedAssignment.id)}
    jwt={jwt!}
    onBack={() => setSelectedAssignment(null)}
  />
) : (
  <>
    {tab === "today" && (
      <TodayView
        displayName={displayName}
        jwt={jwt!}
        assignments={assignments}
        loading={assignmentsLoading}
        analysisResults={analysisResults}
        onSelectAssignment={setSelectedAssignment}
      />
    )}
    {tab === "plan" && (
      <PlanView
        assignments={assignments}
        loading={assignmentsLoading}
        onSelectAssignment={setSelectedAssignment}
      />
    )}
    {tab === "me" && <MeView ... />}
  </>
)}
```

**Step 4: Remove old assignmentInfo banner from header** (replaced by auto-navigate behavior)

**Step 5: Delete mock data file**
```bash
rm apps/extension/src/data/mock.ts
```
Verify `pnpm build` passes with no import errors.

**Step 6: Commit**
```bash
git add apps/extension/src/App.tsx
git commit -m "feat(extension): App.tsx navigation wired to real data and auto-opens detected assignment"
```

---

### Task 13: Docker Compose — agents service

**Files:**
- Create: `apps/agents/Dockerfile`
- Modify: `docker-compose.yml`
- Update: root `.env` / `apps/server/.env` to include `AGENTS_URL`

**Step 1: Create `apps/agents/Dockerfile`**
```dockerfile
FROM python:3.13-slim
WORKDIR /app
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev
COPY . .
EXPOSE 8000
CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Step 2: Add agents service to `docker-compose.yml`**
```yaml
agents:
  build:
    context: ./apps/agents
  ports:
    - "8000:8000"
  environment:
    - WATSONX_API_KEY=${WATSONX_API_KEY}
    - WATSONX_PROJECT_ID=${WATSONX_PROJECT_ID}
    - WATSONX_URL=${WATSONX_URL}
    - GRANITE_MODEL=${GRANITE_MODEL}
  restart: unless-stopped
```

Update the `api` service to depend on `agents` and set `AGENTS_URL=http://agents:8000`.

**Step 3: Verify compose up**
```bash
docker compose up --build agents
curl http://localhost:8000/health
```

**Step 4: Commit**
```bash
git add apps/agents/Dockerfile docker-compose.yml
git commit -m "feat(infra): add agents Docker service to compose stack"
```

---

## Post-implementation checklist

These items are left for a follow-up session:

- [ ] **Milestone persistence** — currently milestone check-state is local React state only; needs to be persisted (new `MilestoneProgress` model or JSON field on `AnalysisResult`)
- [ ] **Guardian model integration** — use `ibm/granite-guardian-3-8b` to validate rubric output for academic appropriateness before saving
- [ ] **PlanView calendar wiring** — week strip date highlighting and assignment grouping by week
- [ ] **Streaming responses** — use SSE streaming from agents service so the loading steps in the UI reflect actual progress rather than a timer
- [ ] **Canvas file attachments** — fetch submission file attachments (`/submissions/self`) and include their content in the agent prompt for richer rubric generation
- [ ] **Error boundary** in extension (catches unexpected render errors gracefully)
- [ ] **Rate limiting** on `/assignments/analyze` (prevent re-triggering while in flight)
- [ ] **Extension host permissions** — add Canvas base URL and agents URL to `manifest.json` `host_permissions` if needed for production deployment
