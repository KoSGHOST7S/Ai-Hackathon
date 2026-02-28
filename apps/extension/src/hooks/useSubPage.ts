import { useState, useCallback } from "react";

export type SubPage =
  | { type: "description" }
  | { type: "criterion"; index: number }
  | { type: "milestone"; index: number }
  | { type: "chat" };

export function useSubPage() {
  const [subPage, setSubPage] = useState<SubPage | null>(null);

  const openDescription = useCallback(() => setSubPage({ type: "description" }), []);
  const openCriterion   = useCallback((index: number) => setSubPage({ type: "criterion", index }), []);
  const openMilestone   = useCallback((index: number) => setSubPage({ type: "milestone", index }), []);
  const openChat        = useCallback(() => setSubPage({ type: "chat" }), []);
  const close           = useCallback(() => setSubPage(null), []);

  return { subPage, openDescription, openCriterion, openMilestone, openChat, close };
}
