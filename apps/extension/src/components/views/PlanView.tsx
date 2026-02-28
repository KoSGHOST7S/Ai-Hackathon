import { Loader2 } from "lucide-react";
import { AssignmentCard } from "@/components/AssignmentCard";
import type { CanvasAssignment } from "@/types/analysis";

interface Props {
  assignments: CanvasAssignment[];
  loading: boolean;
  onSelectAssignment: (a: CanvasAssignment) => void;
}

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

function startOfWeek(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

export function PlanView({ assignments, loading, onSelectAssignment }: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekStart = startOfWeek();

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  // Upcoming assignments sorted by due date
  const upcoming = [...assignments]
    .filter((a) => a.due_at && new Date(a.due_at) >= today)
    .sort((a, b) => new Date(a.due_at!).getTime() - new Date(b.due_at!).getTime())
    .slice(0, 8);

  return (
    <div className="flex flex-col gap-3 h-full overflow-hidden">
      {/* Week strip */}
      <div className="grid grid-cols-7 gap-1 shrink-0">
        {weekDays.map((d, i) => {
          const isToday = d.getTime() === today.getTime();
          const hasAssignment = assignments.some((a) => {
            if (!a.due_at) return false;
            const ad = new Date(a.due_at);
            ad.setHours(0, 0, 0, 0);
            return ad.getTime() === d.getTime();
          });
          return (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <span className={`text-[10px] font-medium ${isToday ? "text-primary" : "text-muted-foreground"}`}>
                {DAYS[i]}
              </span>
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold
                ${isToday ? "bg-primary text-primary-foreground" : "text-foreground"}`}>
                {d.getDate()}
              </div>
              {hasAssignment && (
                <div className={`h-1 w-1 rounded-full ${isToday ? "bg-primary-foreground" : "bg-primary"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Assignment list */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-2 min-h-0">
        {loading && (
          <div className="flex items-center justify-center flex-1">
            <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
          </div>
        )}
        {!loading && upcoming.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">No upcoming assignments this week</p>
          </div>
        )}
        {!loading && upcoming.map((a) => (
          <AssignmentCard
            key={`${a.courseId ?? ""}-${a.id}`}
            assignment={a}
            onClick={() => onSelectAssignment(a)}
          />
        ))}
      </div>
    </div>
  );
}
