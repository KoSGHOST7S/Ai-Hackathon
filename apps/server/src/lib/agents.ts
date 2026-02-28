const AGENTS_URL = process.env.AGENTS_URL ?? "http://localhost:8000";

export interface FileContent { name: string; text: string; }

export interface AgentsAnalyzeRequest {
  name: string;
  description: string;
  points_possible: number;
  submission_types: string[];
  due_at: string | null;
  grading_type: string;
  allowed_attempts: number | null;
  attachment_names: string[];
  canvas_rubric_summary: string | null;
  file_contents: FileContent[];
}

export async function parseFileViaAgents(fileBuffer: Buffer, filename: string): Promise<FileContent | null> {
  const form = new FormData();
  form.append("file", new Blob([new Uint8Array(fileBuffer)]), filename);
  const res = await fetch(`${AGENTS_URL}/parse-file`, { method: "POST", body: form });
  if (!res.ok) return null;
  return res.json() as Promise<FileContent>;
}

export interface RubricLevel {
  label: string;
  points: number;
  description: string;
}

export interface RubricCriterion {
  name: string;
  description: string;
  weight: number;
  levels: RubricLevel[];
}

export interface Rubric {
  criteria: RubricCriterion[];
  totalPoints: number;
}

export interface Milestone {
  order: number;
  title: string;
  description: string;
  estimatedHours: number;
  deliverable: string;
}

export interface Milestones {
  milestones: Milestone[];
}

export interface AgentsAnalyzeResponse {
  rubric: Rubric;
  milestones: Milestones;
}

export async function callAgentsService(req: AgentsAnalyzeRequest): Promise<AgentsAnalyzeResponse> {
  const res = await fetch(`${AGENTS_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Agents service error ${res.status}: ${body}`);
  }
  return res.json();
}

export type SseProgressEvent = { type: "progress"; step: number; label: string };
export type SseDoneEvent     = { type: "done"; result: AgentsAnalyzeResponse };
export type SseErrorEvent    = { type: "error"; error: string };
export type SseEvent = SseProgressEvent | SseDoneEvent | SseErrorEvent;

/** Streams parsed SSE events from the agents /analyze/stream endpoint. */
export async function* streamFromAgentsService(
  req: AgentsAnalyzeRequest
): AsyncGenerator<SseEvent> {
  const res = await fetch(`${AGENTS_URL}/analyze/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok || !res.body) {
    yield { type: "error", error: `Agents service error ${res.status}` };
    return;
  }

  const decoder = new TextDecoder();
  let buffer = "";
  for await (const chunk of res.body) {
    buffer += decoder.decode(chunk as Uint8Array, { stream: true });
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
          yield { type: "done", result: data as unknown as AgentsAnalyzeResponse };
        } else if (eventType === "error") {
          yield { type: "error", error: (data.error as string) ?? "Unknown error" };
        }
      } catch { /* malformed event — skip */ }
    }
  }
}

export interface ChatMessage { role: string; content: string; }
export interface ChatRequest { system_context: string; messages: ChatMessage[]; }

export async function* streamChat(req: ChatRequest): AsyncGenerator<{ type: "done"; content: string } | { type: "error"; error: string }> {
  const res = await fetch(`${AGENTS_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok || !res.body) {
    yield { type: "error", error: `Chat service error ${res.status}` };
    return;
  }
  const decoder = new TextDecoder();
  let buffer = "";
  for await (const chunk of res.body as AsyncIterable<Uint8Array>) {
    buffer += decoder.decode(chunk, { stream: true });
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
