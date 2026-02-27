import { CalendarDays, Home, User } from "lucide-react";
import { cn } from "@/lib/utils";

export type Tab = "today" | "plan" | "me";

interface BottomNavProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const TABS = [
  { id: "today" as Tab, label: "Today", Icon: Home },
  { id: "plan" as Tab, label: "Plan", Icon: CalendarDays },
  { id: "me" as Tab, label: "Me", Icon: User },
];

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="h-16 border-t border-border bg-card flex items-stretch shrink-0">
      {TABS.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-colors duration-150",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {/* Mint top indicator */}
            <span
              className={cn(
                "absolute top-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-200",
                isActive ? "w-8 bg-primary" : "w-0 bg-transparent",
              )}
            />
            <Icon className="h-[18px] w-[18px]" strokeWidth={isActive ? 2.2 : 1.8} />
            <span className={cn("text-[10px] font-medium", isActive && "font-semibold")}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
