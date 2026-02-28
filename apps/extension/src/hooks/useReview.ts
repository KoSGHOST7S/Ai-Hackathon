import { useState } from "react";
import { streamReviewSubmission, getReviewResult } from "@/lib/api";
import type { ReviewResult } from "@/types/analysis";

export type ReviewStatus = "idle" | "loading" | "done" | "error";

export function useReview(jwt: string | null) {
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [status, setStatus] = useState<ReviewStatus>("idle");
  const [error, setError]   = useState<string | null>(null);
  const [step, setStep]     = useState(0);

  async function loadExisting(courseId: string, assignmentId: string) {
    if (!jwt) return;
    const existing = await getReviewResult(jwt, courseId, assignmentId);
    if (existing) { setResult(existing); setStatus("done"); }
  }

  async function submitForReview(
    courseId: string, assignmentId: string,
    body: { submission_text?: string; submission_files?: Array<{ name: string; text: string }> }
  ) {
    if (!jwt) return;
    setStatus("loading"); setStep(0); setError(null);
    try {
      for await (const event of streamReviewSubmission(jwt, courseId, assignmentId, body)) {
        if (event.type === "progress") setStep(event.step);
        else if (event.type === "done") { setResult(event.result); setStatus("done"); }
        else if (event.type === "error") { setError(event.error); setStatus("error"); }
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Review failed"); setStatus("error");
    }
  }

  function reset() { setResult(null); setStatus("idle"); setError(null); setStep(0); }
  return { result, status, error, step, submitForReview, loadExisting, reset };
}
