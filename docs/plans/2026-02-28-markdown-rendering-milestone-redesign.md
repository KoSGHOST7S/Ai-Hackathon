# Markdown Rendering & Milestone Page Redesign

**Date:** 2026-02-28
**Scope:** `apps/extension`, `apps/agents`, `apps/server`

## Goal

Render markdown in the milestone plan view and AI chat window. Have the LLM generate richer, structured milestone content (tasks checklist + markdown prose) with actionable, grade-focused prompting.

## Schema Changes

### Backend — `apps/agents/models/assignment.py`

Add `tasks: list[str]` to `Milestone` (defaults to `[]` for backward compatibility):

```python
class Milestone(BaseModel):
    order: int
    title: str
    description: str        # markdown prose
    estimatedHours: float
    deliverable: str        # plain text artifact
    tasks: list[str] = []   # 3-7 atomic action items
```

### Frontend — `apps/extension/src/types/analysis.ts`

```ts
export interface Milestone {
  order: number;
  title: string;
  description: string;
  estimatedHours: number;
  deliverable: string;
  tasks: string[];   // NEW — defaults to []
}
```

## Prompt Improvements

### `MILESTONE_SYSTEM` (`apps/agents/lib/prompts.py`)

- Update JSON schema to include `tasks` array
- `description` must be **markdown prose** with `##` headers (e.g. `## Context`, `## Approach`, `## Grading Tips`)
- `tasks` must be 3–7 specific, imperative, checkable action items tied to assignment requirements
- Tone: actionable and grade-focused — "do this and you'll get a good grade"
- Reference rubric criteria directly in description to tell students where points come from
- Remove the inline `"Covers: R1, R3"` tag — weave requirement coverage into prose naturally
- `deliverable` = concrete artifact in plain text

### Chat system context (`apps/server/src/routes/assignments.ts`)

- Instruct model to respond in markdown (use headers, bold, lists)
- Frame answers as direct study advice: "Graders look at X — make sure you do Y"
- Include rubric point weights in context so model can prioritize advice
- Include milestone task lists in context so model can reference them

## Rendering Changes

### Install dependencies (extension)

```
react-markdown
remark-gfm
```

### `MilestonePage.tsx` — new layout

1. **WHAT TO DO** section — `tasks[]` rendered as a local interactive checklist (checked state in component, not persisted)
2. **HOW TO DO IT** section — `description` rendered via `<ReactMarkdown remarkPlugins={[remarkGfm]}>`
3. **Deliverable** section — plain text, same as before
4. Remove the custom `parseMarkdownish` parser entirely

### `ChatPage.tsx`

- Assistant messages rendered via `<ReactMarkdown remarkPlugins={[remarkGfm]}>`
- User messages stay as plain text
- Markdown styles scoped with a `prose-chat` utility class (text-xs, tight leading, no excessive margins)

## Layout Sketch

```
┌─────────────────────────────┐
│ Step 2 · ~3 hrs             │
│ Build the Authentication    │
│ Component                   │
├─────────────────────────────┤
│ WHAT TO DO                  │
│ ☐ Create LoginForm.tsx       │
│ ☐ Add input validation      │
│ ☐ Connect to auth API       │
│ ☐ Write 2 unit tests        │
├─────────────────────────────┤
│ HOW TO DO IT                │
│ ## Approach                 │
│ Focus on form validation —  │
│ graders check this first.   │
├─────────────────────────────┤
│ 📦 Deliverable              │
│ Working LoginForm with tests│
└─────────────────────────────┘
```

## Out of Scope

- Persisting task checked state to the server
- Streaming markdown token-by-token in chat (chat is still full-response)
- Schema migration for existing DB rows (tasks defaults to [] gracefully)
