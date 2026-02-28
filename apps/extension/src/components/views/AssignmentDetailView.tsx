import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Sparkles, CheckCircle2, Circle, ChevronRight, Loader2, MessageSquare, ClipboardCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAnalysis } from "@/hooks/useAnalysis";
import { useSubPage, type SubPage } from "@/hooks/useSubPage";
import { DescriptionPage } from "./DescriptionPage";
import { CriterionPage } from "./CriterionPage";
import { MilestonePage } from "./MilestonePage";
import { ChatPage } from "./ChatPage";
import { SubmitPage } from "./SubmitPage";
import { ReviewPage } from "./ReviewPage";
import { useReview } from "@/hooks/useReview";
import { storageGet } from "@/lib/storage";
import type { CanvasAssignment } from "@/types/analysis";
import type { AssignmentDetailSession } from "@/lib/uiSession";

const STEPS = [
  "Extracting explicit requirements…",
  "Generating rubric…",
  "Validating rubric…",
  "Building requirement-based milestones…",
  "Validating milestone coverage…",
];

interface Props {
  assignment: CanvasAssignment;
  courseId: string;
  assignmentId: string;
  jwt: string;
  onBack: () => void;
  onAnalysisDone?: (courseId: string, assignmentId: string) => void;
  initialSession?: AssignmentDetailSession;
  onSessionChange?: (session: AssignmentDetailSession) => void;
  autoAnalyze?: boolean;
}

export function AssignmentDetailView({
  assignment,
  courseId,
  assignmentId,
  jwt,
  onBack,
  onAnalysisDone,
  initialSession,
  onSessionChange,
  autoAnalyze,
}: Props) {
  const { result, status, error, step, loadChecked, analyze, loadExisting, restoreInProgress, resolveCompletedAnalysis } = useAnalysis(jwt);
  const { result: reviewResult, status: reviewStatus, error: reviewError, step: reviewStep, submitForReview, loadExisting: loadExistingReview, reset: reviewReset } = useReview(jwt);
  const initialSubPage = initialSession?.subPage ?? null;
  const { subPage, setSubPage, openDescription, openCriterion, openMilestone, openChat, openSubmit, openReview, close } = useSubPage(initialSubPage);
  const [checkedMilestones, setCheckedMilestones] = useState<Set<number>>(
    new Set(initialSession?.checkedMilestones ?? [])
  );
  const hydratedRef = useRef(false);
  const shouldAutoOpenReviewRef = useRef(false);
  const wasAnalyzingRef = useRef(initialSession?.wasAnalyzing ?? false);
  const initialAnalyzingStepRef = useRef(initialSession?.analyzingStep ?? 0);
  const selectedMilestoneIndex = subPage?.type === "milestone" ? subPage.index : -1;
  const totalMilestones = result?.milestones.milestones.length ?? 0;

  const completion = useMemo(() => ({
    done: checkedMilestones.size,
    total: totalMilestones,
  }), [checkedMilestones.size, totalMilestones]);

  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    if (initialSession?.subPage) setSubPage(initialSession.subPage);
    if (initialSession?.checkedMilestones) {
      setCheckedMilestones(new Set(initialSession.checkedMilestones));
    }
  }, [initialSession, setSubPage]);

  useEffect(() => {
    if (wasAnalyzingRef.current) {
      restoreInProgress(initialAnalyzingStepRef.current);
      return;
    }
    loadExisting(courseId, assignmentId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, assignmentId]);

  useEffect(() => {
    if (!loadChecked || status !== "idle") return;
    if (autoAnalyze) {
      analyze(courseId, assignmentId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoAnalyze, loadChecked, status]);

  useEffect(() => {
    if (!wasAnalyzingRef.current || status !== "loading") return;
    let cancelled = false;

    const checkJobState = async () => {
      const rawJob = await storageGet("analyzing_assignment");
      if (cancelled) return;

      let job: { courseId?: unknown; assignmentId?: unknown } | null = null;
      if (typeof rawJob === "string") {
        try {
          job = JSON.parse(rawJob) as { courseId?: unknown; assignmentId?: unknown };
        } catch {
          job = null;
        }
      } else if (rawJob && typeof rawJob === "object") {
        job = rawJob as { courseId?: unknown; assignmentId?: unknown };
      }

      const stillRunningForThisAssignment =
        !!job &&
        String(job.courseId ?? "") === String(courseId) &&
        String(job.assignmentId ?? "") === String(assignmentId);

      if (stillRunningForThisAssignment) return;
      wasAnalyzingRef.current = false;
      await resolveCompletedAnalysis(courseId, assignmentId);
    };

    void checkJobState();
    const timer = window.setInterval(() => { void checkJobState(); }, 1000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, courseId, assignmentId]);

  useEffect(() => {
    if (status === "done" && result) {
      onAnalysisDone?.(courseId, assignmentId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, result]);

  useEffect(() => {
    loadExistingReview(courseId, assignmentId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, assignmentId]);

  useEffect(() => {
    if (reviewStatus === "done" && shouldAutoOpenReviewRef.current) {
      shouldAutoOpenReviewRef.current = false;
      openReview();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewStatus]);

  const toggleMilestone = (i: number) =>
    setCheckedMilestones((s) => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; });

  useEffect(() => {
    onSessionChange?.({
      subPage: subPage as SubPage | null,
      checkedMilestones: Array.from(checkedMilestones).sort((a, b) => a - b),
      wasAnalyzing: status === "loading",
      analyzingStep: status === "loading" ? step : 0,
    });
  }, [subPage, checkedMilestones, status, step, onSessionChange]);

  // Sub-page routing
  if (subPage) {
    if (subPage.type === "description") {
      return <DescriptionPage assignment={assignment} onBack={close} />;
    }
    if (subPage.type === "criterion" && result) {
      const c = result.rubric.criteria[subPage.index];
      if (c) return <CriterionPage criterion={c} onBack={close} />;
    }
    if (subPage.type === "milestone" && result) {
      const m = result.milestones.milestones[subPage.index];
      if (m) return (
        <MilestonePage
          key={subPage.index}
          milestone={m}
          isChecked={checkedMilestones.has(subPage.index)}
          onToggle={() => toggleMilestone(subPage.index)}
          onPrev={subPage.index > 0 ? () => openMilestone(subPage.index - 1) : undefined}
          onNext={subPage.index < result.milestones.milestones.length - 1 ? () => openMilestone(subPage.index + 1) : undefined}
          hasPrev={subPage.index > 0}
          hasNext={subPage.index < result.milestones.milestones.length - 1}
          onBack={close}
        />
      );
    }
    if (subPage.type === "chat") {
      return (
        <ChatPage
          courseId={courseId}
          assignmentId={assignmentId}
          assignmentName={assignment.name}
          jwt={jwt}
          onBack={close}
        />
      );
    }
    if (subPage.type === "submit") {
      return (
        <SubmitPage
          assignmentName={assignment.name}
          courseId={courseId}
          assignmentId={assignmentId}
          jwt={jwt}
          reviewStep={reviewStep}
          reviewStatus={reviewStatus}
          reviewError={reviewError}
          onSubmit={(body) => { shouldAutoOpenReviewRef.current = true; submitForReview(courseId, assignmentId, body); }}
          onBack={close}
        />
      );
    }
    if (subPage.type === "review" && reviewResult) {
      return <ReviewPage result={reviewResult} onResubmit={() => { reviewReset(); openSubmit(); }} onBack={close} />;
    }
  }

  const descriptionText = (() => {
    const html = assignment.description ?? "";
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, "text/html");
    return (doc.body.textContent ?? "").replace(/\s+/g, " ").trim();
  })();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-border shrink-0">
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors p-0.5">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground">{assignment.courseName}</p>
        </div>
        {result && <Sparkles className="h-4 w-4 text-primary shrink-0" />}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto py-3 flex flex-col gap-3">

        {/* Assignment header */}
        <div>
          <h2 className="text-sm font-semibold text-foreground leading-snug">{assignment.name}</h2>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {assignment.points_possible > 0 && (
              <Badge variant="muted">{assignment.points_possible} pts</Badge>
            )}
            {assignment.due_at && (
              <Badge variant="muted">
                Due {new Date(assignment.due_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
              </Badge>
            )}
            {assignment.submission_types?.length > 0 && (
              <Badge variant="muted">{assignment.submission_types[0]}</Badge>
            )}
          </div>
        </div>

        {/* Description row */}
        {descriptionText && (
          <button
            onClick={openDescription}
            className="w-full text-left bg-muted/40 rounded-lg p-3 flex items-start gap-2 hover:bg-muted/60 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Description</p>
              <p className="text-xs text-foreground/70 leading-relaxed line-clamp-2">{descriptionText}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          </button>
        )}

        {/* Idle state */}
        {status === "idle" && (
          <Button className="w-full gap-2" onClick={() => analyze(courseId, assignmentId)}>
            <Sparkles className="h-3.5 w-3.5" />
            Analyze with AI
          </Button>
        )}

        {/* Loading state */}
        {status === "loading" && (
          <div className="flex flex-col justify-center flex-1 gap-2 px-2">
              {STEPS.map((label, i) => (
                <div key={label} className={`flex items-center gap-3 text-sm transition-all duration-500 ${i <= step ? "opacity-100" : "opacity-30"}`}>
                  {i < step ? (
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  ) : i === step ? (
                    <Loader2 className="h-4 w-4 text-primary animate-spin shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                  <span className={i === step ? "text-foreground font-medium" : "text-muted-foreground"}>
                    {label}
                  </span>
                </div>
              ))}
          </div>
        )}

        {/* Error state */}
        {status === "error" && (
          <div className="flex flex-col items-center gap-3 px-4 py-6 text-center">
            <p className="text-sm text-destructive font-medium">Analysis failed</p>
            <p className="text-xs text-muted-foreground">{error}</p>
            <Button variant="outline" onClick={() => analyze(courseId, assignmentId)}>Try again</Button>
          </div>
        )}

        {/* Result state */}
        {status === "done" && result && (
          <>
            {/* Rubric section */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Rubric</p>
                <span className="text-[10px] text-muted-foreground tabular-nums">{result.rubric.totalPoints} pts</span>
              </div>
              <div className="flex flex-col gap-1">
                {result.rubric.criteria.map((c, i) => (
                  <Card key={i} className="shadow-none">
                    <button
                      className="w-full p-2.5 text-left flex items-center gap-2 hover:bg-muted/40 transition-colors"
                      onClick={() => openCriterion(i)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground leading-snug">{c.name}</p>
                      </div>
                      <Badge variant="muted" className="shrink-0 text-[10px]">{c.weight}</Badge>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    </button>
                  </Card>
                ))}
              </div>
            </div>

            {/* Milestones section */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Milestones</p>
                <span className="text-[10px] text-muted-foreground">
                  {completion.done}/{completion.total || result.milestones.milestones.length} complete
                </span>
              </div>
              <div className="flex flex-col gap-1">
                {result.milestones.milestones.map((m, i) => (
                  <Card key={i} className="shadow-none">
                    <div className="w-full p-2.5 text-left flex items-start gap-2.5 hover:bg-muted/40 transition-colors">
                      <button
                        className="shrink-0 mt-0.5"
                        onClick={(e) => { e.stopPropagation(); toggleMilestone(i); }}
                        aria-label={checkedMilestones.has(i) ? "Mark incomplete" : "Mark complete"}
                      >
                        {checkedMilestones.has(i) ? (
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        ) : (
                          <div className="h-4 w-4 rounded-sm bg-muted border border-border flex items-center justify-center">
                            <span className="text-[9px] font-bold text-muted-foreground leading-none">{m.order}</span>
                          </div>
                        )}
                      </button>

                      <button className="flex-1 min-w-0 text-left" onClick={() => openMilestone(i)}>
                        <p className={`text-xs font-medium leading-snug ${checkedMilestones.has(i) ? "line-through text-muted-foreground" : "text-foreground"}`}>
                          {m.title}
                        </p>
                        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                          <Clock className="h-3 w-3 shrink-0" />
                          <span>~{m.estimatedHours}h</span>
                          {i === selectedMilestoneIndex && (
                            <span className="ml-1 rounded bg-primary/10 px-1.5 py-0.5 text-primary">Open</span>
                          )}
                        </div>
                      </button>

                      <button className="shrink-0" onClick={() => openMilestone(i)}>
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Submit for Review entry point */}
            <button
              onClick={reviewResult ? openReview : openSubmit}
              className="w-full flex items-center gap-3 bg-muted/40 rounded-lg p-3 hover:bg-muted/60 transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <ClipboardCheck className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs font-medium text-foreground">
                  {reviewResult ? "View Review" : "Submit for Review"}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {reviewResult ? `Score: ${reviewResult.totalScore}/${reviewResult.totalPossible}` : "Upload your work for AI scoring"}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </button>

            {/* Chat entry point */}
            <button
              onClick={openChat}
              className="w-full flex items-center gap-3 bg-muted/40 rounded-lg p-3 hover:bg-muted/60 transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <MessageSquare className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs font-medium text-foreground">Ask a question</p>
                <p className="text-[10px] text-muted-foreground">Chat with AI about this assignment</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </button>

            {/* Re-analyze */}
            <Button variant="outline" size="sm" className="w-full gap-2 text-xs" onClick={() => analyze(courseId, assignmentId)}>
              <Sparkles className="h-3 w-3" />
              Re-analyze
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
