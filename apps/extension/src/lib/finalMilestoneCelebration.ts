export interface MilestoneCompletionSnapshot {
  prevDone: number;
  prevTotal: number;
  nextDone: number;
  nextTotal: number;
}

export function shouldCelebrateFinalMilestone({
  prevDone,
  prevTotal,
  nextDone,
  nextTotal,
}: MilestoneCompletionSnapshot): boolean {
  if (nextTotal <= 0 || prevTotal <= 0) return false;

  const wasComplete = prevDone >= prevTotal;
  const isComplete = nextDone >= nextTotal;

  return !wasComplete && isComplete;
}
