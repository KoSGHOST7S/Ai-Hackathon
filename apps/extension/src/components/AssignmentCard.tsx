import { Clock, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CanvasAssignment } from "@/types/analysis";

interface Props {
  assignment: CanvasAssignment;
  hasAnalysis?: boolean;
  isActive?: boolean;
  onClick: () => void;
}

function dueBadge(dueAt: string | null): { label: string; variant: "secondary" | "default" | "muted" } {
  if (!dueAt) return { label: "No due date", variant: "muted" };
  const diff = new Date(dueAt).getTime() - Date.now();
  const days = diff / (1000 * 60 * 60 * 24);
  if (days < 0)  return { label: "Past due", variant: "secondary" };
  if (days < 1)  return { label: "Due today", variant: "secondary" };
  if (days < 3)  return { label: `${Math.ceil(days)}d left`, variant: "default" };
  return { label: `${Math.ceil(days)}d left`, variant: "muted" };
}

export function AssignmentCard({ assignment, hasAnalysis, isActive, onClick }: Props) {
  const due = dueBadge(assignment.due_at);
  return (
    <Card
      className={`shadow-none cursor-pointer transition-colors hover:bg-muted/40 ${isActive ? "border-primary" : ""}`}
      onClick={onClick}
    >
      <div className="p-3 flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-foreground leading-snug flex-1 min-w-0 line-clamp-2">
            {assignment.name}
          </p>
          <div className="flex items-center gap-1 shrink-0">
            {hasAnalysis && (
              <span className="inline-flex items-center gap-0.5 bg-primary/10 text-primary rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide shrink-0">
                <Sparkles className="h-2.5 w-2.5" />
                AI
              </span>
            )}
            <Badge variant={due.variant}>{due.label}</Badge>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-3 w-3 text-muted-foreground shrink-0" />
          <span className="text-xs text-muted-foreground truncate">
            {assignment.courseName ?? assignment.courseCode ?? "Unknown course"}
            {assignment.points_possible ? ` · ${assignment.points_possible} pts` : ""}
          </span>
        </div>
      </div>
    </Card>
  );
}
