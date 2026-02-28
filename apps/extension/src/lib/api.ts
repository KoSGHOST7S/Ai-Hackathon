import type { CanvasAssignment, AnalysisResult } from "@/types/analysis";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  jwt?: string
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (jwt) {
    headers["Authorization"] = `Bearer ${jwt}`;
  }
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) {
    throw new Error((data as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  return data as T;
}

export async function fetchAllAssignments(jwt: string): Promise<CanvasAssignment[]> {
  return apiFetch<CanvasAssignment[]>("/canvas/assignments", {}, jwt);
}

export async function analyzeAssignment(
  jwt: string, courseId: string, assignmentId: string
): Promise<AnalysisResult> {
  return apiFetch<AnalysisResult>("/assignments/analyze", {
    method: "POST",
    body: JSON.stringify({ courseId, assignmentId }),
  }, jwt);
}

export async function getAnalysisResult(
  jwt: string, courseId: string, assignmentId: string
): Promise<AnalysisResult | null> {
  try {
    return await apiFetch<AnalysisResult>(`/assignments/${courseId}/${assignmentId}/result`, {}, jwt);
  } catch { return null; }
}
