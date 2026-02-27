import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { assignments } from "@/data/mock";
import { cn } from "@/lib/utils";
import type { Status } from "@/types";

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function getWeekDays() {
  const today = new Date();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - today.getDay());

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    return {
      label: DAY_LABELS[i],
      date: d.getDate(),
      isToday: d.toDateString() === today.toDateString(),
    };
  });
}

function statusVariant(status: Status) {
  if (status === "Urgent") return "secondary" as const;
  if (status === "In Progress") return "default" as const;
  if (status === "Done") return "accent" as const;
  return "muted" as const;
}

export function PlanView() {
  const weekDays = getWeekDays();

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Week strip */}
      <div className="flex gap-1">
        {weekDays.map((day, i) => (
          <button
            key={i}
            className={cn(
              "flex-1 flex flex-col items-center py-2 rounded-lg text-xs font-medium transition-colors",
              day.isToday
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            <span className="text-[10px]">{day.label}</span>
            <span className="font-bold mt-0.5 text-sm">{day.date}</span>
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="flex-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Upcoming
        </p>
        <div className="flex flex-col">
          {assignments.map((item, i) => (
            <div key={item.id} className="flex gap-3">
              {/* Timeline gutter */}
              <div className="flex flex-col items-center">
                <div className="h-3 w-3 rounded-full bg-primary mt-1 shrink-0 ring-2 ring-primary/20" />
                {i < assignments.length - 1 && (
                  <div className="flex-1 w-px bg-border mt-1" />
                )}
              </div>

              {/* Content */}
              <div className={cn("flex-1 min-w-0", i < assignments.length - 1 && "pb-4")}>
                <p className="text-[11px] text-muted-foreground">{item.dueLabel}</p>
                <div className="flex items-start justify-between mt-0.5 gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground leading-snug truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.course}</p>
                  </div>
                  <Badge variant={statusVariant(item.status)} className="shrink-0 mt-0.5">
                    {item.status}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add task */}
      <Button variant="outline" className="w-full gap-2 h-9 mt-auto">
        <Plus className="h-3.5 w-3.5" />
        Add Mock Task
      </Button>
    </div>
  );
}
