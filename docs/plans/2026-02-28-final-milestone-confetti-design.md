# Final Milestone Confetti Design

## Summary
When a user marks the last remaining milestone complete for an assignment, show a confetti celebration effect in the extension UI.

## Scope
- Trigger in `AssignmentDetailView` milestone completion flow.
- Fire only on a completion edge transition (`not fully complete` -> `fully complete`).
- Fire again if the user later unchecks a milestone and then returns to full completion.

## UX Behavior
- Confetti launches immediately when completion reaches all milestones.
- No confetti on initial load, even if all milestones were already checked from a previous session.
- No confetti when toggling from fully complete to incomplete.

## Technical Design
- Add a pure helper in `apps/extension/src/lib/finalMilestoneCelebration.ts`:
  - `shouldCelebrateFinalMilestone(prevDone, prevTotal, nextDone, nextTotal): boolean`
  - Encodes completion transition logic.
- In `AssignmentDetailView`:
  - Track previous completion state in a ref.
  - On `completion.done` / `completion.total` changes, call helper.
  - If true, trigger confetti via `@hiseb/confetti`.
- Add focused unit tests for the helper in `apps/extension/tests/finalMilestoneCelebration.test.cjs`.

## Risks And Mitigations
- Performance noise from repeated renders:
  - Guard with transition-based helper and previous state ref.
- Missing browser APIs:
  - Use the confetti library in a client-side React effect only.

## Validation
- Unit tests cover transition logic.
- `pnpm --filter extension build` confirms TypeScript and bundling are healthy.
