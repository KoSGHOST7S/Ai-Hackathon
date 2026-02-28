# Page Slide Transitions Design

## Summary
Add directional page transitions across the extension popup so navigation feels spatial:
- Forward navigation enters from the right.
- Back navigation exits to the right.

## Scope
- `App.tsx` transitions:
  - Today list <-> Today assignment detail
  - Plan list <-> Plan assignment detail
  - Me profile <-> Edit Canvas
- `AssignmentDetailView.tsx` transitions:
  - Main detail page <-> all subpages (`description`, `criterion`, `milestone`, `chat`, `submit`, `review`)
  - Milestone previous/next navigation

## UX Rules
- Forward action = push into deeper content.
- Back action = return to previous context.
- Duration should be quick (~220ms) for popup responsiveness.
- Respect `prefers-reduced-motion` by disabling animated transitions.

## Technical Design
- Add reusable `SlideTransition` component:
  - Keeps outgoing and incoming scenes mounted during animation.
  - Uses direction (`forward` or `back`) to choose animation class.
  - Cleans outgoing scene after timer completes.
- Add CSS keyframes/utilities in `index.css`:
  - `assignmint-slide-in-right`
  - `assignmint-slide-out-right`
- Add a small pure helper in `slideTransitionLogic.ts` for deterministic layer mapping.

## Validation
- Unit tests cover transition layer mapping helper.
- Extension build passes (`pnpm --filter extension build`).
- Manual checks confirm motion direction in all listed flows.
