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
