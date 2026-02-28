import { useState, useEffect, useCallback } from "react";
import { fetchAllAssignments } from "@/lib/api";
import type { CanvasAssignment } from "@/types/analysis";

export function useAssignments(jwt: string | null) {
  const [assignments, setAssignments] = useState<CanvasAssignment[]>([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [trigger, setTrigger]         = useState(0);

  useEffect(() => {
    if (!jwt) return;
    setLoading(true);
    fetchAllAssignments(jwt)
      .then(setAssignments)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Failed to load assignments"))
      .finally(() => setLoading(false));
  }, [jwt, trigger]);

  const refetch = useCallback(() => setTrigger((t) => t + 1), []);

  return { assignments, loading, error, refetch };
}
