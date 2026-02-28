# Analysis Preload No-Flash Design

## Problem
When opening an assignment detail that already has analysis, the UI briefly renders the idle "Analyze with AI" state before the existing result request returns. This causes a visible flash.

## Goal
Eliminate idle-state flash on detail open and make repeated opens faster.

## Design
1. Gate idle rendering on `loadChecked`.
   - `status === "idle"` should only show the analyze CTA after initial existing-result lookup has finished.
   - While lookup is pending (`status === "idle"` and `loadChecked === false`), show a compact loading placeholder.
2. Cache analysis result fetches.
   - `getAnalysisResult()` should use API cache TTL so reopening the same assignment detail can resolve from storage quickly.

## Scope
- `apps/extension/src/components/views/AssignmentDetailView.tsx`
- `apps/extension/src/lib/api.ts`
- New helper logic tests for idle-state visibility.

## Validation
- Unit test for idle CTA visibility helper.
- Existing unit tests pass.
- Typecheck and build pass.
