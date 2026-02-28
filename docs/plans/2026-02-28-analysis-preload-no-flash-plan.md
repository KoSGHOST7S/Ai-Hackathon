# Analysis Preload No-Flash Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove detail-view flash by preventing idle-state render before existing-analysis lookup completes, while caching result lookups for faster reopen.

**Architecture:** Add a small pure helper used by `AssignmentDetailView` to decide when the analyze CTA is eligible to render. Then update `getAnalysisResult()` to use existing API cache TTL for read-through caching. This keeps behavior local and avoids broad state refactors.

**Tech Stack:** React 19 + TypeScript, existing API cache in `api.ts`, lightweight CJS tests with `sucrase/register`

---

### Task 1: Write failing test for idle CTA visibility rule

**Files:**
- Create: `apps/extension/tests/analysisViewState.test.cjs`
- Test target: `apps/extension/src/lib/analysisViewState.ts`

**Step 1: Write failing tests**
- `status=idle` and `loadChecked=false` => should not show CTA.
- `status=idle` and `loadChecked=true` => should show CTA.
- non-idle statuses => should not show CTA.

**Step 2: Run test to verify it fails**
```bash
node -r ./apps/extension/node_modules/sucrase/register ./apps/extension/tests/analysisViewState.test.cjs
```

### Task 2: Implement minimal helper and pass tests

**Files:**
- Create: `apps/extension/src/lib/analysisViewState.ts`
- Test: `apps/extension/tests/analysisViewState.test.cjs`

**Step 1: Implement helper**
- Export `shouldShowAnalyzeCta(status, loadChecked)`.

**Step 2: Re-run test**
```bash
node -r ./apps/extension/node_modules/sucrase/register ./apps/extension/tests/analysisViewState.test.cjs
```

### Task 3: Use helper in AssignmentDetailView

**Files:**
- Modify: `apps/extension/src/components/views/AssignmentDetailView.tsx`

**Step 1: Gate idle UI**
- Replace direct `status === "idle"` check with helper.
- Add placeholder for initial lookup pending state.

### Task 4: Cache `getAnalysisResult`

**Files:**
- Modify: `apps/extension/src/lib/api.ts`

**Step 1: Apply TTL**
- Use `cacheTtlMs: API_RESPONSE_CACHE_TTL_MS` in `getAnalysisResult()`.

### Task 5: Verify

**Step 1: Run tests**
```bash
node -r ./apps/extension/node_modules/sucrase/register ./apps/extension/tests/analysisViewState.test.cjs
node -r ./apps/extension/node_modules/sucrase/register ./apps/extension/tests/finalMilestoneCelebration.test.cjs
node -r ./apps/extension/node_modules/sucrase/register ./apps/extension/tests/slideTransitionLogic.test.cjs
```

**Step 2: Typecheck + build**
```bash
pnpm --filter extension exec tsc --noEmit
pnpm --filter extension build
```
