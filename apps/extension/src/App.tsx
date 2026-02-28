// apps/extension/src/App.tsx
import { useState, useEffect } from "react";
import { BottomNav, type Tab } from "@/components/BottomNav";
import { TodayView } from "@/components/views/TodayView";
import { PlanView } from "@/components/views/PlanView";
import { MeView } from "@/components/views/MeView";
import { SetupView } from "@/components/views/SetupView";
import { useCanvasUrl } from "@/hooks/useCanvasUrl";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/api";
import type { MeResponse } from "shared";

const VIEW_TITLE: Record<Tab, string> = {
  today: "Today",
  plan: "Plan",
  me: "Profile",
};

type OnboardingStep = "account" | "canvas" | "done";

export default function App() {
  const [tab, setTab] = useState<Tab>("today");
  const { jwt, user, isLoading, logout, signup, login } = useAuth();
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>("account");
  const [meData, setMeData] = useState<MeResponse | null>(null);
  const [meCheckDone, setMeCheckDone] = useState(false);
  const { assignmentInfo } = useCanvasUrl();

  // Once we have a JWT, check if canvas is already configured
  useEffect(() => {
    if (!jwt) {
      setMeCheckDone(true);
      return;
    }
    setMeCheckDone(false);
    apiFetch<MeResponse>("/auth/me", {}, jwt)
      .then((me) => {
        setMeData(me);
        setOnboardingStep(me.hasCanvasConfig ? "done" : "canvas");
      })
      .catch(() => setOnboardingStep("canvas"))
      .finally(() => setMeCheckDone(true));
  }, [jwt]);

  if (isLoading || !meCheckDone) {
    return (
      <div className="w-[390px] h-[600px] bg-background flex items-center justify-center">
        <span className="text-muted-foreground text-sm">Loading…</span>
      </div>
    );
  }

  const isOnboarding = !jwt || onboardingStep !== "done";

  if (isOnboarding) {
    return (
      <div className="w-[390px] h-[600px] bg-background flex flex-col overflow-hidden">
        <SetupView
          jwt={jwt}
          onStep1Complete={() => setOnboardingStep("canvas")}
          onComplete={async () => {
            // Re-fetch /auth/me so canvasName/canvasAvatarUrl are populated
            // before the dashboard renders (server already stored them by now)
            if (jwt) {
              try {
                const me = await apiFetch<MeResponse>("/auth/me", {}, jwt);
                setMeData(me);
              } catch {
                // non-fatal — dashboard still works without the profile
              }
            }
            setOnboardingStep("done");
          }}
          onSignup={signup}
          onLogin={login}
        />
      </div>
    );
  }

  const displayName = meData?.canvasName ?? null;
  const initials = displayName
    ? displayName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : (user?.email?.slice(0, 2).toUpperCase() ?? "??");

  return (
    <div className="w-[390px] h-[600px] bg-background flex flex-col overflow-hidden">
      <header className="flex flex-col border-b border-border shrink-0 bg-card">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <span className="text-base tracking-tight font-display">
              <span className="text-foreground font-bold">Assign</span><span className="text-primary font-bold">mint.ai</span>
            </span>
            <span className="mx-2 text-border select-none">·</span>
            <span className="text-sm font-medium text-foreground">{VIEW_TITLE[tab]}</span>
          </div>
          <div className="h-7 w-7 rounded-full bg-primary/12 border border-primary/20 flex items-center justify-center overflow-hidden">
            {meData?.canvasAvatarUrl ? (
              <img
                src={meData.canvasAvatarUrl}
                alt={initials}
                className="h-full w-full object-cover"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
            ) : (
              <span className="text-[10px] font-bold text-primary">{initials}</span>
            )}
          </div>
        </div>

        {assignmentInfo && (
          <div className="px-4 py-2 bg-primary/10 border-t border-primary/20 flex items-center gap-2 text-xs text-primary-foreground">
            <span className="flex-1 text-primary font-medium">Canvas Assignment Detected</span>
            <div className="flex items-center gap-2 opacity-80 text-primary">
              <span className="bg-primary/20 px-1.5 py-0.5 rounded">C: {assignmentInfo.courseId}</span>
              <span className="bg-primary/20 px-1.5 py-0.5 rounded">A: {assignmentInfo.assignmentId}</span>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 min-h-0 p-4 overflow-hidden">
        {tab === "today" && <TodayView displayName={displayName} />}
        {tab === "plan" && <PlanView />}
        {tab === "me" && <MeView user={user} meData={meData} onLogout={logout} />}
      </main>

      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
