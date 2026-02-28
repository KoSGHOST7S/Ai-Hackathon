// apps/extension/src/App.tsx
import { useState, useEffect, useCallback, useRef } from "react";
import { BottomNav, type Tab } from "@/components/BottomNav";
import { TodayView } from "@/components/views/TodayView";
import { PlanView } from "@/components/views/PlanView";
import { MeView } from "@/components/views/MeView";
import { EditCanvasView } from "@/components/views/EditCanvasView";
import { SetupView } from "@/components/views/SetupView";
import { AssignmentDetailView } from "@/components/views/AssignmentDetailView";
import { useCanvasUrl } from "@/hooks/useCanvasUrl";
import { useAuth } from "@/hooks/useAuth";
import { useCanvasProfile } from "@/hooks/useCanvasProfile";
import { useAssignments } from "@/hooks/useAssignments";
import { apiFetch, fetchAnalysisResults } from "@/lib/api";
import { loadUiSession, saveUiSession, type AssignmentDetailSession } from "@/lib/uiSession";
import { storageGet, storageRemove } from "@/lib/storage";
import type { MeResponse } from "shared";
import type { CanvasAssignment } from "@/types/analysis";

const VIEW_TITLE: Record<Tab, string> = {
  today: "Today",
  plan: "Plan",
  me: "Profile",
};

type OnboardingStep = "account" | "canvas" | "done";

export default function App() {
  const [tab, setTab] = useState<Tab>("today");
  const [canvasEdit, setCanvasEdit] = useState(false);
  const { jwt, user, isLoading, logout, signup, login } = useAuth();
  const { canvasName, canvasAvatarUrl, setProfile, clearProfile } = useCanvasProfile();
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>("account");
  const [meData, setMeData] = useState<MeResponse | null>(null);
  const [meCheckDone, setMeCheckDone] = useState(false);
  const { assignmentInfo } = useCanvasUrl();
  const [selectedAssignment, setSelectedAssignment] = useState<CanvasAssignment | null>(null);
  const [analyzedKeys, setAnalyzedKeys] = useState<Set<string>>(new Set());
  const [detailByAssignment, setDetailByAssignment] = useState<Record<string, AssignmentDetailSession>>({});
  const [sessionHydrated, setSessionHydrated] = useState(false);
  const [restoreSelectedRef, setRestoreSelectedRef] = useState<{ courseId: string; assignmentId: string } | null>(null);
  const [pendingTarget, setPendingTarget] = useState<{ courseId: string; assignmentId: string } | null>(null);
  const restoredSelectionRef = useRef(false);
  const [pendingAnalyzeKey, setPendingAnalyzeKey] = useState<string | null>(null);
  const { assignments, loading: assignmentsLoading, error: assignmentsError, refetch: refetchAssignments } = useAssignments(jwt);

  const assignmentKey = useCallback((a: CanvasAssignment) => `${a.courseId ?? ""}-${a.id}`, []);

  const applyMe = useCallback((me: MeResponse) => {
    setMeData(me);
    setProfile({ canvasName: me.canvasName, canvasAvatarUrl: me.canvasAvatarUrl });
  }, [setProfile]);

  // Once we have a JWT, check if canvas is already configured
  useEffect(() => {
    if (!jwt) {
      setMeCheckDone(true);
      return;
    }
    setMeCheckDone(false);
    apiFetch<MeResponse>("/auth/me", {}, jwt)
      .then((me) => {
        applyMe(me);
        setOnboardingStep(me.hasCanvasConfig ? "done" : "canvas");
      })
      .catch(() => setOnboardingStep("canvas"))
      .finally(() => setMeCheckDone(true));
  }, [jwt, applyMe]);

  // Auto-navigate to detected Canvas assignment (from active tab URL or content-script deep-link)
  useEffect(() => {
    const target = pendingTarget ?? assignmentInfo;
    if (!target || assignments.length === 0) return;
    const match = assignments.find(
      (a) => String(a.id) === target.assignmentId &&
             String(a.courseId ?? "") === target.courseId
    );
    if (match) setSelectedAssignment(match);
    if (pendingTarget) setPendingTarget(null);
  }, [assignmentInfo, pendingTarget, assignments]);

  useEffect(() => {
    loadUiSession()
      .then((session) => {
        setTab(session.tab);
        setDetailByAssignment(session.detailByAssignment);
        setRestoreSelectedRef(session.selectedAssignment);
      })
      .finally(() => setSessionHydrated(true));
  }, []);

  // Read and immediately clear any pending deep-link target from the content script
  useEffect(() => {
    storageGet("pendingAssignment").then((raw) => {
      storageRemove("pendingAssignment");
      if (!raw || typeof raw !== "string") return;
      try {
        const parsed = JSON.parse(raw) as { courseId?: string; assignmentId?: string };
        if (parsed.courseId && parsed.assignmentId) {
          setPendingTarget({ courseId: String(parsed.courseId), assignmentId: String(parsed.assignmentId) });
        }
      } catch { /* malformed — ignore */ }
    });
  }, []);

  // Check if popup was opened via the "Open in Assignmint" button on a Canvas page
  useEffect(() => {
    if (typeof chrome === "undefined" || !chrome.storage) return;
    chrome.storage.local.get("pendingAnalyze", (data) => {
      const pending = data.pendingAnalyze as { courseId: string; assignmentId: string } | undefined;
      if (pending) {
        setPendingAnalyzeKey(`${pending.courseId}-${pending.assignmentId}`);
        chrome.storage.local.remove("pendingAnalyze");
      }
    });
  }, []);

  useEffect(() => {
    if (!sessionHydrated || assignments.length === 0 || restoredSelectionRef.current) return;
    restoredSelectionRef.current = true;
    if (!restoreSelectedRef) return;
    const restored = assignments.find((a) =>
      String(a.id) === restoreSelectedRef.assignmentId &&
      String(a.courseId ?? "") === restoreSelectedRef.courseId
    );
    if (restored) setSelectedAssignment(restored);
  }, [assignments, restoreSelectedRef, sessionHydrated]);

  useEffect(() => {
    if (!sessionHydrated) return;
    const payload = {
      tab,
      selectedAssignment: selectedAssignment
        ? { courseId: String(selectedAssignment.courseId ?? ""), assignmentId: String(selectedAssignment.id) }
        : null,
      detailByAssignment,
    };
    void saveUiSession(payload);
  }, [tab, selectedAssignment, detailByAssignment, sessionHydrated]);

  useEffect(() => {
    if (!jwt) return;
    fetchAnalysisResults(jwt)
      .then((results) => {
        setAnalyzedKeys(new Set(results.map((r) => `${r.courseId}-${r.assignmentId}`)));
      })
      .catch(() => { /* non-fatal */ });
  }, [jwt]);

  const handleAnalysisDone = (courseId: string, assignmentId: string) => {
    setAnalyzedKeys((prev) => new Set([...prev, `${courseId}-${assignmentId}`]));
  };

  if (isLoading || !meCheckDone || !sessionHydrated) {
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
            if (jwt) {
              try {
                const me = await apiFetch<MeResponse>("/auth/me", {}, jwt);
                applyMe(me);
              } catch {
                // non-fatal — dashboard still works without the profile
              }
            }
            setOnboardingStep("done");
            refetchAssignments();
          }}
          onSignup={signup}
          onLogin={login}
        />
      </div>
    );
  }

  // Use cached profile values — available immediately from storage, no API wait
  const displayName = canvasName ?? meData?.canvasName ?? null;
  const avatarUrl = canvasAvatarUrl ?? meData?.canvasAvatarUrl ?? null;
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
          </div>
          <div className="h-7 w-7 rounded-full bg-primary/12 border border-primary/20 flex items-center justify-center overflow-hidden">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={initials}
                className="h-full w-full object-cover"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
            ) : (
              <span className="text-[10px] font-bold text-primary">{initials}</span>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 min-h-0 p-4 overflow-hidden">
        {selectedAssignment ? (
          <AssignmentDetailView
            key={`${selectedAssignment.courseId ?? ""}-${selectedAssignment.id}`}
            assignment={selectedAssignment}
            courseId={selectedAssignment.courseId ?? String(selectedAssignment.id)}
            assignmentId={String(selectedAssignment.id)}
            jwt={jwt!}
            onBack={() => setSelectedAssignment(null)}
            onAnalysisDone={handleAnalysisDone}
            initialSession={detailByAssignment[assignmentKey(selectedAssignment)]}
            onSessionChange={(session) => {
              const key = assignmentKey(selectedAssignment);
              setDetailByAssignment((prev) => ({ ...prev, [key]: session }));
            }}
            autoAnalyze={pendingAnalyzeKey === assignmentKey(selectedAssignment)}
          />
        ) : (
          <>
            {tab === "today" && (
              <TodayView
                displayName={displayName}
                assignments={assignments}
                loading={assignmentsLoading}
                error={assignmentsError}
                onRetry={refetchAssignments}
                analyzedKeys={analyzedKeys}
                onSelectAssignment={setSelectedAssignment}
              />
            )}
            {tab === "plan" && (
              <PlanView
                assignments={assignments}
                loading={assignmentsLoading}
                analyzedKeys={analyzedKeys}
                onSelectAssignment={setSelectedAssignment}
              />
            )}
            {tab === "me" && (
              canvasEdit ? (
                <EditCanvasView
                  jwt={jwt!}
                  currentBaseUrl={meData?.canvasBaseUrl ?? null}
                  onBack={() => setCanvasEdit(false)}
                  onSaved={async () => {
                    setCanvasEdit(false);
                    if (jwt) {
                      try {
                        const me = await apiFetch<MeResponse>("/auth/me", {}, jwt);
                        applyMe(me);
                      } catch { /* non-fatal */ }
                    }
                    refetchAssignments();
                  }}
                />
              ) : (
                <MeView
                  user={user}
                  meData={meData}
                  cachedAvatarUrl={avatarUrl}
                  assignmentCount={assignments.length}
                  analyzedCount={analyzedKeys.size}
                  courseCount={new Set(assignments.map((a) => a.courseId).filter(Boolean)).size}
                  onLogout={async () => {
                    await clearProfile();
                    logout();
                  }}
                  onEditCanvas={() => setCanvasEdit(true)}
                />
              )
            )}
          </>
        )}
      </main>

      <BottomNav active={tab} onChange={(t) => { setCanvasEdit(false); setTab(t); }} />
    </div>
  );
}
