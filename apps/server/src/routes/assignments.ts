import { Router, Response } from "express";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { prisma } from "../lib/prisma";
import { callAgentsService } from "../lib/agents";
import { canvasFetch, getCanvasCredentials } from "../lib/canvas";

const router = Router();

// POST /assignments/analyze
router.post("/analyze", requireAuth, async (req: AuthRequest, res: Response) => {
  const { courseId, assignmentId } = req.body as { courseId: string; assignmentId: string };
  if (!courseId || !assignmentId) {
    res.status(400).json({ error: "courseId and assignmentId required" }); return;
  }
  try {
    const creds = await getCanvasCredentials(req.userId!);
    if (!creds) { res.status(400).json({ error: "Canvas not configured" }); return; }

    const assignment = await canvasFetch(creds.baseUrl, creds.apiKey,
      `/courses/${courseId}/assignments/${assignmentId}`);

    const description = (assignment.description ?? "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    // Extract Canvas rubric summary if present
    let canvas_rubric_summary: string | null = null;
    if (Array.isArray(assignment.rubric) && assignment.rubric.length > 0) {
      canvas_rubric_summary = (assignment.rubric as Array<{ description?: string; points?: number }>)
        .map((c) => `- ${c.description ?? "criterion"} (${c.points ?? 0} pts)`)
        .join("\n");
    }

    // Try to fetch file attachment names from the student's own submission (non-fatal)
    let attachment_names: string[] = [];
    try {
      const submission = await canvasFetch(
        creds.baseUrl, creds.apiKey,
        `/courses/${courseId}/assignments/${assignmentId}/submissions/self`
      );
      if (Array.isArray(submission?.attachments)) {
        attachment_names = (submission.attachments as Array<{ display_name?: string }>)
          .map((f) => f.display_name ?? "")
          .filter(Boolean);
      }
    } catch {
      // non-fatal — student may not have submitted yet
    }

    const result = await callAgentsService({
      name: assignment.name,
      description,
      points_possible: assignment.points_possible ?? 100,
      submission_types: assignment.submission_types ?? [],
      due_at: assignment.due_at ?? null,
      grading_type: assignment.grading_type ?? "points",
      allowed_attempts: assignment.allowed_attempts ?? null,
      attachment_names,
      canvas_rubric_summary,
    });

    const saved = await prisma.analysisResult.upsert({
      where: { userId_courseId_assignmentId: { userId: req.userId!, courseId, assignmentId } },
      update: { rubric: result.rubric as object, milestones: result.milestones as object },
      create: { userId: req.userId!, courseId, assignmentId, rubric: result.rubric as object, milestones: result.milestones as object },
    });

    res.json({ rubric: saved.rubric, milestones: saved.milestones });
  } catch (err) {
    console.error("analyze error:", err);
    res.status(502).json({ error: err instanceof Error ? err.message : "Analysis failed" });
  }
});

// GET /assignments/:courseId/:assignmentId/result
router.get("/:courseId/:assignmentId/result", requireAuth, async (req: AuthRequest, res: Response) => {
  const { courseId, assignmentId } = req.params;
  try {
    const result = await prisma.analysisResult.findUnique({
      where: { userId_courseId_assignmentId: { userId: req.userId!, courseId, assignmentId } },
    });
    if (!result) { res.status(404).json({ error: "No analysis found" }); return; }
    res.json({ rubric: result.rubric, milestones: result.milestones });
  } catch (err) {
    console.error("get result error:", err);
    res.status(500).json({ error: "Failed to retrieve result" });
  }
});

export default router;
