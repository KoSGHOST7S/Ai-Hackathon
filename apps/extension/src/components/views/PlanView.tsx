import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { AssignmentCard } from "@/components/AssignmentCard";
import type { CanvasAssignment } from "@/types/analysis";

interface Props {
  assignments: CanvasAssignment[];
  loading: boolean;
  analyzedKeys: Set<string>;
  onSelectAssignment: (a: CanvasAssignment) => void;
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function formatDayHeader(date: Date, today: Date): string {
  if (isSameDay(date, today)) return "Today";
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (isSameDay(date, tomorrow)) return "Tomorrow";
  return `${DAY_LABELS[date.getDay()]} ${MONTH_NAMES[date.getMonth()]} ${date.getDate()}`;
}

export function PlanView({ assignments, loading, analyzedKeys, onSelectAssignment }: Props) {
  const [weekOffset, setWeekOffset] = useState(0);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const currentWeekStart = useMemo(() => {
    const base = startOfWeek(today);
    base.setDate(base.getDate() + weekOffset * 7);
    return base;
  }, [today, weekOffset]);

  const weekDays = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => {
      const d = new Date(currentWeekStart);
      d.setDate(currentWeekStart.getDate() + i);
      return d;
    }), [currentWeekStart]);

  const assignmentsByDay = useMemo(() => {
    const map = new Map<number, CanvasAssignment[]>();
    for (const day of weekDays) {
      map.set(day.getTime(), []);
    }
    for (const a of assignments) {
      if (!a.due_at) continue;
      const d = new Date(a.due_at);
      d.setHours(0, 0, 0, 0);
      const key = d.getTime();
      if (map.has(key)) {
        map.get(key)!.push(a);
      }
    }
    return map;
  }, [assignments, weekDays]);

  const weekLabel = `${MONTH_NAMES[weekDays[0].getMonth()]} ${weekDays[0].getDate()} – ${MONTH_NAMES[weekDays[6].getMonth()]} ${weekDays[6].getDate()}`;

  return (
    <div className="flex flex-col gap-2 h-full overflow-hidden">
      <div className="flex items-center justify-between shrink-0">
        <button onClick={() => setWeekOffset((w) => w - 1)} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="text-center">
          <p className="text-xs font-semibold text-foreground">{weekLabel}</p>
          {weekOffset !== 0 && (
            <button onClick={() => setWeekOffset(0)} className="text-[10px] text-primary hover:underline">
              Back to this week
            </button>
          )}
        </div>
        <button onClick={() => setWeekOffset((w) => w + 1)} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 shrink-0">
        {weekDays.map((d, i) => {
          const isToday = isSameDay(d, today);
          const dayAssignments = assignmentsByDay.get(d.getTime()) ?? [];
          const count = dayAssignments.length;
          return (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <span className={`text-[10px] font-medium ${isToday ? "text-primary" : "text-muted-foreground"}`}>
                {DAY_LABELS[i]}
              </span>
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors
                ${isToday ? "bg-primary text-primary-foreground" : count > 0 ? "bg-muted text-foreground" : "text-muted-foreground"}`}>
                {d.getDate()}
              </div>
              {count > 0 && (
                <div className="flex gap-0.5">
                  {Array.from({ length: Math.min(count, 3) }, (_, j) => (
                    <div key={j} className={`h-1 w-1 rounded-full ${isToday ? "bg-primary-foreground" : "bg-primary"}`} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col gap-3 min-h-0">
        {loading && (
          <div className="flex items-center justify-center flex-1">
            <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
          </div>
        )}
        {!loading && weekDays.map((day) => {
          const dayAssignments = assignmentsByDay.get(day.getTime()) ?? [];
          if (dayAssignments.length === 0) return null;
          return (
            <div key={day.getTime()}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                {formatDayHeader(day, today)}
                <span className="ml-1.5 font-normal normal-case tracking-normal">
                  · {dayAssignments.length} assignment{dayAssignments.length !== 1 ? "s" : ""}
                </span>
              </p>
              <div className="flex flex-col gap-1.5">
                {dayAssignments.map((a) => {
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
        })}
        {!loading && [...assignmentsByDay.values()].every((arr) => arr.length === 0) && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">No assignments this week</p>
          </div>
        )}
      </div>
    </div>
  );
}
