import { Leaf, CalendarDays, User } from "lucide-react";
import { cn } from "@/lib/utils";

export type Tab = "today" | "plan" | "me";

interface BottomNavProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const TABS = [
  { id: "today" as Tab, label: "Today", Icon: Leaf },
  { id: "plan" as Tab, label: "Plan", Icon: CalendarDays },
  { id: "me" as Tab, label: "Me", Icon: User },
];

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="h-16 border-t border-border bg-card flex items-center px-2 gap-1 shrink-0">
      {TABS.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 h-11 rounded-xl transition-all duration-200",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/60",
            )}
          >
            <Icon
              className="h-[18px] w-[18px]"
              strokeWidth={isActive ? 2 : 1.6}
            />
            <span
              className={cn(
                "text-[10px] tracking-wide",
                isActive ? "font-semibold" : "font-medium",
              )}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
