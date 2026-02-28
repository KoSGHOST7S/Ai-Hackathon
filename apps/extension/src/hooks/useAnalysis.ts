import { useState } from "react";
import { analyzeAssignment, getAnalysisResult } from "@/lib/api";
import type { AnalysisResult } from "@/types/analysis";

export type AnalysisStatus = "idle" | "loading" | "done" | "error";

export function useAnalysis(jwt: string | null) {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [error, setError]   = useState<string | null>(null);

  async function loadExisting(courseId: string, assignmentId: string) {
    if (!jwt) return;
    const existing = await getAnalysisResult(jwt, courseId, assignmentId);
    if (existing) { setResult(existing); setStatus("done"); }
  }

  async function analyze(courseId: string, assignmentId: string) {
    if (!jwt) return;
    setStatus("loading");
    setError(null);
    try {
      const r = await analyzeAssignment(jwt, courseId, assignmentId);
      setResult(r);
      setStatus("done");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Analysis failed");
      setStatus("error");
    }
  }

  function reset() { setResult(null); setStatus("idle"); setError(null); }

  return { result, status, error, analyze, loadExisting, reset };
}
