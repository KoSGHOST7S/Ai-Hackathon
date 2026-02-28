import { useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, Clock, Package, CheckSquare, Square } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
  const [checkedTasks, setCheckedTasks] = useState<Set<number>>(new Set());

  function toggleTask(idx: number) {
    setCheckedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  const tasks = milestone.tasks ?? [];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <SubPageHeader title="Milestones" onBack={onBack} />
      <div className="flex-1 overflow-y-auto py-3 flex flex-col gap-4">

        {/* Header */}
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
            Step {milestone.order}
          </p>
          <h3 className={`text-sm font-semibold ${isChecked ? "line-through text-muted-foreground" : "text-foreground"}`}>
            {milestone.title}
          </h3>
        </div>

        {/* Tasks checklist */}
        {tasks.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">What to do</p>
            <div className="rounded-md border border-border bg-muted/25 p-3 space-y-2">
              {tasks.map((task, idx) => (
                <button
                  key={idx}
                  onClick={() => toggleTask(idx)}
                  className="flex items-start gap-2 w-full text-left group"
                >
                  {checkedTasks.has(idx)
                    ? <CheckSquare className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary" />
                    : <Square className="h-3.5 w-3.5 shrink-0 mt-0.5 text-muted-foreground group-hover:text-foreground" />
                  }
                  <span className={`text-xs leading-relaxed ${checkedTasks.has(idx) ? "line-through text-muted-foreground" : "text-foreground/85"}`}>
                    {task}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Description — markdown prose */}
        {milestone.description && (
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">How to do it</p>
            <div className="rounded-md border border-border bg-muted/25 p-3">
              <div className="milestone-prose">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {milestone.description}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}

        {/* Time + Deliverable */}
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

        {/* Mark complete */}
        <Button
          variant={isChecked ? "outline" : "default"}
          className="w-full gap-2"
          onClick={onToggle}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          {isChecked ? "Mark incomplete" : "Mark complete"}
        </Button>

        {/* Prev / Next */}
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
