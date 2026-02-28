import { Loader2, RefreshCw } from "lucide-react";
import { AssignmentCard } from "@/components/AssignmentCard";
import type { CanvasAssignment } from "@/types/analysis";

interface Props {
  displayName?: string | null;
  assignments: CanvasAssignment[];
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
  analyzedKeys: Set<string>;
  onSelectAssignment: (a: CanvasAssignment) => void;
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function isToday(dueAt: string | null): boolean {
  if (!dueAt) return false;
  const d = new Date(dueAt);
  const t = new Date();
  return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
}

export function TodayView({ displayName, assignments, loading, error, onRetry, analyzedKeys, onSelectAssignment }: Props) {
  const firstName = displayName ? displayName.split(" ")[0] : null;
  const dueToday = assignments.filter((a) => isToday(a.due_at)).length;
  const upcoming = [...assignments]
    .filter((a) => a.due_at && new Date(a.due_at) >= new Date())
    .sort((a, b) => new Date(a.due_at!).getTime() - new Date(b.due_at!).getTime())
    .slice(0, 6);

  return (
    <div className="flex flex-col gap-3 h-full overflow-hidden">
      <div className="shrink-0">
        <h2 className="text-[15px] font-semibold text-foreground tracking-tight">
          {greeting()}{firstName ? `, ${firstName}` : ""}
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {loading ? "Loading assignments…" : `${dueToday} assignment${dueToday !== 1 ? "s" : ""} due today`}
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 flex items-start justify-between gap-2">
          <p className="text-xs text-destructive leading-relaxed">{error}</p>
          {onRetry && (
            <button onClick={onRetry} className="shrink-0 text-destructive hover:text-destructive/80">
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}

      {!loading && assignments.length > 0 && (
        <div className="grid grid-cols-3 gap-2 shrink-0">
          {[
            { label: "Due today", value: dueToday },
            { label: "Upcoming",  value: upcoming.length },
            { label: "All",       value: assignments.length },
          ].map((s) => (
            <div key={s.label} className="bg-muted/40 rounded-lg py-2 px-2 text-center">
              <p className="text-lg font-bold text-primary leading-none">{s.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-none">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto flex flex-col gap-2 min-h-0">
        {loading && (
          <div className="flex items-center justify-center flex-1">
            <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
          </div>
        )}
        {!loading && upcoming.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">No upcoming assignments</p>
          </div>
        )}
        {!loading && upcoming.map((a) => {
          const key = `${a.courseId ?? ""}-${a.id}`;
          return (
            <AssignmentCard
              key={key}
              assignment={a}
              hasAnalysis={analyzedKeys.has(key)}
              onClick={() => onSelectAssignment(a)}
            />
          );
        })}
      </div>
    </div>
  );
}
