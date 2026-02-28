import { useState } from "react";
import { streamAnalysis, getAnalysisResult } from "@/lib/api";
import { storageSet, storageRemove } from "@/lib/storage";
import type { AnalysisResult } from "@/types/analysis";

export type AnalysisStatus = "idle" | "loading" | "done" | "error";

function setAnalyzingJob(courseId: string, assignmentId: string, jwt: string) {
  void storageSet(
    "analyzing_assignment",
    JSON.stringify({ courseId, assignmentId, jwt })
  );
}

function clearAnalyzingJob() {
  void storageRemove("analyzing_assignment");
}

export function useAnalysis(jwt: string | null) {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [error, setError]   = useState<string | null>(null);
  const [step, setStep]     = useState(0);
  const [loadChecked, setLoadChecked] = useState(false);

  async function loadExisting(courseId: string, assignmentId: string) {
    if (!jwt) return;
    const existing = await getAnalysisResult(jwt, courseId, assignmentId);
    if (existing) { setResult(existing); setStatus("done"); }
    setLoadChecked(true);
  }

  async function analyze(courseId: string, assignmentId: string) {
    if (!jwt) return;
    setStatus("loading");
    setStep(0);
    setError(null);
    setAnalyzingJob(courseId, assignmentId, jwt);
    try {
      for await (const event of streamAnalysis(jwt, courseId, assignmentId)) {
        if (event.type === "progress") {
          setStep(event.step);
        } else if (event.type === "done") {
          setResult(event.result);
          setStatus("done");
          clearAnalyzingJob();
        } else if (event.type === "error") {
          setError(event.error);
          setStatus("error");
          clearAnalyzingJob();
        }
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Analysis failed");
      setStatus("error");
      clearAnalyzingJob();
    }
  }

  function reset() {
    setResult(null);
    setStatus("idle");
    setError(null);
    setStep(0);
    setLoadChecked(false);
    clearAnalyzingJob();
  }

  return { result, status, error, step, loadChecked, analyze, loadExisting, reset };
}
