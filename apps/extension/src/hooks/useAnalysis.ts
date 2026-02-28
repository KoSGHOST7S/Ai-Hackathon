import { useState } from "react";
import { streamAnalysis, getAnalysisResult } from "@/lib/api";
import { storageRemove, storageSetRaw } from "@/lib/storage";
import type { AnalysisResult } from "@/types/analysis";

export type AnalysisStatus = "idle" | "loading" | "done" | "error";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

function setAnalyzingJob(courseId: string, assignmentId: string, jwt: string) {
  const payload = { courseId, assignmentId, jwt, apiUrl: API_URL };
  void storageSetRaw("analyzing_assignment", payload);
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

  function restoreInProgress(restoredStep: number) {
    setStatus("loading");
    setError(null);
    setStep(restoredStep);
    setLoadChecked(true);
  }

  async function resolveCompletedAnalysis(courseId: string, assignmentId: string) {
    if (!jwt) return;
    const existing = await getAnalysisResult(jwt, courseId, assignmentId);
    if (existing) {
      setResult(existing);
      setStatus("done");
      clearAnalyzingJob();
      return;
    }
    setError("Analysis finished but no result was found. Please try again.");
    setStatus("error");
    clearAnalyzingJob();
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

  return {
    result,
    status,
    error,
    step,
    loadChecked,
    analyze,
    loadExisting,
    restoreInProgress,
    resolveCompletedAnalysis,
    reset,
  };
}
