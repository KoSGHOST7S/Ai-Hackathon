import { useState } from "react";
import { streamAnalysis, getAnalysisResult } from "@/lib/api";
import type { AnalysisResult } from "@/types/analysis";

export type AnalysisStatus = "idle" | "loading" | "done" | "error";

export function useAnalysis(jwt: string | null) {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [error, setError]   = useState<string | null>(null);
  const [step, setStep]     = useState(0);

  async function loadExisting(courseId: string, assignmentId: string) {
    if (!jwt) return;
    const existing = await getAnalysisResult(jwt, courseId, assignmentId);
    if (existing) { setResult(existing); setStatus("done"); }
  }

  async function analyze(courseId: string, assignmentId: string) {
    if (!jwt) return;
    setStatus("loading");
    setStep(0);
    setError(null);
    try {
      for await (const event of streamAnalysis(jwt, courseId, assignmentId)) {
        if (event.type === "progress") {
          setStep(event.step);
        } else if (event.type === "done") {
          setResult(event.result);
          setStatus("done");
        } else if (event.type === "error") {
          setError(event.error);
          setStatus("error");
        }
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Analysis failed");
      setStatus("error");
    }
  }

  function reset() { setResult(null); setStatus("idle"); setError(null); setStep(0); }

  return { result, status, error, step, analyze, loadExisting, reset };
}
