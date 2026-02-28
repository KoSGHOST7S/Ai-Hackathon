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
        <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">
          {text || "No description provided."}
        </p>

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
