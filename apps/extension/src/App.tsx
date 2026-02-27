import { useState, useEffect } from "react";
import { BottomNav, type Tab } from "@/components/BottomNav";
import { TodayView } from "@/components/views/TodayView";
import { PlanView } from "@/components/views/PlanView";
import { MeView } from "@/components/views/MeView";
import { SetupView } from "@/components/views/SetupView";
import { useCanvasUrl } from "@/hooks/useCanvasUrl";

const VIEW_TITLE: Record<Tab, string> = {
  today: "Today",
  plan: "Plan",
  me: "Profile",
};

export default function App() {
  const [tab, setTab] = useState<Tab>("today");
  const [isSetupComplete, setIsSetupComplete] = useState<boolean>(true); // default true to avoid flicker, effect checks it

  const { assignmentInfo } = useCanvasUrl();

  useEffect(() => {
    const baseUrl = localStorage.getItem("canvasBaseUrl");
    if (!baseUrl) {
      setIsSetupComplete(false);
    }
  }, []);

  if (!isSetupComplete) {
    return (
      <div className="w-[390px] h-[600px] bg-background flex flex-col overflow-hidden">
        <SetupView onComplete={() => setIsSetupComplete(true)} />
      </div>
    );
  }

  return (
    <div className="w-[390px] h-[600px] bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex flex-col border-b border-border shrink-0 bg-card">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <span className="text-base font-bold text-primary tracking-tight">assignmint</span>
            <span className="mx-2 text-border select-none">·</span>
            <span className="text-sm font-medium text-foreground">{VIEW_TITLE[tab]}</span>
          </div>
          {/* Mini avatar in header */}
          <div className="h-7 w-7 rounded-full bg-primary/12 border border-primary/20 flex items-center justify-center">
            <span className="text-[10px] font-bold text-primary">JM</span>
          </div>
        </div>
        
        {/* Canvas Assignment Banner */}
        {assignmentInfo && (
          <div className="px-4 py-2 bg-primary/10 border-t border-primary/20 flex items-center gap-2 text-xs text-primary-foreground">
            <span className="flex-1 text-primary font-medium">
              Canvas Assignment Detected
            </span>
            <div className="flex items-center gap-2 opacity-80 text-primary">
              <span className="bg-primary/20 px-1.5 py-0.5 rounded">C: {assignmentInfo.courseId}</span>
              <span className="bg-primary/20 px-1.5 py-0.5 rounded">A: {assignmentInfo.assignmentId}</span>
            </div>
          </div>
        )}
      </header>

      {/* Content — fixed height, no scroll */}
      <main className="flex-1 min-h-0 p-4 overflow-hidden">
        {tab === "today" && <TodayView />}
        {tab === "plan" && <PlanView />}
        {tab === "me" && <MeView />}
      </main>

      {/* Persistent bottom nav */}
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
