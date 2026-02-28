import { CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { SubPageHeader } from "./SubPageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ReviewResult } from "@/types/analysis";

interface Props {
  result: ReviewResult;
  onResubmit: () => void;
  onBack: () => void;
}

const LEVEL_COLORS: Record<string, string> = {
  "Excellent":   "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30",
  "Proficient":  "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30",
  "Developing":  "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30",
  "Beginning":   "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30",
};

function scoreColor(pct: number): string {
  if (pct >= 0.9) return "text-emerald-600 dark:text-emerald-400";
  if (pct >= 0.7) return "text-blue-600 dark:text-blue-400";
  if (pct >= 0.5) return "text-amber-600 dark:text-amber-400";
  return "text-rose-600 dark:text-rose-400";
}

export function ReviewPage({ result, onResubmit, onBack }: Props) {
  const pct = result.totalPossible > 0 ? result.totalScore / result.totalPossible : 0;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <SubPageHeader title="Review" onBack={onBack} />
      <div className="flex-1 overflow-y-auto py-3 flex flex-col gap-4">

        {/* Overall score */}
        <div className="text-center py-3">
          <p className={`text-3xl font-bold tabular-nums ${scoreColor(pct)}`}>
            {result.totalScore}<span className="text-lg text-muted-foreground font-normal">/{result.totalPossible}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">{Math.round(pct * 100)}%</p>
        </div>

        {/* Per-criterion scores */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Criteria Scores</p>
          <div className="flex flex-col gap-1.5">
            {result.scores.map((s, i) => (
              <Card key={i} className="shadow-none">
                <div className="p-3 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-foreground">{s.criterionName}</span>
                    <span className="text-[10px] tabular-nums text-muted-foreground">{s.points}/{s.maxPoints}</span>
                  </div>
                  <Badge className={`w-fit text-[10px] ${LEVEL_COLORS[s.level] ?? ""}`}>{s.level}</Badge>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{s.feedback}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Strengths */}
        {result.strengths.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Strengths</p>
            <div className="flex flex-col gap-1.5">
              {result.strengths.map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-foreground leading-relaxed">{s}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Improvements */}
        {result.improvements.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Areas to Improve</p>
            <div className="flex flex-col gap-1.5">
              {result.improvements.map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-foreground leading-relaxed">{s}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Steps */}
        {result.nextSteps.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Next Steps</p>
            <div className="flex flex-col gap-1.5">
              {result.nextSteps.map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[9px] font-bold text-primary">{i + 1}</span>
                  </div>
                  <p className="text-xs text-foreground leading-relaxed">{s}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Re-submit */}
        <Button variant="outline" className="w-full gap-2 text-xs" onClick={onResubmit}>
          <ArrowRight className="h-3 w-3" />
          Re-submit
        </Button>
      </div>
    </div>
  );
}
