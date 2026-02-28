import { GraduationCap, LogOut, BookOpen, Sparkles, Library, Pencil } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { MeResponse } from "shared";

interface Props {
  user: { id: string; email: string } | null;
  meData: MeResponse | null;
  cachedAvatarUrl?: string | null;
  assignmentCount: number;
  analyzedCount: number;
  courseCount: number;
  onLogout: () => void;
  onEditCanvas: () => void;
}

export function MeView({ user, meData, cachedAvatarUrl, assignmentCount, analyzedCount, courseCount, onLogout, onEditCanvas }: Props) {
  const displayName = meData?.canvasName ?? null;
  const initials = displayName
    ? displayName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : (user?.email?.slice(0, 2).toUpperCase() ?? "??");

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto">
      {/* Profile header */}
      <div className="flex items-center gap-3.5">
        <Avatar initials={initials} src={cachedAvatarUrl ?? meData?.canvasAvatarUrl} size="lg" />
        <div className="flex-1 min-w-0">
          {displayName && (
            <p className="font-semibold text-foreground text-sm leading-tight">{displayName}</p>
          )}
          <p className={displayName ? "text-xs text-muted-foreground mt-0.5" : "font-semibold text-foreground text-sm"}>
            {user?.email ?? "—"}
          </p>
        </div>
      </div>

      {/* Canvas connection */}
      <Card className="shadow-none">
        <div className="p-3 flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <GraduationCap className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground">Canvas LMS</p>
            {meData?.canvasBaseUrl ? (
              <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{meData.canvasBaseUrl}</p>
            ) : (
              <p className="text-[10px] text-muted-foreground mt-0.5">Not connected</p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={onEditCanvas}
              className="gap-1.5 text-xs shrink-0"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Stats</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: BookOpen, label: "Assignments", value: assignmentCount },
            { icon: Sparkles, label: "Analyzed", value: analyzedCount },
            { icon: Library, label: "Courses", value: courseCount },
          ].map((stat) => (
            <Card key={stat.label} className="shadow-none">
              <div className="p-2.5 text-center">
                <stat.icon className="h-3.5 w-3.5 text-primary mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground leading-none">{stat.value}</p>
                <p className="text-[9px] text-muted-foreground mt-1 leading-none">{stat.label}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* About */}
      <Card className="shadow-none">
        <div className="p-3 flex flex-col gap-2">
          <p className="text-xs font-medium text-foreground">Assignmint.ai</p>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            AI-powered assignment analysis for Canvas LMS. Generates rubrics, milestones, and study plans using IBM watsonx Granite.
          </p>
        </div>
      </Card>

      {/* Sign out */}
      <div className="mt-auto">
        <Button
          variant="outline"
          className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/5"
          onClick={onLogout}
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
