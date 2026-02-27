import { Clock, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { assignments, stats, user } from "@/data/mock";
import type { Status } from "@/types";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function statusVariant(status: Status) {
  if (status === "Urgent") return "secondary" as const;
  if (status === "In Progress") return "default" as const;
  if (status === "Done") return "accent" as const;
  return "muted" as const;
}

export function TodayView() {
  const firstName = user.name.split(" ")[0];
  const [focus, ...rest] = assignments;
  const more = rest.slice(0, 2);

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Greeting */}
      <div>
        <h2 className="text-[15px] font-semibold text-foreground tracking-tight">
          {greeting()}, {firstName}
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {stats.dueToday} assignment{stats.dueToday !== 1 ? "s" : ""} due today
        </p>
      </div>

      {/* Focus card — hero item, left accent border */}
      <Card className="border-l-[3px] border-l-primary shadow-none">
        <div className="p-3">
          <div className="flex items-start justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Focus
            </span>
            <Badge variant={statusVariant(focus.status)}>{focus.status}</Badge>
          </div>
          <p className="font-semibold text-sm text-foreground leading-snug">{focus.title}</p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <Clock className="h-3 w-3 text-muted-foreground shrink-0" />
            <span className="text-xs text-muted-foreground">
              {focus.course} · {focus.dueLabel}
            </span>
          </div>
        </div>
      </Card>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Pending", value: stats.pending },
          { label: "Due Today", value: stats.dueToday },
          { label: "Done", value: stats.doneThisWeek },
        ].map((s) => (
          <Card key={s.label} className="shadow-none">
            <div className="py-2.5 px-2 text-center">
              <p className="text-xl font-bold text-primary leading-none">{s.value}</p>
              <p className="text-[10px] text-muted-foreground mt-1 leading-none">{s.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* More assignments */}
      <Card className="shadow-none flex-1">
        <div className="p-3 flex flex-col gap-0">
          {more.map((item, i) => (
            <div key={item.id}>
              {i > 0 && <div className="h-px bg-border my-2.5" />}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.course} · {item.dueLabel}
                  </p>
                </div>
                <Badge variant={statusVariant(item.status)} className="shrink-0 mt-0.5">
                  {item.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* CTA */}
      <Button variant="secondary" className="w-full gap-2 h-9">
        <Plus className="h-3.5 w-3.5" />
        Add Assignment
      </Button>
    </div>
  );
}
