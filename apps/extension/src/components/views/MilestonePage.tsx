import { CheckCircle2, ChevronLeft, ChevronRight, Clock, Package } from "lucide-react";
import { SubPageHeader } from "./SubPageHeader";
import { Button } from "@/components/ui/button";
import type { Milestone } from "@/types/analysis";

interface Props {
  milestone: Milestone;
  isChecked: boolean;
  onToggle: () => void;
  onBack: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

type Block =
  | { type: "paragraph"; lines: string[] }
  | { type: "bullet"; lines: string[] }
  | { type: "numbered"; lines: string[] };

function parseMarkdownish(text: string): Block[] {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, ""));
        i++;
      }
      blocks.push({ type: "bullet", lines: items });
      continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push({ type: "numbered", lines: items });
      continue;
    }

    const paragraph: string[] = [line];
    i++;
    while (i < lines.length && !/^[-*]\s+/.test(lines[i]) && !/^\d+\.\s+/.test(lines[i])) {
      paragraph.push(lines[i]);
      i++;
    }
    blocks.push({ type: "paragraph", lines: paragraph });
  }

  return blocks;
}

function renderLine(line: string) {
  const labelMatch = line.match(/^([A-Za-z][A-Za-z /_-]{1,30}):\s+(.+)$/);
  if (!labelMatch) return <span>{line}</span>;
  return (
    <span>
      <span className="font-semibold text-foreground">{labelMatch[1]}:</span> {labelMatch[2]}
    </span>
  );
}

export function MilestonePage({
  milestone,
  isChecked,
  onToggle,
  onBack,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
}: Props) {
  const blocks = parseMarkdownish(milestone.description);
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

        <div className="space-y-2">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Plan</p>
          <div className="rounded-md border border-border bg-muted/25 p-3 space-y-2">
            {blocks.map((block, idx) => {
              if (block.type === "bullet") {
                return (
                  <ul key={idx} className="space-y-1 list-disc pl-4 text-xs text-foreground/85 leading-relaxed">
                    {block.lines.map((line, i) => <li key={i}>{renderLine(line)}</li>)}
                  </ul>
                );
              }
              if (block.type === "numbered") {
                return (
                  <ol key={idx} className="space-y-1 list-decimal pl-4 text-xs text-foreground/85 leading-relaxed">
                    {block.lines.map((line, i) => <li key={i}>{renderLine(line)}</li>)}
                  </ol>
                );
              }
              return (
                <p key={idx} className="text-xs text-foreground/85 leading-relaxed">
                  {block.lines.map((line, i) => (
                    <span key={i}>
                      {renderLine(line)}
                      {i < block.lines.length - 1 ? " " : ""}
                    </span>
                  ))}
                </p>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span>~{milestone.estimatedHours} hours estimated</span>
          </div>
          <div className="flex items-start gap-2 text-xs text-muted-foreground rounded-md border border-border bg-muted/20 p-2.5">
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

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" className="gap-2" onClick={onPrev} disabled={!hasPrev}>
            <ChevronLeft className="h-3.5 w-3.5" />
            Previous
          </Button>
          <Button variant="outline" className="gap-2" onClick={onNext} disabled={!hasNext}>
            Next
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
