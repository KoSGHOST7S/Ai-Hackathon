# Final Milestone Confetti Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Play confetti in the extension whenever a user transitions an assignment from partially complete milestones to fully complete milestones.

**Architecture:** Keep celebration eligibility in a pure helper function and unit test it first. In `AssignmentDetailView`, detect completion transitions with a previous-state ref and run `@hiseb/confetti` only on qualifying transitions. This keeps UI behavior predictable and avoids triggering on initial render.

**Tech Stack:** React 19 + TypeScript, Chrome extension popup UI, `@hiseb/confetti`, Node assert-based unit test runner with `sucrase/register`

---

### Task 1: Add failing tests for completion transition logic

**Files:**
- Create: `apps/extension/tests/finalMilestoneCelebration.test.cjs`
- Test target: `apps/extension/src/lib/finalMilestoneCelebration.ts`

**Step 1: Write the failing test**

Add tests for:
- Fires when `prevDone < prevTotal` and `nextDone === nextTotal > 0`
- Does not fire when already complete and remains complete
- Does not fire when becoming less complete
- Does not fire when totals are zero

**Step 2: Run test to verify it fails**

Run:
```bash
node -r ./apps/extension/node_modules/sucrase/register ./apps/extension/tests/finalMilestoneCelebration.test.cjs
```

Expected: FAIL because `finalMilestoneCelebration.ts` does not exist yet.

### Task 2: Implement minimal helper to pass tests

**Files:**
- Create: `apps/extension/src/lib/finalMilestoneCelebration.ts`
- Test: `apps/extension/tests/finalMilestoneCelebration.test.cjs`

**Step 1: Write minimal implementation**

Implement:
```ts
export function shouldCelebrateFinalMilestone(...) { ... }
```

Logic:
- Return false for non-positive totals.
- Return true only when next state is fully complete and previous state was not fully complete.

**Step 2: Run test to verify it passes**

Run:
```bash
node -r ./apps/extension/node_modules/sucrase/register ./apps/extension/tests/finalMilestoneCelebration.test.cjs
```

Expected: PASS.

### Task 3: Wire confetti into `AssignmentDetailView`

**Files:**
- Modify: `apps/extension/src/components/views/AssignmentDetailView.tsx`
- Modify: `apps/extension/package.json`

**Step 1: Add dependency**

Add `@hiseb/confetti` to `dependencies` in `apps/extension/package.json`.

**Step 2: Integrate completion transition check**

In `AssignmentDetailView.tsx`:
- Import `confetti` from `@hiseb/confetti`.
- Import `shouldCelebrateFinalMilestone`.
- Add ref to hold previous `{ done, total }`.
- Add `useEffect` watching completion values.
- If helper returns true, call confetti with a compact celebratory burst.

**Step 3: Ensure no initial-load false positive**

Initialize previous ref from current completion and skip firing on first render.

### Task 4: Verify and build

**Step 1: Re-run unit test**

Run:
```bash
node -r ./apps/extension/node_modules/sucrase/register ./apps/extension/tests/finalMilestoneCelebration.test.cjs
```

Expected: PASS.

**Step 2: Build extension**

Run:
```bash
pnpm --filter extension build
```

Expected: successful Vite build without TypeScript errors.

**Step 3: Manual behavior check**

In popup:
1. Check milestones until all are complete -> confetti should fire.
2. Uncheck one milestone -> no confetti.
3. Re-check to full completion -> confetti should fire again.
