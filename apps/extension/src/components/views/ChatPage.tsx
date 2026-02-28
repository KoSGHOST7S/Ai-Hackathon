import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Bot, User } from "lucide-react";
import { SubPageHeader } from "./SubPageHeader";
import { streamChat } from "@/lib/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
    const historyWithUser = [...messages, userMsg];
    // Add user message + empty assistant placeholder in one state update
    setMessages([...historyWithUser, { role: "assistant", content: "" }]);
    setSending(true);

    try {
      for await (const event of streamChat(jwt, courseId, assignmentId, historyWithUser)) {
        if (event.type === "token") {
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last?.role === "assistant") {
              updated[updated.length - 1] = { ...last, content: last.content + event.token };
            }
            return updated;
          });
        } else if (event.type === "error") {
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last?.role === "assistant") {
              updated[updated.length - 1] = { ...last, content: `Error: ${event.error}` };
            }
            return updated;
          });
        }
        // "done" event: message already assembled from tokens, nothing to do
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last?.role === "assistant" && last.content === "") {
          updated[updated.length - 1] = { ...last, content: "Something went wrong. Try again." };
        }
        return updated;
      });
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
              {m.role === "assistant" ? (
                <div className="chat-prose">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {m.content}
                  </ReactMarkdown>
                </div>
              ) : (
                m.content
              )}
            </div>
            {m.role === "user" && (
              <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                <User className="h-3 w-3 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
        {sending && messages[messages.length - 1]?.content === "" && (
          <div className="flex gap-2 items-center -mt-1 ml-7">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Loader2 className="h-3 w-3 text-primary animate-spin" />
              Thinking…
            </span>
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
