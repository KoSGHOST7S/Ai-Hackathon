# Sub-pages, Chat & File Parsing Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace all truncated UI with drill-down sub-pages, add free-form AI chat per assignment, and parse PDF/DOCX file attachments for richer agent context.

**Architecture:** The extension gains a sub-page navigation system (React state stack) with 4 new pages: DescriptionPage, CriterionPage, MilestonePage, ChatPage. The Python agents service adds a `/chat` SSE endpoint and PDF/DOCX parsing via `pymupdf`+`python-docx`. The Node.js server adds a chat proxy endpoint and file download+forwarding logic. Every piece of visible text either shows in full or taps through to a sub-page — zero dead-end truncation.

**Tech Stack:** React 19 / TypeScript / Tailwind — FastAPI / SSE / pymupdf / python-docx — Express / Prisma

---

## Tasks

### Task 1: File parsing — Python deps + parser module

**Files:**
- Create: `apps/agents/lib/file_parser.py`
- Modify: `apps/agents/pyproject.toml` (add deps)

**Step 1: Add dependencies**
```bash
cd apps/agents
uv add pymupdf python-docx
```

**Step 2: Create `apps/agents/lib/file_parser.py`**

```python
import io
import fitz  # pymupdf
from docx import Document


def parse_pdf(content: bytes) -> str:
    doc = fitz.open(stream=content, filetype="pdf")
    pages = []
    for page in doc:
        text = page.get_text()
        if text.strip():
            pages.append(text.strip())
    doc.close()
    return "\n\n".join(pages)


def parse_docx(content: bytes) -> str:
    doc = Document(io.BytesIO(content))
    return "\n\n".join(p.text for p in doc.paragraphs if p.text.strip())


def parse_file(content: bytes, filename: str) -> str | None:
    lower = filename.lower()
    if lower.endswith(".pdf"):
        return parse_pdf(content)
    elif lower.endswith(".docx"):
        return parse_docx(content)
    return None
```

**Step 3: Verify**
```bash
cd apps/agents
uv run python -c "from lib.file_parser import parse_file; print('OK')"
```

**Step 4: Commit**
```bash
git add apps/agents/
git commit -m "feat(agents): PDF/DOCX parser module with pymupdf + python-docx"
```

---

### Task 2: File parsing — agents model + endpoint

**Files:**
- Modify: `apps/agents/models/assignment.py`
- Modify: `apps/agents/main.py`

**Step 1: Add `FileContent` model and `file_contents` field to `AnalyzeRequest`**

Add to `apps/agents/models/assignment.py` (before `AnalyzeRequest`):
```python
class FileContent(BaseModel):
    name: str
    text: str
```

Add to `AnalyzeRequest` (after `canvas_rubric_summary`):
```python
    file_contents: list[FileContent] = []
```

**Step 2: Add `POST /parse-file` endpoint to `apps/agents/main.py`**

```python
from fastapi import UploadFile, File, Form
from lib.file_parser import parse_file

@app.post("/parse-file")
async def parse_file_endpoint(file: UploadFile = File(...)) -> dict:
    content = await file.read()
    text = parse_file(content, file.filename or "unknown")
    if text is None:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {file.filename}")
    return {"name": file.filename, "text": text[:10000]}  # cap at 10k chars
```

**Step 3: Update `rubric_generator.py` to include file contents**

Add to the `parts` list in `generate_rubric`, after the `canvas_rubric_summary` block:
```python
    if assignment.file_contents:
        for fc in assignment.file_contents:
            parts.append(f"\nAttached file — {fc.name}:\n{fc.text[:5000]}")
```

**Step 4: Verify imports**
```bash
cd apps/agents && uv run python -c "from models.assignment import AnalyzeRequest, FileContent; print('OK')"
```

**Step 5: Commit**
```bash
git add apps/agents/
git commit -m "feat(agents): file content in AnalyzeRequest + /parse-file endpoint"
```

---

### Task 3: File parsing — server download + forward

**Files:**
- Modify: `apps/server/src/lib/agents.ts`
- Modify: `apps/server/src/routes/assignments.ts`

**Step 1: Add `FileContent` to `AgentsAnalyzeRequest` in `agents.ts`**

Add interface:
```typescript
export interface FileContent { name: string; text: string; }
```

Add field to `AgentsAnalyzeRequest`:
```typescript
  file_contents: FileContent[];
```

Add file parsing helper:
```typescript
export async function parseFileViaAgents(fileBuffer: Buffer, filename: string): Promise<FileContent | null> {
  const form = new FormData();
  form.append("file", new Blob([fileBuffer]), filename);
  const res = await fetch(`${AGENTS_URL}/parse-file`, { method: "POST", body: form });
  if (!res.ok) return null;
  return res.json() as Promise<FileContent>;
}
```

**Step 2: In `assignments.ts`, download and parse file attachments**

In both `POST /analyze` and `POST /analyze/stream`, after fetching `attachment_names`, add file download logic. Extract into a shared helper at the top of the file:

```typescript
async function fetchFileContents(
  baseUrl: string, apiKey: string, courseId: string, assignmentId: string
): Promise<{ names: string[]; contents: FileContent[] }> {
  const names: string[] = [];
  const contents: FileContent[] = [];
  try {
    const submission = await canvasFetch(baseUrl, apiKey,
      `/courses/${courseId}/assignments/${assignmentId}/submissions/self`);
    if (!Array.isArray(submission?.attachments)) return { names, contents };
    
    for (const att of submission.attachments.slice(0, 3) as Array<{ display_name?: string; url?: string; size?: number }>) {
      const name = att.display_name ?? "";
      if (name) names.push(name);
      if (!att.url || (att.size && att.size > 2_000_000)) continue;
      if (!name.toLowerCase().endsWith(".pdf") && !name.toLowerCase().endsWith(".docx")) continue;
      
      try {
        const fileRes = await fetch(att.url);
        if (!fileRes.ok) continue;
        const buffer = Buffer.from(await fileRes.arrayBuffer());
        const parsed = await parseFileViaAgents(buffer, name);
        if (parsed) contents.push(parsed);
      } catch { /* non-fatal */ }
    }
  } catch { /* non-fatal — no submission yet */ }
  return { names, contents };
}
```

Replace the existing attachment fetching blocks in both routes with:
```typescript
    const { names: attachment_names, contents: file_contents } = 
      await fetchFileContents(creds.baseUrl, creds.apiKey, courseId, assignmentId);
```

Add `file_contents` to both `callAgentsService` and `agentReq` objects.

Import `parseFileViaAgents` and `FileContent` from `../lib/agents`.

**Step 3: tsc check**
```bash
cd apps/server && npx tsc --noEmit
```

**Step 4: Commit**
```bash
git add apps/server/src/ apps/agents/
git commit -m "feat(server): download Canvas file attachments, parse via agents service"
```

---

### Task 4: Chat — agents endpoint

**Files:**
- Create: `apps/agents/models/chat.py`
- Modify: `apps/agents/main.py`

**Step 1: Create `apps/agents/models/chat.py`**

```python
from pydantic import BaseModel


class ChatMessage(BaseModel):
    role: str  # "user" | "assistant"
    content: str


class ChatRequest(BaseModel):
    system_context: str
    messages: list[ChatMessage]
```

**Step 2: Add `POST /chat` SSE endpoint to `apps/agents/main.py`**

```python
from models.chat import ChatRequest
from lib.watsonx import get_model


@app.post("/chat")
async def chat(req: ChatRequest) -> StreamingResponse:
    async def generate():
        try:
            model = get_model()
            messages = [
                {"role": "system", "content": req.system_context},
                *[{"role": m.role, "content": m.content} for m in req.messages],
            ]
            resp = model.chat(messages=messages)
            content = resp["choices"][0]["message"]["content"]
            yield f'event: done\ndata: {json.dumps({"content": content})}\n\n'
        except Exception as exc:
            logging.exception("Chat failed")
            yield f'event: error\ndata: {json.dumps({"error": str(exc)})}\n\n'

    return StreamingResponse(generate(), media_type="text/event-stream")
```

Note: `model.chat()` is synchronous and returns the full response. For MVP we send the complete response as a single `done` event. True token-by-token streaming would require the async streaming API, which is a follow-up.

**Step 3: Verify**
```bash
cd apps/agents && uv run python -c "from models.chat import ChatRequest, ChatMessage; print('OK')"
```

**Step 4: Commit**
```bash
git add apps/agents/
git commit -m "feat(agents): /chat SSE endpoint for assignment Q&A"
```

---

### Task 5: Chat — server proxy

**Files:**
- Modify: `apps/server/src/lib/agents.ts`
- Modify: `apps/server/src/routes/assignments.ts`

**Step 1: Add chat types and stream helper to `agents.ts`**

```typescript
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
```

**Step 2: Add `POST /assignments/:courseId/:assignmentId/chat` to `assignments.ts`**

Add before `export default router`:

```typescript
import { streamChat, type ChatMessage } from "../lib/agents";

// POST /assignments/:courseId/:assignmentId/chat
router.post("/:courseId/:assignmentId/chat", requireAuth, async (req: AuthRequest, res: Response) => {
  const { courseId, assignmentId } = req.params;
  const { messages } = req.body as { messages: ChatMessage[] };
  if (!messages?.length) { res.status(400).json({ error: "messages required" }); return; }

  try {
    const result = await prisma.analysisResult.findUnique({
      where: { userId_courseId_assignmentId: { userId: req.userId!, courseId, assignmentId } },
    });
    if (!result) { res.status(404).json({ error: "Analyze the assignment first" }); return; }

    const system_context = [
      "You are a helpful academic assistant. Answer questions about this assignment using the context below.",
      "",
      `Assignment rubric: ${JSON.stringify(result.rubric)}`,
      `Assignment milestones: ${JSON.stringify(result.milestones)}`,
    ].join("\n");

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    for await (const event of streamChat({ system_context, messages })) {
      if (event.type === "done") {
        res.write(`event: done\ndata: ${JSON.stringify({ content: event.content })}\n\n`);
      } else {
        res.write(`event: error\ndata: ${JSON.stringify({ error: event.error })}\n\n`);
      }
    }
    res.end();
  } catch (err) {
    console.error("chat error:", err);
    if (!res.headersSent) {
      res.status(502).json({ error: "Chat failed" });
    } else {
      res.write(`event: error\ndata: ${JSON.stringify({ error: "Internal error" })}\n\n`);
      res.end();
    }
  }
});
```

**Step 3: tsc check**
```bash
cd apps/server && npx tsc --noEmit
```

**Step 4: Commit**
```bash
git add apps/server/src/
git commit -m "feat(server): chat proxy endpoint with assignment context injection"
```

---

### Task 6: Extension — sub-page navigation system

**Files:**
- Create: `apps/extension/src/hooks/useSubPage.ts`

This hook manages a stack of sub-pages within AssignmentDetailView.

**Step 1: Create `apps/extension/src/hooks/useSubPage.ts`**

```typescript
import { useState, useCallback } from "react";

export type SubPage =
  | { type: "description" }
  | { type: "criterion"; index: number }
  | { type: "milestone"; index: number }
  | { type: "chat" };

export function useSubPage() {
  const [subPage, setSubPage] = useState<SubPage | null>(null);

  const openDescription = useCallback(() => setSubPage({ type: "description" }), []);
  const openCriterion   = useCallback((index: number) => setSubPage({ type: "criterion", index }), []);
  const openMilestone   = useCallback((index: number) => setSubPage({ type: "milestone", index }), []);
  const openChat        = useCallback(() => setSubPage({ type: "chat" }), []);
  const close           = useCallback(() => setSubPage(null), []);

  return { subPage, openDescription, openCriterion, openMilestone, openChat, close };
}
```

**Step 2: Commit**
```bash
git add apps/extension/src/hooks/useSubPage.ts
git commit -m "feat(extension): useSubPage navigation hook"
```

---

### Task 7: Extension — sub-page components

**Files:**
- Create: `apps/extension/src/components/views/DescriptionPage.tsx`
- Create: `apps/extension/src/components/views/CriterionPage.tsx`
- Create: `apps/extension/src/components/views/MilestonePage.tsx`
- Create: `apps/extension/src/components/views/SubPageHeader.tsx`

**Step 1: Create shared sub-page header**

`apps/extension/src/components/views/SubPageHeader.tsx`:
```tsx
import { ArrowLeft } from "lucide-react";

interface Props {
  title: string;
  onBack: () => void;
}

export function SubPageHeader({ title, onBack }: Props) {
  return (
    <div className="flex items-center gap-2 pb-3 border-b border-border shrink-0">
      <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors p-0.5">
        <ArrowLeft className="h-4 w-4" />
      </button>
      <p className="text-sm font-semibold text-foreground">{title}</p>
    </div>
  );
}
```

**Step 2: Create `DescriptionPage.tsx`**

```tsx
import { FileText } from "lucide-react";
import { SubPageHeader } from "./SubPageHeader";
import type { CanvasAssignment } from "@/types/analysis";

interface Props {
  assignment: CanvasAssignment;
  onBack: () => void;
}

export function DescriptionPage({ assignment, onBack }: Props) {
  const text = (assignment.description ?? "")
    .replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <SubPageHeader title="Description" onBack={onBack} />
      <div className="flex-1 overflow-y-auto py-3 flex flex-col gap-4">
        <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">{text || "No description provided."}</p>

        {assignment.submission_types && assignment.submission_types.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Submission</p>
            <p className="text-xs text-muted-foreground">
              {assignment.submission_types.join(", ")} · {assignment.points_possible} pts
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
```

**Step 3: Create `CriterionPage.tsx`**

```tsx
import { SubPageHeader } from "./SubPageHeader";
import { Badge } from "@/components/ui/badge";
import type { RubricCriterion } from "@/types/analysis";

interface Props {
  criterion: RubricCriterion;
  onBack: () => void;
}

const LEVEL_COLORS = [
  "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30",
  "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30",
  "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30",
  "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30",
];

export function CriterionPage({ criterion, onBack }: Props) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <SubPageHeader title="Rubric" onBack={onBack} />
      <div className="flex-1 overflow-y-auto py-3 flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{criterion.name}</h3>
          <Badge variant="muted" className="mt-1">{criterion.weight} pts</Badge>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">{criterion.description}</p>

        <div className="flex flex-col gap-2.5">
          {criterion.levels.map((l, j) => (
            <div key={j} className={`rounded-lg p-3 ${LEVEL_COLORS[j] ?? ""}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold">{l.label}</span>
                <span className="text-[10px] font-medium tabular-nums">{l.points} pts</span>
              </div>
              <p className="text-[11px] leading-relaxed opacity-80">{l.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

**Step 4: Create `MilestonePage.tsx`**

```tsx
import { CheckCircle2, Clock, Package } from "lucide-react";
import { SubPageHeader } from "./SubPageHeader";
import { Button } from "@/components/ui/button";
import type { Milestone } from "@/types/analysis";

interface Props {
  milestone: Milestone;
  isChecked: boolean;
  onToggle: () => void;
  onBack: () => void;
}

export function MilestonePage({ milestone, isChecked, onToggle, onBack }: Props) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <SubPageHeader title="Milestones" onBack={onBack} />
      <div className="flex-1 overflow-y-auto py-3 flex flex-col gap-4">
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
            Step {milestone.order}
          </p>
          <h3 className={`text-sm font-semibold ${isChecked ? "line-through text-muted-foreground" : "text-foreground"}`}>
            {milestone.title}
          </h3>
        </div>

        <p className="text-xs text-foreground/80 leading-relaxed">{milestone.description}</p>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span>~{milestone.estimatedHours} hours estimated</span>
          </div>
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <Package className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span>{milestone.deliverable}</span>
          </div>
        </div>

        <Button
          variant={isChecked ? "outline" : "default"}
          className="w-full gap-2"
          onClick={onToggle}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          {isChecked ? "Mark incomplete" : "Mark complete"}
        </Button>
      </div>
    </div>
  );
}
```

**Step 5: Commit**
```bash
git add apps/extension/src/components/views/
git commit -m "feat(extension): DescriptionPage, CriterionPage, MilestonePage sub-pages"
```

---

### Task 8: Extension — ChatPage + API

**Files:**
- Create: `apps/extension/src/components/views/ChatPage.tsx`
- Modify: `apps/extension/src/lib/api.ts`

**Step 1: Add `streamChat` to `api.ts`**

```typescript
export type ChatStreamEvent =
  | { type: "done"; content: string }
  | { type: "error"; error: string };

export async function* streamChat(
  jwt: string, courseId: string, assignmentId: string, messages: Array<{ role: string; content: string }>
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
```

**Step 2: Create `ChatPage.tsx`**

```tsx
import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Bot, User } from "lucide-react";
import { SubPageHeader } from "./SubPageHeader";
import { streamChat } from "@/lib/api";

interface ChatMsg { role: "user" | "assistant"; content: string; }

interface Props {
  courseId: string;
  assignmentId: string;
  assignmentName: string;
  jwt: string;
  onBack: () => void;
}

export function ChatPage({ courseId, assignmentId, assignmentName, jwt, onBack }: Props) {
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: "assistant", content: `I can answer questions about "${assignmentName}" — its rubric, milestones, and requirements. What would you like to know?` },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    const userMsg: ChatMsg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setSending(true);

    try {
      for await (const event of streamChat(jwt, courseId, assignmentId, newMessages)) {
        if (event.type === "done") {
          setMessages((prev) => [...prev, { role: "assistant", content: event.content }]);
        } else if (event.type === "error") {
          setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${event.error}` }]);
        }
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Something went wrong. Try again." }]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <SubPageHeader title="Ask AI" onBack={onBack} />

      <div ref={scrollRef} className="flex-1 overflow-y-auto py-3 flex flex-col gap-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "assistant" && (
              <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="h-3 w-3 text-primary" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-lg px-3 py-2 text-xs leading-relaxed ${
              m.role === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground"
            }`}>
              {m.content}
            </div>
            {m.role === "user" && (
              <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                <User className="h-3 w-3 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
        {sending && (
          <div className="flex gap-2 items-center">
            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Loader2 className="h-3 w-3 text-primary animate-spin" />
            </div>
            <span className="text-xs text-muted-foreground">Thinking…</span>
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-border pt-2 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
          placeholder="Ask about this assignment…"
          disabled={sending}
          className="flex-1 text-xs bg-muted rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground disabled:opacity-50"
        />
        <button
          onClick={send}
          disabled={sending || !input.trim()}
          className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 shrink-0"
        >
          {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}
```

**Step 3: Commit**
```bash
git add apps/extension/src/components/views/ChatPage.tsx apps/extension/src/lib/api.ts
git commit -m "feat(extension): ChatPage with streaming AI responses"
```

---

### Task 9: Extension — rework AssignmentDetailView with sub-pages

**Files:**
- Modify: `apps/extension/src/components/views/AssignmentDetailView.tsx`

This is the big rewrite. The detail view becomes a parent that conditionally renders sub-pages.

**Key changes:**

1. Import `useSubPage` and all 4 sub-page components
2. If `subPage` is set, render the appropriate sub-page instead of the detail view
3. Rework the detail view body:
   - Assignment name: wraps (remove `truncate`)
   - Description: tappable row with chevron → `DescriptionPage`
   - Rubric criteria: compact rows with chevrons → `CriterionPage` (remove accordion)
   - Milestones: compact rows with chevrons → `MilestonePage` (remove inline checkbox toggle)
   - Chat input bar at bottom → `ChatPage`
4. Remove `expandedCriteria` state (no more accordion)
5. Keep `checkedMilestones` state (used by `MilestonePage.onToggle`)

The detail view becomes a clean list of tappable sections, each opening a dedicated sub-page.

**Step 1: Complete rewrite of `AssignmentDetailView.tsx`**

Read the current file, then replace it entirely. The new version:
- Uses `useSubPage()` for navigation
- When `subPage` is set, renders the matching sub-page component with `close` as `onBack`
- When no sub-page, renders the compact detail view
- Description row: shows 1 line + ChevronRight, taps to `openDescription()`
- Rubric criteria: each row shows name + weight badge + ChevronRight, taps to `openCriterion(i)`
- Milestones: each row shows order + title + ChevronRight, taps to `openMilestone(i)`
- Chat: an input-looking bar at the bottom that taps to `openChat()`
- Re-analyze button at the very bottom

Important: pass `checkedMilestones` and `toggleMilestone` into `MilestonePage` so the check state is shared.

**Step 2: tsc + build**
```bash
cd apps/extension && pnpm exec tsc --noEmit && pnpm build
```

**Step 3: Commit**
```bash
git add apps/extension/src/
git commit -m "feat(extension): sub-page navigation — zero truncation, drill-down for all content"
```

---

### Task 10: Extension — types cleanup + build verify

**Files:**
- Modify: `apps/extension/src/types/analysis.ts` (export `RubricCriterion` and `Milestone` individually if not already)

**Step 1: Verify `RubricCriterion` and `Milestone` are individually importable**

Check `apps/extension/src/types/analysis.ts`. `CriterionPage` imports `RubricCriterion` and `MilestonePage` imports `Milestone` — both must be exported from this file. They already are (they're on separate `export interface` lines), so this step is just a verification.

**Step 2: Full build**
```bash
cd apps/extension && pnpm exec tsc --noEmit && pnpm build
```

**Step 3: Commit if any changes needed**
```bash
git add apps/extension/src/ && git commit -m "fix(extension): type exports for sub-page components" || echo "Nothing to commit"
```
