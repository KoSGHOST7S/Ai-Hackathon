/**
 * Tests for the SSE parsing logic used in lib/agents.ts.
 * We extract and unit-test the core parsing logic in isolation.
 */
import { describe, it, expect } from "vitest";

// Inline the SSE parser used across agents.ts / api.ts so we can test it
// without importing the whole module (which needs env vars).
function parseSseEvents(buffer: string): { eventType: string; dataStr: string }[] {
  const events = buffer.split("\n\n");
  const results: { eventType: string; dataStr: string }[] = [];
  for (const raw of events) {
    if (!raw.trim()) continue;
    const lines = raw.split("\n");
    const eventType = lines.find((l) => l.startsWith("event:"))?.slice(6).trim();
    const dataStr = lines.find((l) => l.startsWith("data:"))?.slice(5).trim();
    if (eventType && dataStr) results.push({ eventType, dataStr });
  }
  return results;
}

describe("SSE parser", () => {
  it("parses a single progress event", () => {
    const raw = 'event: progress\ndata: {"step":0,"label":"Extracting…"}\n\n';
    const events = parseSseEvents(raw);
    expect(events).toHaveLength(1);
    expect(events[0].eventType).toBe("progress");
    expect(JSON.parse(events[0].dataStr)).toMatchObject({ step: 0 });
  });

  it("parses a done event", () => {
    const raw = 'event: done\ndata: {"rubric":{},"milestones":{}}\n\n';
    const events = parseSseEvents(raw);
    expect(events[0].eventType).toBe("done");
  });

  it("parses an error event", () => {
    const raw = 'event: error\ndata: {"error":"something went wrong"}\n\n';
    const events = parseSseEvents(raw);
    expect(events[0].eventType).toBe("error");
    expect(JSON.parse(events[0].dataStr).error).toBe("something went wrong");
  });

  it("parses a token event", () => {
    const raw = 'event: token\ndata: {"token":"Hello"}\n\n';
    const events = parseSseEvents(raw);
    expect(events[0].eventType).toBe("token");
    expect(JSON.parse(events[0].dataStr).token).toBe("Hello");
  });

  it("parses multiple events in one chunk", () => {
    const raw = [
      'event: progress\ndata: {"step":0,"label":"Step 0"}\n\n',
      'event: progress\ndata: {"step":1,"label":"Step 1"}\n\n',
      'event: done\ndata: {"result":true}\n\n',
    ].join("");
    const events = parseSseEvents(raw);
    expect(events).toHaveLength(3);
    expect(events[0].eventType).toBe("progress");
    expect(events[2].eventType).toBe("done");
  });

  it("ignores events with no data line", () => {
    const raw = "event: heartbeat\n\n";
    const events = parseSseEvents(raw);
    expect(events).toHaveLength(0);
  });

  it("ignores empty chunks", () => {
    const events = parseSseEvents("\n\n\n\n");
    expect(events).toHaveLength(0);
  });

  it("handles events that are split across two chunks (buffer remainder)", () => {
    const full = 'event: progress\ndata: {"step":0}\n\nevent: done\ndata: {}\n\n';
    // Simulate receiving in two partial reads
    const part1 = full.slice(0, 30);
    const part2 = full.slice(30);
    let buffer = part1;
    const all: ReturnType<typeof parseSseEvents> = [];
    const chunks1 = buffer.split("\n\n");
    buffer = chunks1.pop() ?? "";
    all.push(...parseSseEvents(chunks1.join("\n\n") + "\n\n"));

    buffer += part2;
    all.push(...parseSseEvents(buffer));
    expect(all.some((e) => e.eventType === "done")).toBe(true);
  });
});
