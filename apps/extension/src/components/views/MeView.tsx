// apps/extension/src/components/views/MeView.tsx
import { useState } from "react";
import { GraduationCap, LogOut, Pencil } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import type { MeResponse } from "shared";

const PREFS = [
  { key: "notifications" as const, label: "Notifications", disabled: false },
  { key: "digest" as const, label: "Daily digest", disabled: false },
  { key: "darkMode" as const, label: "Dark mode", disabled: true, soon: true },
];

interface Props {
  user: { id: string; email: string } | null;
  meData: MeResponse | null;
  onLogout: () => void;
}

export function MeView({ user, meData, onLogout }: Props) {
  const [prefs, setPrefs] = useState({
    notifications: true,
    digest: false,
    darkMode: false,
  });

  const toggle = (key: keyof typeof prefs) =>
    setPrefs((p) => ({ ...p, [key]: !p[key] }));

  const displayName = meData?.canvasName ?? null;
  const initials = displayName
    ? displayName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : (user?.email?.slice(0, 2).toUpperCase() ?? "??");

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center gap-3.5">
        <Avatar initials={initials} src={meData?.canvasAvatarUrl} size="lg" />
        <div className="flex-1 min-w-0">
          {displayName && (
            <p className="font-semibold text-foreground text-sm leading-tight">{displayName}</p>
          )}
          <p className={displayName ? "text-xs text-muted-foreground truncate mt-0.5" : "font-semibold text-foreground text-sm"}>
            {user?.email ?? "—"}
          </p>
          {meData?.canvasBaseUrl && (
            <div className="flex items-center gap-1 mt-0.5">
              <GraduationCap className="h-3 w-3 text-muted-foreground shrink-0" />
              <p className="text-xs text-muted-foreground truncate">{meData.canvasBaseUrl}</p>
            </div>
          )}
        </div>
      </div>

      <Separator />

      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
          Preferences
        </p>
        <div>
          {PREFS.map((pref, i, arr) => (
            <div key={pref.key}>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2">
                  <span className={pref.disabled ? "text-sm text-muted-foreground" : "text-sm text-foreground"}>
                    {pref.label}
                  </span>
                  {pref.soon && (
                    <span className="text-[9px] font-semibold uppercase tracking-wide bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">
                      soon
                    </span>
                  )}
                </div>
                <Switch
                  checked={prefs[pref.key]}
                  onCheckedChange={() => !pref.disabled && toggle(pref.key)}
                  disabled={pref.disabled}
                />
              </div>
              {i < arr.length - 1 && <div className="h-px bg-border" />}
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="flex gap-2 mt-auto">
        <Button variant="outline" size="sm" className="flex-1 gap-1.5">
          <Pencil className="h-3.5 w-3.5" />
          Edit Profile
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/8"
          onClick={onLogout}
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
