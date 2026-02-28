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
