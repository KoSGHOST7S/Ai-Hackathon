import type { AnalysisStatus } from "@/hooks/useAnalysis";

export function shouldShowAnalyzeCta(
  status: AnalysisStatus,
  loadChecked: boolean
): boolean {
  return status === "idle" && loadChecked;
}
