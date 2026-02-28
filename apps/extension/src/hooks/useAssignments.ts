import { useState, useEffect } from "react";
import { fetchAllAssignments } from "@/lib/api";
import type { CanvasAssignment } from "@/types/analysis";

export function useAssignments(jwt: string | null) {
  const [assignments, setAssignments] = useState<CanvasAssignment[]>([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);

  useEffect(() => {
    if (!jwt) return;
    setLoading(true);
    fetchAllAssignments(jwt)
      .then(setAssignments)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Failed to load assignments"))
      .finally(() => setLoading(false));
  }, [jwt]);

  return { assignments, loading, error };
}
