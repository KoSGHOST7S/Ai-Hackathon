import { useState, useCallback } from "react";

export type SubPage =
  | { type: "description" }
  | { type: "criterion"; index: number }
  | { type: "milestone"; index: number }
  | { type: "chat" }
  | { type: "submit" }
  | { type: "review" };

export function useSubPage() {
  const [subPage, setSubPage] = useState<SubPage | null>(null);

  const openDescription = useCallback(() => setSubPage({ type: "description" }), []);
  const openCriterion   = useCallback((index: number) => setSubPage({ type: "criterion", index }), []);
  const openMilestone   = useCallback((index: number) => setSubPage({ type: "milestone", index }), []);
  const openChat        = useCallback(() => setSubPage({ type: "chat" }), []);
  const openSubmit      = useCallback(() => setSubPage({ type: "submit" }), []);
  const openReview      = useCallback(() => setSubPage({ type: "review" }), []);
  const close           = useCallback(() => setSubPage(null), []);

  return { subPage, openDescription, openCriterion, openMilestone, openChat, openSubmit, openReview, close };
}
