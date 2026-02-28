# Markdown Rendering & Milestone Page Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add `tasks[]` to the Milestone schema, improve prompts to produce actionable grade-focused content, install react-markdown, and render markdown in MilestonePage and ChatPage.

**Architecture:** Three-layer change: (1) backend schema + prompts in Python agents, (2) TypeScript types in extension, (3) React component rewrites using react-markdown. No DB migration needed — `tasks` defaults to `[]` for existing rows.

**Tech Stack:** Python/Pydantic (agents), TypeScript/React/Tailwind (extension), react-markdown + remark-gfm

---

## Task 1: Extend Milestone Pydantic model with `tasks`

**Files:**
- Modify: `apps/agents/models/assignment.py`

**Step 1: Open the file and add the tasks field**

In `apps/agents/models/assignment.py`, find the `Milestone` class and add `tasks`:

```python
class Milestone(BaseModel):
    order: int
    title: str
    description: str
    estimatedHours: float
    deliverable: str
    tasks: list[str] = []
```

**Step 2: Verify no import changes needed**

`list[str]` is a built-in — no new imports required.

**Step 3: Commit**

```bash
git add apps/agents/models/assignment.py
git commit -m "feat(agents): add tasks field to Milestone model"
```

---

## Task 2: Update `MILESTONE_SYSTEM` prompt

**Files:**
- Modify: `apps/agents/lib/prompts.py`

**Step 1: Replace `MILESTONE_SYSTEM` entirely**

Find the `MILESTONE_SYSTEM` string in `apps/agents/lib/prompts.py` and replace it with:

```python
MILESTONE_SYSTEM = """You are an expert academic coach helping a student get the best grade possible. \
Given an assignment description, its explicit requirements, and grading rubric, break the work into \
4-7 ordered, actionable milestones as valid JSON matching this exact schema:
{"milestones":[{"order":int,"title":str,"description":str,"estimatedHours":float,"deliverable":str,"tasks":[str]}]}

Rules:
- description: Write in markdown. Use ## headers (e.g. ## What to focus on, ## Grading tips, ## Key concepts). \
Be direct and grade-focused — tell the student exactly what to do to earn points. Reference rubric criteria \
and their point values so students know where to spend effort. Example: "**This criterion is worth 40 pts** — \
graders check X first, so make sure you do Y before Z."
- tasks: 3-7 short, imperative, checkable action items (e.g. "Create the LoginForm component", \
"Write 2 unit tests for validation logic"). Each task must reference a specific, concrete action \
tied to the assignment. Do NOT write generic tasks like "Review your work".
- deliverable: A concrete artifact in plain text (e.g. "working LoginForm with passing tests", \
"written paragraph covering all three themes"). One sentence max.
- estimatedHours: Realistic for a typical student. Include reading/research time.
- Milestones must be ordered chronologically — earlier milestones unblock later ones.
- Every rubric criterion must be addressed in at least one milestone description.
- Cover all requirement IDs across milestones; weave them into the description prose naturally.
Return ONLY the JSON object, no markdown fences, no explanation."""
```

**Step 2: Update `MILESTONE_COVERAGE_VALIDATOR_SYSTEM` prompt**

Find `MILESTONE_COVERAGE_VALIDATOR_SYSTEM` and replace it:

```python
MILESTONE_COVERAGE_VALIDATOR_SYSTEM = """You are an academic milestone plan quality validator and coach. \
Given assignment context, requirement list, rubric, and draft milestones, return improved milestones as valid JSON:
{"milestones":[{"order":int,"title":str,"description":str,"estimatedHours":float,"deliverable":str,"tasks":[str]}]}

Rules:
- Ensure every requirement ID is addressed in at least one milestone description.
- Preserve or improve the grade-focused, actionable tone in descriptions (## headers, bold key points).
- tasks must be 3-7 specific, imperative, checkable items — improve any that are generic.
- deliverable must be a concrete artifact in plain text.
- Preserve realistic effort estimates.
- Do NOT add a "Covers: ..." inline tag — requirement coverage must be woven into prose naturally.
Return ONLY the JSON object."""
```

**Step 3: Update chat system context prompt**

Find the chat system context string in `apps/server/src/routes/assignments.ts` (the inline string array inside the chat route) and replace it:

```ts
const pointsBreakdown = (analysis.rubric as any).criteria
  ?.map((c: any) => `- **${c.name}** (${c.weight} pts): ${c.description}`)
  .join("\n") ?? "";

const milestoneList = (analysis.milestones as any).milestones
  ?.map((m: any) => `**Step ${m.order}: ${m.title}** (~${m.estimatedHours}h)\nTasks: ${(m.tasks ?? []).join(", ")}\nDeliverable: ${m.deliverable}`)
  .join("\n\n") ?? "";

const system_context = [
  "You are an expert academic coach. Answer questions about this assignment to help the student get the best grade possible.",
  "Always respond in markdown — use **bold** for key points, bullet lists for steps, and ## headers for multi-part answers.",
  "Be direct and actionable: tell the student exactly what to do to earn points. Reference specific rubric criteria and point values.",
  "",
  "## Rubric (grading breakdown)",
  pointsBreakdown,
  "",
  "## Milestones (study plan)",
  milestoneList,
].join("\n");
```

**Step 4: Commit**

```bash
git add apps/agents/lib/prompts.py apps/server/src/routes/assignments.ts
git commit -m "feat(agents): improve milestone and chat prompts for grade-focused actionable output"
```

---

## Task 3: Fix milestone validator to preserve `tasks` field

**Files:**
- Modify: `apps/agents/agents/milestone_validator.py`

**Context:** `ensure_requirement_coverage` creates patched `Milestone` objects for any uncovered requirements. These need a `tasks` field too.

**Step 1: Update the patched milestone in `ensure_requirement_coverage`**

Find the `patched.append(Milestone(...))` call and add `tasks`:

```python
patched.append(Milestone(
    order=len(patched) + 1,
    title=f"Complete requirement {req.id}",
    description=f"## What to focus on\n\nDirectly implement and verify this explicit assignment requirement: {req.text}.\n\n## Grading tips\n\nMake sure your submission clearly demonstrates this requirement — graders will check for it explicitly.",
    estimatedHours=1.0,
    deliverable=f"Completed evidence for requirement {req.id}",
    tasks=[
        f"Re-read the assignment requirement: {req.text}",
        f"Implement the required work for {req.id}",
        "Verify your submission clearly addresses this requirement",
    ],
))
```

**Step 2: Commit**

```bash
git add apps/agents/agents/milestone_validator.py
git commit -m "fix(agents): include tasks field in patched milestones from validator"
```

---

## Task 4: Update TypeScript `Milestone` type

**Files:**
- Modify: `apps/extension/src/types/analysis.ts`

**Step 1: Add `tasks` to the `Milestone` interface**

Find the `Milestone` interface and add the field:

```ts
export interface Milestone {
  order: number;
  title: string;
  description: string;
  estimatedHours: number;
  deliverable: string;
  tasks: string[];
}
```

**Step 2: Commit**

```bash
git add apps/extension/src/types/analysis.ts
git commit -m "feat(extension): add tasks field to Milestone TypeScript type"
```

---

## Task 5: Install react-markdown and remark-gfm

**Files:**
- Modify: `apps/extension/package.json` (via pnpm)

**Step 1: Install dependencies**

```bash
cd apps/extension
pnpm add react-markdown remark-gfm
```

**Step 2: Verify installation**

```bash
# Check that react-markdown appears in package.json dependencies
grep "react-markdown" apps/extension/package.json
```

Expected: `"react-markdown": "^X.X.X"`

**Step 3: Commit**

```bash
git add apps/extension/package.json pnpm-lock.yaml
git commit -m "feat(extension): install react-markdown and remark-gfm"
```

---

## Task 6: Rewrite `MilestonePage.tsx`

**Files:**
- Modify: `apps/extension/src/components/views/MilestonePage.tsx`

**Context:** The current component has a custom `parseMarkdownish` parser and `renderLine` helper — both get deleted. We replace the "Plan" section with two new sections: "What to do" (tasks checklist) and "How to do it" (react-markdown description).

**Step 1: Add local checked-state for tasks**

Tasks are checked locally within the component session (not persisted to server).

**Step 2: Replace the entire file content**

```tsx
import { useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, Clock, Package, CheckSquare, Square } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SubPageHeader } from "./SubPageHeader";
import { Button } from "@/components/ui/button";
import type { Milestone } from "@/types/analysis";

interface Props {
  milestone: Milestone;
  isChecked: boolean;
  onToggle: () => void;
  onBack: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export function MilestonePage({
  milestone,
  isChecked,
  onToggle,
  onBack,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
}: Props) {
  const [checkedTasks, setCheckedTasks] = useState<Set<number>>(new Set());

  function toggleTask(idx: number) {
    setCheckedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  const tasks = milestone.tasks ?? [];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <SubPageHeader title="Milestones" onBack={onBack} />
      <div className="flex-1 overflow-y-auto py-3 flex flex-col gap-4">

        {/* Header */}
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
            Step {milestone.order}
          </p>
          <h3 className={`text-sm font-semibold ${isChecked ? "line-through text-muted-foreground" : "text-foreground"}`}>
            {milestone.title}
          </h3>
        </div>

        {/* Tasks checklist */}
        {tasks.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">What to do</p>
            <div className="rounded-md border border-border bg-muted/25 p-3 space-y-2">
              {tasks.map((task, idx) => (
                <button
                  key={idx}
                  onClick={() => toggleTask(idx)}
                  className="flex items-start gap-2 w-full text-left group"
                >
                  {checkedTasks.has(idx)
                    ? <CheckSquare className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary" />
                    : <Square className="h-3.5 w-3.5 shrink-0 mt-0.5 text-muted-foreground group-hover:text-foreground" />
                  }
                  <span className={`text-xs leading-relaxed ${checkedTasks.has(idx) ? "line-through text-muted-foreground" : "text-foreground/85"}`}>
                    {task}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Description — markdown prose */}
        {milestone.description && (
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">How to do it</p>
            <div className="rounded-md border border-border bg-muted/25 p-3">
              <div className="milestone-prose">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {milestone.description}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}

        {/* Time + Deliverable */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span>~{milestone.estimatedHours} hours estimated</span>
          </div>
          <div className="flex items-start gap-2 text-xs text-muted-foreground rounded-md border border-border bg-muted/20 p-2.5">
            <Package className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span>{milestone.deliverable}</span>
          </div>
        </div>

        {/* Mark complete */}
        <Button
          variant={isChecked ? "outline" : "default"}
          className="w-full gap-2"
          onClick={onToggle}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          {isChecked ? "Mark incomplete" : "Mark complete"}
        </Button>

        {/* Prev / Next */}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" className="gap-2" onClick={onPrev} disabled={!hasPrev}>
            <ChevronLeft className="h-3.5 w-3.5" />
            Previous
          </Button>
          <Button variant="outline" className="gap-2" onClick={onNext} disabled={!hasNext}>
            Next
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
```

**Step 3: Add prose styles for the markdown output**

In `apps/extension/src/index.css`, add a `.milestone-prose` block after the existing styles:

```css
/* Milestone markdown prose — compact for extension popup */
.milestone-prose {
  @apply text-xs text-foreground/85 leading-relaxed;
}
.milestone-prose h1,
.milestone-prose h2,
.milestone-prose h3 {
  @apply text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-3 mb-1 first:mt-0;
}
.milestone-prose p {
  @apply mb-2 last:mb-0;
}
.milestone-prose ul {
  @apply list-disc pl-4 space-y-1 mb-2;
}
.milestone-prose ol {
  @apply list-decimal pl-4 space-y-1 mb-2;
}
.milestone-prose strong {
  @apply font-semibold text-foreground;
}
.milestone-prose em {
  @apply italic;
}
.milestone-prose code {
  @apply font-mono text-[10px] bg-muted px-1 rounded;
}
```

**Step 4: Commit**

```bash
git add apps/extension/src/components/views/MilestonePage.tsx apps/extension/src/index.css
git commit -m "feat(extension): rewrite MilestonePage with tasks checklist and react-markdown prose"
```

---

## Task 7: Add markdown rendering to `ChatPage.tsx`

**Files:**
- Modify: `apps/extension/src/components/views/ChatPage.tsx`

**Context:** Only assistant messages need markdown rendering. User messages are plain text. The bubble container already has `text-xs leading-relaxed` — we need to style nested markdown elements to match.

**Step 1: Import ReactMarkdown and remarkGfm**

At the top of `ChatPage.tsx`, add:

```ts
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
```

**Step 2: Replace the message content render**

Find the message bubble div that renders `{m.content}` and replace the content:

```tsx
<div className={`max-w-[80%] rounded-lg px-3 py-2 text-xs leading-relaxed ${
  m.role === "user"
    ? "bg-primary text-primary-foreground"
    : "bg-muted text-foreground"
}`}>
  {m.role === "assistant" ? (
    <div className="chat-prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {m.content}
      </ReactMarkdown>
    </div>
  ) : (
    m.content
  )}
</div>
```

**Step 3: Add `.chat-prose` styles to `index.css`**

```css
/* Chat assistant markdown prose */
.chat-prose {
  @apply text-xs leading-relaxed;
}
.chat-prose h1,
.chat-prose h2,
.chat-prose h3 {
  @apply font-semibold text-foreground mt-2 mb-1 first:mt-0;
}
.chat-prose h1 { @apply text-xs; }
.chat-prose h2 { @apply text-xs; }
.chat-prose h3 { @apply text-[11px]; }
.chat-prose p {
  @apply mb-1.5 last:mb-0;
}
.chat-prose ul {
  @apply list-disc pl-4 space-y-0.5 mb-1.5;
}
.chat-prose ol {
  @apply list-decimal pl-4 space-y-0.5 mb-1.5;
}
.chat-prose strong {
  @apply font-semibold;
}
.chat-prose code {
  @apply font-mono text-[10px] bg-black/10 px-0.5 rounded;
}
.chat-prose pre {
  @apply font-mono text-[10px] bg-black/10 rounded p-2 overflow-x-auto mb-1.5;
}
```

**Step 4: Commit**

```bash
git add apps/extension/src/components/views/ChatPage.tsx apps/extension/src/index.css
git commit -m "feat(extension): render assistant chat messages as markdown"
```

---

## Task 8: Smoke test end-to-end

**No automated tests for UI rendering — manual verification steps:**

**Step 1: Build the extension**

```bash
cd apps/extension
pnpm build
```

Expected: Build completes with no TypeScript errors.

**Step 2: Verify agent JSON output includes tasks**

With the agents service running, call the analyze endpoint and check the response shape:

```bash
curl -s -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","description":"Write a 500-word essay on photosynthesis with 3 citations.","points_possible":100,"submission_types":["online_text_entry"]}' \
  | python3 -c "import json,sys; m=json.load(sys.stdin)['milestones']['milestones'][0]; print('tasks:', m.get('tasks')); print('desc preview:', m['description'][:200])"
```

Expected: `tasks` is a list of strings, `description` starts with a `##` header.

**Step 3: Final commit if any fixups needed**

```bash
git add -A
git commit -m "fix(extension): address smoke test issues"
```
