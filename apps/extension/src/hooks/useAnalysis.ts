import { useState, useRef } from "react";
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

const POLL_INTERVAL_MS = 3_000;
const POLL_MAX_RETRIES = 60; // ~3 minutes

export function useAnalysis(jwt: string | null) {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [error, setError]   = useState<string | null>(null);
  const [step, setStep]     = useState(0);
  const [loadChecked, setLoadChecked] = useState(false);
  const pollingRef = useRef(false);

  async function loadExisting(courseId: string, assignmentId: string) {
    if (!jwt) return;
    const existing = await getAnalysisResult(jwt, courseId, assignmentId);
    if (existing) { setResult(existing); setStatus("done"); }
    setLoadChecked(true);
  }

  async function analyze(courseId: string, assignmentId: string) {
    if (!jwt) return;
    pollingRef.current = false; // cancel any active poll
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

  /**
   * Called when the popup reopens mid-analysis. Shows loading UI and polls
   * getAnalysisResult every 3 s until the server finishes — does NOT re-POST
   * the stream endpoint, which would restart or double the work on the server.
   */
  async function resumePolling(courseId: string, assignmentId: string) {
    if (!jwt || pollingRef.current) return;
    pollingRef.current = true;
    setStatus("loading");
    setStep(0);
    setError(null);

    let retries = 0;
    while (pollingRef.current && retries < POLL_MAX_RETRIES) {
      await new Promise<void>((r) => setTimeout(r, POLL_INTERVAL_MS));
      if (!pollingRef.current) break; // cancelled (e.g. reset() called)

      const existing = await getAnalysisResult(jwt, courseId, assignmentId);
      if (existing) {
        setResult(existing);
        setStatus("done");
        clearAnalyzingJob();
        pollingRef.current = false;
        return;
      }
      retries++;
    }

    if (pollingRef.current) {
      // Timed out without a result
      setError("Analysis is taking longer than expected. Please try again.");
      setStatus("error");
      clearAnalyzingJob();
      pollingRef.current = false;
    }
  }

  function reset() {
    pollingRef.current = false;
    setResult(null);
    setStatus("idle");
    setError(null);
    setStep(0);
    setLoadChecked(false);
    clearAnalyzingJob();
  }

  return { result, status, error, step, loadChecked, analyze, resumePolling, loadExisting, reset };
}
