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
  const creds = await getCanvasCredentials(req.userId!);
  if (!creds) { res.status(400).json({ error: "Canvas not configured" }); return; }

  try {
    const assignment = await canvasFetch(creds.baseUrl, creds.apiKey,
      `/courses/${courseId}/assignments/${assignmentId}`);

    const description = (assignment.description ?? "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const result = await callAgentsService({
      name: assignment.name,
      description,
      points_possible: assignment.points_possible ?? 100,
      submission_types: assignment.submission_types ?? [],
      due_at: assignment.due_at ?? null,
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
