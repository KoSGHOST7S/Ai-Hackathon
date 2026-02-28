import { useEffect, useState } from "react";
import { ArrowLeft, Sparkles, CheckCircle2, Circle, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAnalysis } from "@/hooks/useAnalysis";
import type { CanvasAssignment } from "@/types/analysis";

const STEPS = ["Generating rubric…", "Validating rubric…", "Building milestones…"];

interface Props {
  assignment: CanvasAssignment;
  courseId: string;
  assignmentId: string;
  jwt: string;
  onBack: () => void;
}

export function AssignmentDetailView({ assignment, courseId, assignmentId, jwt, onBack }: Props) {
  const { result, status, error, step, analyze, loadExisting } = useAnalysis(jwt);
  const [expandedCriteria, setExpandedCriteria] = useState<Set<number>>(new Set([0]));
  const [checkedMilestones, setCheckedMilestones] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadExisting(courseId, assignmentId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, assignmentId]);

  const toggleCriterion = (i: number) =>
    setExpandedCriteria((s) => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; });
  const toggleMilestone = (i: number) =>
    setCheckedMilestones((s) => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-border shrink-0">
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors p-0.5">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{assignment.name}</p>
          <p className="text-xs text-muted-foreground">{assignment.courseName}</p>
        </div>
        {result && <Sparkles className="h-4 w-4 text-primary shrink-0" />}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto py-3 flex flex-col gap-4">

        {status === "idle" && (
          <div className="flex flex-col items-center justify-center flex-1 gap-4 text-center px-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">Analyze this assignment</p>
              <p className="text-xs text-muted-foreground">
                AI will generate a grading rubric and a step-by-step milestone plan.
              </p>
            </div>
            {assignment.points_possible > 0 && (
              <Badge variant="muted">{assignment.points_possible} pts possible</Badge>
            )}
            <Button className="w-full gap-2" onClick={() => analyze(courseId, assignmentId)}>
              <Sparkles className="h-3.5 w-3.5" />
              Analyze with AI
            </Button>
          </div>
        )}

        {status === "loading" && (
          <div className="flex flex-col items-center justify-center flex-1 gap-5 px-4">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <div className="w-full flex flex-col gap-2">
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
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-3 px-4 py-8 text-center">
            <p className="text-sm text-destructive font-medium">Analysis failed</p>
            <p className="text-xs text-muted-foreground">{error}</p>
            <Button variant="outline" onClick={() => analyze(courseId, assignmentId)}>Try again</Button>
          </div>
        )}

        {status === "done" && result && (
          <>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Rubric</p>
              <div className="flex flex-col gap-1.5">
                {result.rubric.criteria.map((c, i) => (
                  <Card key={i} className="shadow-none">
                    <button
                      className="w-full p-3 text-left flex items-center justify-between gap-2"
                      onClick={() => toggleCriterion(i)}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm font-medium text-foreground truncate">{c.name}</span>
                        <Badge variant="muted" className="shrink-0">{c.weight} pts</Badge>
                      </div>
                      {expandedCriteria.has(i)
                        ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
                    </button>
                    {expandedCriteria.has(i) && (
                      <div className="px-3 pb-3 flex flex-col gap-1.5 border-t border-border pt-2">
                        <p className="text-xs text-muted-foreground">{c.description}</p>
                        {c.levels.map((l, j) => (
                          <div key={j} className="flex justify-between text-xs">
                            <span className="text-foreground">{l.label}</span>
                            <span className="text-muted-foreground">{l.points} pts</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Milestones</p>
              <div className="flex flex-col gap-1.5">
                {result.milestones.milestones.map((m, i) => (
                  <Card key={i} className="shadow-none">
                    <button
                      className="w-full p-3 text-left flex items-start gap-3"
                      onClick={() => toggleMilestone(i)}
                    >
                      {checkedMilestones.has(i)
                        ? <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        : <Circle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />}
                      <div className="flex-1 min-w-0 text-left">
                        <p className={`text-sm font-medium leading-snug ${checkedMilestones.has(i) ? "line-through text-muted-foreground" : "text-foreground"}`}>
                          {m.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          ~{m.estimatedHours}h · {m.deliverable}
                        </p>
                      </div>
                    </button>
                  </Card>
                ))}
              </div>
            </div>

            <Button variant="outline" className="w-full gap-2" onClick={() => analyze(courseId, assignmentId)}>
              <Sparkles className="h-3.5 w-3.5" />
              Re-analyze
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
