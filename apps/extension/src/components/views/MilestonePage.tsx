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
