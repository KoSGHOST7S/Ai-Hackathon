import type { CanvasAssignment, AnalysisResult, ReviewResult } from "@/types/analysis";

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

export type StreamEvent =
  | { type: "progress"; step: number; label: string }
  | { type: "done";     result: AnalysisResult }
  | { type: "error";    error: string };

export interface AnalysisResultMeta {
  courseId: string;
  assignmentId: string;
  updatedAt: string;
}

export async function fetchAnalysisResults(jwt: string): Promise<AnalysisResultMeta[]> {
  return apiFetch<AnalysisResultMeta[]>("/assignments/results", {}, jwt);
}

export async function* streamAnalysis(
  jwt: string,
  courseId: string,
  assignmentId: string
): AsyncGenerator<StreamEvent> {
  const response = await fetch(`${BASE_URL}/assignments/analyze/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`,
    },
    body: JSON.stringify({ courseId, assignmentId }),
  });

  if (!response.ok || !response.body) {
    yield { type: "error", error: `HTTP ${response.status}` };
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";

    for (const raw of events) {
      if (!raw.trim()) continue;
      const lines = raw.split("\n");
      const eventType = lines.find((l) => l.startsWith("event:"))?.slice(6).trim();
      const dataStr   = lines.find((l) => l.startsWith("data:"))?.slice(5).trim();
      if (!dataStr) continue;
      try {
        const data = JSON.parse(dataStr) as Record<string, unknown>;
        if (eventType === "progress") {
          yield { type: "progress", step: data.step as number, label: data.label as string };
        } else if (eventType === "done") {
          yield { type: "done", result: data as unknown as AnalysisResult };
        } else if (eventType === "error") {
          yield { type: "error", error: (data.error as string) ?? "Unknown error" };
        }
      } catch { /* malformed chunk — skip */ }
    }
  }
}

export type ReviewStreamEvent =
  | { type: "progress"; step: number; label: string }
  | { type: "done"; result: ReviewResult }
  | { type: "error"; error: string };

export async function* streamReviewSubmission(
  jwt: string, courseId: string, assignmentId: string,
  body: { submission_text?: string; submission_files?: Array<{ name: string; text: string }> }
): AsyncGenerator<ReviewStreamEvent> {
  const response = await fetch(`${BASE_URL}/assignments/${courseId}/${assignmentId}/review`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${jwt}` },
    body: JSON.stringify(body),
  });
  if (!response.ok || !response.body) {
    yield { type: "error", error: `HTTP ${response.status}` }; return;
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";
    for (const raw of events) {
      if (!raw.trim()) continue;
      const lines = raw.split("\n");
      const eventType = lines.find((l) => l.startsWith("event:"))?.slice(6).trim();
      const dataStr = lines.find((l) => l.startsWith("data:"))?.slice(5).trim();
      if (!dataStr) continue;
      try {
        const data = JSON.parse(dataStr);
        if (eventType === "progress") yield { type: "progress", step: data.step, label: data.label };
        else if (eventType === "done") yield { type: "done", result: data as ReviewResult };
        else if (eventType === "error") yield { type: "error", error: data.error };
      } catch { /* skip */ }
    }
  }
}

export async function getReviewResult(
  jwt: string, courseId: string, assignmentId: string
): Promise<ReviewResult | null> {
  try { return await apiFetch<ReviewResult>(`/assignments/${courseId}/${assignmentId}/review`, {}, jwt); }
  catch { return null; }
}

export type ChatStreamEvent =
  | { type: "done"; content: string }
  | { type: "error"; error: string };

export async function* streamChat(
  jwt: string, courseId: string, assignmentId: string,
  messages: Array<{ role: string; content: string }>
): AsyncGenerator<ChatStreamEvent> {
  const response = await fetch(`${BASE_URL}/assignments/${courseId}/${assignmentId}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${jwt}` },
    body: JSON.stringify({ messages }),
  });
  if (!response.ok || !response.body) {
    yield { type: "error", error: `HTTP ${response.status}` }; return;
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";
    for (const raw of events) {
      if (!raw.trim()) continue;
      const lines = raw.split("\n");
      const eventType = lines.find((l) => l.startsWith("event:"))?.slice(6).trim();
      const dataStr = lines.find((l) => l.startsWith("data:"))?.slice(5).trim();
      if (!dataStr) continue;
      try {
        const data = JSON.parse(dataStr);
        if (eventType === "done") yield { type: "done", content: data.content };
        else if (eventType === "error") yield { type: "error", error: data.error };
      } catch { /* skip */ }
    }
  }
}
