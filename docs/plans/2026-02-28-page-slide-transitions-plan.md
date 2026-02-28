# Page Slide Transitions Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add consistent directional slide transitions for all detail navigation flows in the extension popup while preserving current behavior.

**Architecture:** Introduce a reusable `SlideTransition` wrapper that receives an active scene key and direction (`forward`/`back`). The wrapper renders both scenes during transitions and applies direction-specific CSS keyframes. App-level and detail-level navigators set direction before state changes so motion reflects UI flow.

**Tech Stack:** React 19 + TypeScript, Tailwind/CSS keyframes, Node assert unit tests via `sucrase/register`

---

### Task 1: Add failing tests for transition layer mapping helper

**Files:**
- Create: `apps/extension/tests/slideTransitionLogic.test.cjs`
- Test target: `apps/extension/src/lib/slideTransitionLogic.ts`

**Step 1: Write failing tests**
- Forward direction: base should be `from`, moving should be `to`, animation should be `slide-in-right`.
- Back direction: base should be `to`, moving should be `from`, animation should be `slide-out-right`.

**Step 2: Run test to verify it fails**

Run:
```bash
node -r ./apps/extension/node_modules/sucrase/register ./apps/extension/tests/slideTransitionLogic.test.cjs
```

Expected: FAIL because helper file does not exist yet.

### Task 2: Implement minimal helper and get tests green

**Files:**
- Create: `apps/extension/src/lib/slideTransitionLogic.ts`
- Test: `apps/extension/tests/slideTransitionLogic.test.cjs`

**Step 1: Implement helper**
- Export `SlideDirection` type.
- Export `getSlideTransitionLayers(fromKey, toKey, direction)`.

**Step 2: Run tests**

Run:
```bash
node -r ./apps/extension/node_modules/sucrase/register ./apps/extension/tests/slideTransitionLogic.test.cjs
```

Expected: PASS.

### Task 3: Build reusable `SlideTransition` component

**Files:**
- Create: `apps/extension/src/components/transitions/SlideTransition.tsx`
- Modify: `apps/extension/src/index.css`
- Modify: `apps/extension/src/lib/finalMilestoneCelebration.ts` (if needed for type cleanups)

**Step 1: Add component**
- `activeKey`, `direction`, `renderScene`, optional `durationMs`.
- Manage temporary outgoing scene state.
- Disable animation on `prefers-reduced-motion`.

**Step 2: Add CSS animations**
- `assignmint-slide-in-right`
- `assignmint-slide-out-right`

### Task 4: Wire transitions in `App.tsx`

**Files:**
- Modify: `apps/extension/src/App.tsx`

**Step 1: Add per-tab navigation direction state**
- Track direction for Today, Plan, and Me flows.

**Step 2: Wrap each tab’s root/detail switch in `SlideTransition`**
- Today list <-> detail
- Plan list <-> detail
- Me profile <-> canvas edit

### Task 5: Wire transitions and confetti in `AssignmentDetailView.tsx`

**Files:**
- Modify: `apps/extension/src/components/views/AssignmentDetailView.tsx`
- Modify: `apps/extension/package.json`

**Step 1: Confetti**
- Add `@hiseb/confetti` dependency.
- Trigger confetti when final milestone completion edge is reached.

**Step 2: Subpage transitions**
- Add direction state (`forward`/`back`).
- Render main page and subpages through `SlideTransition`.
- Ensure back buttons set `back` direction before closing.

### Task 6: Verify

**Step 1: Run all local unit tests**

Run:
```bash
node -r ./apps/extension/node_modules/sucrase/register ./apps/extension/tests/finalMilestoneCelebration.test.cjs
node -r ./apps/extension/node_modules/sucrase/register ./apps/extension/tests/slideTransitionLogic.test.cjs
```

Expected: PASS.

**Step 2: Build extension**

Run:
```bash
pnpm --filter extension build
```

Expected: successful build.

**Step 3: Manual checks**
- Forward into detail: slides in from right.
- Back from detail: exits to right.
- Same behavior for all subpages.
- Confetti fires each time completion transitions to all milestones done.
