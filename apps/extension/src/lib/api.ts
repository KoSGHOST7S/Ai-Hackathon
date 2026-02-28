import type { CanvasAssignment, AnalysisResult, ReviewResult } from "@/types/analysis";
import { storageGet, storageListKeys, storageRemove, storageSet } from "@/lib/storage";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const API_CACHE_PREFIX = "assignmint_api_cache:v1:";
export const API_RESPONSE_CACHE_TTL_MS = 5 * 60 * 1000;

type ApiFetchOptions = RequestInit & {
  cacheTtlMs?: number;
  bypassCache?: boolean;
};

type CachedApiResponse = {
  expiresAt: number;
  data: unknown;
};

function getUserCacheScope(jwt: string): string {
  try {
    const payload = JSON.parse(atob(jwt.split(".")[1] ?? "")) as {
      userId?: string;
      sub?: string;
      email?: string;
    };
    return payload.userId ?? payload.sub ?? payload.email ?? jwt.slice(0, 16);
  } catch {
    return jwt.slice(0, 16);
  }
}

function getApiCacheKey(jwt: string, path: string): string {
  return `${API_CACHE_PREFIX}${getUserCacheScope(jwt)}:${path}`;
}

async function readCachedResponse<T>(key: string): Promise<T | null> {
  const raw = await storageGet(key);
  if (!raw) return null;
  try {
    const cached = JSON.parse(raw) as CachedApiResponse;
    if (Date.now() >= cached.expiresAt) {
      await storageRemove(key);
      return null;
    }
    return cached.data as T;
  } catch {
    await storageRemove(key);
    return null;
  }
}

async function writeCachedResponse<T>(key: string, data: T, ttlMs: number): Promise<void> {
  const payload: CachedApiResponse = { expiresAt: Date.now() + ttlMs, data };
  await storageSet(key, JSON.stringify(payload));
}

export async function clearApiResponseCache(jwt?: string): Promise<void> {
  const prefix = jwt ? `${API_CACHE_PREFIX}${getUserCacheScope(jwt)}:` : API_CACHE_PREFIX;
  const keys = await storageListKeys();
  const removals = keys
    .filter((key) => key.startsWith(prefix))
    .map((key) => storageRemove(key));
  await Promise.all(removals);
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
  jwt?: string
): Promise<T> {
  const { cacheTtlMs, bypassCache, ...requestOptions } = options;
  const method = (requestOptions.method ?? "GET").toUpperCase();
  const canReadOrWriteCache = method === "GET" && !!jwt && (cacheTtlMs ?? 0) > 0;
  const cacheKey = canReadOrWriteCache && jwt ? getApiCacheKey(jwt, path) : null;

  if (cacheKey && !bypassCache) {
    const cached = await readCachedResponse<T>(cacheKey);
    if (cached !== null) return cached;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(requestOptions.headers as Record<string, string>),
  };
  if (jwt) {
    headers["Authorization"] = `Bearer ${jwt}`;
  }
  const res = await fetch(`${BASE_URL}${path}`, { ...requestOptions, headers });
  const data = await res.json();
  if (!res.ok) {
    throw new Error((data as { error?: string }).error ?? `HTTP ${res.status}`);
  }

  if (cacheKey && cacheTtlMs) {
    await writeCachedResponse(cacheKey, data as T, cacheTtlMs);
  }
  if (method !== "GET" && jwt) {
    await clearApiResponseCache(jwt);
  }

  return data as T;
}

export async function fetchAllAssignments(jwt: string, bypassCache = false): Promise<CanvasAssignment[]> {
  return apiFetch<CanvasAssignment[]>(
    "/canvas/assignments",
    { cacheTtlMs: API_RESPONSE_CACHE_TTL_MS, bypassCache },
    jwt
  );
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

export async function parseFile(jwt: string, file: File): Promise<{ name: string; text: string }> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${BASE_URL}/assignments/parse-file`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${jwt}` },
    body: form,
  });
  const data = await res.json();
  if (!res.ok) throw new Error((data as { error?: string }).error ?? `HTTP ${res.status}`);
  return data as { name: string; text: string };
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
