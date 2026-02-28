import { Router, Response } from "express";
import multer from "multer";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { prisma } from "../lib/prisma";
import { callAgentsService, streamFromAgentsService, parseFileViaAgents, streamChat, streamReview, type AgentsAnalyzeRequest, type FileContent, type ReviewRequest } from "../lib/agents";
import { canvasFetch, getCanvasCredentials } from "../lib/canvas";
import { fetchAssignmentLinkedFileContents } from "../lib/assignmentFiles";
import { stripHtml } from "../lib/html";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// POST /assignments/parse-file — proxy multipart file to agents service for parsing
router.post("/parse-file", requireAuth, upload.single("file"), async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" }); return;
  }
  const result = await parseFileViaAgents(req.file.buffer, req.file.originalname);
  if (!result) {
    res.status(422).json({ error: "Failed to parse file" }); return;
  }
  res.json(result);
});

async function fetchSubmissionFileContents(
  baseUrl: string, apiKey: string, courseId: string, assignmentId: string
): Promise<{ names: string[]; contents: FileContent[] }> {
  const names: string[] = [];
  const contents: FileContent[] = [];
  try {
    const submission = await canvasFetch(baseUrl, apiKey,
      `/courses/${courseId}/assignments/${assignmentId}/submissions/self`);
    if (!Array.isArray(submission?.attachments)) return { names, contents };

    for (const att of (submission.attachments as Array<{ display_name?: string; url?: string; size?: number }>).slice(0, 3)) {
      const name = att.display_name ?? "";
      if (name) names.push(name);
      if (!att.url || (att.size && att.size > 2_000_000)) continue;
      if (!name.toLowerCase().endsWith(".pdf") && !name.toLowerCase().endsWith(".docx")) continue;

      try {
        const fileRes = await fetch(att.url);
        if (!fileRes.ok) continue;
        const buffer = Buffer.from(await fileRes.arrayBuffer());
        const parsed = await parseFileViaAgents(buffer, name);
        if (parsed) contents.push(parsed);
      } catch { /* non-fatal */ }
    }
  } catch { /* non-fatal — no submission yet */ }
  return { names, contents };
}

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

    const rawDescriptionHtml = assignment.description ?? "";
    const description = stripHtml(rawDescriptionHtml);

    // Extract Canvas rubric summary if present
    let canvas_rubric_summary: string | null = null;
    if (Array.isArray(assignment.rubric) && assignment.rubric.length > 0) {
      canvas_rubric_summary = (assignment.rubric as Array<{ description?: string; points?: number }>)
        .map((c) => `- ${c.description ?? "criterion"} (${c.points ?? 0} pts)`)
        .join("\n");
    }

    const submissionFiles = await fetchSubmissionFileContents(creds.baseUrl, creds.apiKey, courseId, assignmentId);
    const linkedFiles = await fetchAssignmentLinkedFileContents(creds.baseUrl, creds.apiKey, rawDescriptionHtml);
    const attachment_names = [...new Set([...submissionFiles.names, ...linkedFiles.names])];
    const file_contents = [...submissionFiles.contents, ...linkedFiles.contents];

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
      file_contents,
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

// POST /assignments/analyze/stream — SSE streaming version
router.post("/analyze/stream", requireAuth, async (req: AuthRequest, res: Response) => {
  const { courseId, assignmentId } = req.body as { courseId: string; assignmentId: string };
  if (!courseId || !assignmentId) {
    res.status(400).json({ error: "courseId and assignmentId required" }); return;
  }

  try {
    const creds = await getCanvasCredentials(req.userId!);
    if (!creds) { res.status(400).json({ error: "Canvas not configured" }); return; }

    const assignment = await canvasFetch(creds.baseUrl, creds.apiKey,
      `/courses/${courseId}/assignments/${assignmentId}`);

    const rawDescriptionHtml = assignment.description ?? "";
    const description = stripHtml(rawDescriptionHtml);

    let canvas_rubric_summary: string | null = null;
    if (Array.isArray(assignment.rubric) && assignment.rubric.length > 0) {
      canvas_rubric_summary = (assignment.rubric as Array<{ description?: string; points?: number }>)
        .map((c) => `- ${c.description ?? "criterion"} (${c.points ?? 0} pts)`).join("\n");
    }

    const submissionFiles = await fetchSubmissionFileContents(creds.baseUrl, creds.apiKey, courseId, assignmentId);
    const linkedFiles = await fetchAssignmentLinkedFileContents(creds.baseUrl, creds.apiKey, rawDescriptionHtml);
    const attachment_names = [...new Set([...submissionFiles.names, ...linkedFiles.names])];
    const file_contents = [...submissionFiles.contents, ...linkedFiles.contents];

    const agentReq: AgentsAnalyzeRequest = {
      name: assignment.name,
      description,
      points_possible: assignment.points_possible ?? 100,
      submission_types: assignment.submission_types ?? [],
      due_at: assignment.due_at ?? null,
      grading_type: assignment.grading_type ?? "points",
      allowed_attempts: assignment.allowed_attempts ?? null,
      attachment_names,
      canvas_rubric_summary,
      file_contents,
    };

    // SSE headers — must be sent before any body write
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    for await (const event of streamFromAgentsService(agentReq)) {
      if (event.type === "progress") {
        res.write(`event: progress\ndata: ${JSON.stringify({ step: event.step, label: event.label })}\n\n`);
      } else if (event.type === "done") {
        try {
          await prisma.analysisResult.upsert({
            where:  { userId_courseId_assignmentId: { userId: req.userId!, courseId, assignmentId } },
            update: { rubric: event.result.rubric as object, milestones: event.result.milestones as object },
            create: { userId: req.userId!, courseId, assignmentId, rubric: event.result.rubric as object, milestones: event.result.milestones as object },
          });
        } catch (dbErr) {
          console.error("DB upsert failed during stream:", dbErr);
        }
        res.write(`event: done\ndata: ${JSON.stringify(event.result)}\n\n`);
        res.end();
        return;
      } else if (event.type === "error") {
        res.write(`event: error\ndata: ${JSON.stringify({ error: event.error })}\n\n`);
        res.end();
        return;
      }
    }
    res.end();
  } catch (err) {
    console.error("analyze/stream error:", err);
    if (!res.headersSent) {
      res.status(502).json({ error: err instanceof Error ? err.message : "Stream failed" });
    } else {
      res.write(`event: error\ndata: ${JSON.stringify({ error: "Internal server error" })}\n\n`);
      res.end();
    }
  }
});

// GET /assignments/results — list all analyzed assignment IDs for current user
router.get("/results", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const results = await prisma.analysisResult.findMany({
      where: { userId: req.userId! },
      select: { courseId: true, assignmentId: true, updatedAt: true },
    });
    res.json(results);
  } catch (err) {
    console.error("get results error:", err);
    res.status(500).json({ error: "Failed to retrieve results" });
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

// POST /assignments/:courseId/:assignmentId/chat
router.post("/:courseId/:assignmentId/chat", requireAuth, async (req: AuthRequest, res: Response) => {
  const { courseId, assignmentId } = req.params;
  const { messages } = req.body as { messages: Array<{ role: string; content: string }> };
  if (!messages?.length) { res.status(400).json({ error: "messages required" }); return; }

  try {
    const result = await prisma.analysisResult.findUnique({
      where: { userId_courseId_assignmentId: { userId: req.userId!, courseId, assignmentId } },
    });
    if (!result) { res.status(404).json({ error: "Analyze the assignment first" }); return; }

    const pointsBreakdown = (result.rubric as any).criteria
      ?.map((c: any) => `- **${c.name}** (${c.weight} pts): ${c.description}`)
      .join("\n") ?? "";

    const milestoneList = (result.milestones as any).milestones
      ?.map((m: any) => `**Step ${m.order}: ${m.title}** (~${m.estimatedHours}h)\nTasks:\n${(m.tasks ?? []).map((t: string) => `- ${t}`).join("\n")}\nDeliverable: ${m.deliverable}`)
      .join("\n\n") ?? "";

    const system_context = [
      "You are an expert academic coach. Answer questions about this assignment to help the student get the best grade possible.",
      "Always respond in markdown — use **bold** for key points, bullet lists for steps, and ## headers for multi-part answers.",
      "Be direct and actionable: tell the student exactly what to do to earn points. Reference specific rubric criteria and point values.",
      "",
      "## Rubric (grading breakdown)",
      pointsBreakdown,
      "",
      "## Milestones (study plan)",
      milestoneList,
    ].join("\n");

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    for await (const event of streamChat({ system_context, messages })) {
      if (event.type === "token") {
        res.write(`event: token\ndata: ${JSON.stringify({ token: event.token })}\n\n`);
      } else if (event.type === "done") {
        res.write(`event: done\ndata: ${JSON.stringify({})}\n\n`);
      } else {
        res.write(`event: error\ndata: ${JSON.stringify({ error: event.error })}\n\n`);
      }
    }
    res.end();
  } catch (err) {
    console.error("chat error:", err);
    if (!res.headersSent) {
      res.status(502).json({ error: "Chat failed" });
    } else {
      res.write(`event: error\ndata: ${JSON.stringify({ error: "Internal error" })}\n\n`);
      res.end();
    }
  }
});

// POST /assignments/:courseId/:assignmentId/review — submit work for review (SSE)
router.post("/:courseId/:assignmentId/review", requireAuth, async (req: AuthRequest, res: Response) => {
  const { courseId, assignmentId } = req.params;
  const { submission_text, submission_files } = req.body as {
    submission_text?: string;
    submission_files?: FileContent[];
  };
  if (!submission_text && (!submission_files || submission_files.length === 0)) {
    res.status(400).json({ error: "Provide submission_text or submission_files" }); return;
  }

  try {
    const analysis = await prisma.analysisResult.findUnique({
      where: { userId_courseId_assignmentId: { userId: req.userId!, courseId, assignmentId } },
    });
    if (!analysis) { res.status(404).json({ error: "Analyze the assignment first" }); return; }

    const creds = await getCanvasCredentials(req.userId!);
    if (!creds) { res.status(400).json({ error: "Canvas not configured" }); return; }

    const assignment = await canvasFetch(creds.baseUrl, creds.apiKey,
      `/courses/${courseId}/assignments/${assignmentId}`);
    const description = stripHtml(assignment.description ?? "");

    const reviewReq: ReviewRequest = {
      assignment_name: assignment.name,
      assignment_description: description,
      rubric: analysis.rubric as any,
      submission_text: submission_text ?? "",
      submission_files: submission_files ?? [],
    };

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    for await (const event of streamReview(reviewReq)) {
      if (event.type === "progress") {
        res.write(`event: progress\ndata: ${JSON.stringify({ step: event.step, label: event.label })}\n\n`);
      } else if (event.type === "done") {
        try {
          await prisma.reviewResult.upsert({
            where: { userId_courseId_assignmentId: { userId: req.userId!, courseId, assignmentId } },
            update: {
              scores: event.result.scores as object[], totalScore: event.result.totalScore,
              totalPossible: event.result.totalPossible, strengths: event.result.strengths,
              improvements: event.result.improvements, nextSteps: event.result.nextSteps,
            },
            create: {
              userId: req.userId!, courseId, assignmentId,
              scores: event.result.scores as object[], totalScore: event.result.totalScore,
              totalPossible: event.result.totalPossible, strengths: event.result.strengths,
              improvements: event.result.improvements, nextSteps: event.result.nextSteps,
            },
          });
        } catch (e) { console.error("Review DB upsert failed:", e); }
        res.write(`event: done\ndata: ${JSON.stringify(event.result)}\n\n`);
        res.end(); return;
      } else if (event.type === "error") {
        res.write(`event: error\ndata: ${JSON.stringify({ error: event.error })}\n\n`);
        res.end(); return;
      }
    }
    res.end();
  } catch (err) {
    console.error("review error:", err);
    if (!res.headersSent) res.status(502).json({ error: "Review failed" });
    else { res.write(`event: error\ndata: ${JSON.stringify({ error: "Internal error" })}\n\n`); res.end(); }
  }
});

// GET /assignments/:courseId/:assignmentId/review — get cached review
router.get("/:courseId/:assignmentId/review", requireAuth, async (req: AuthRequest, res: Response) => {
  const { courseId, assignmentId } = req.params;
  try {
    const result = await prisma.reviewResult.findUnique({
      where: { userId_courseId_assignmentId: { userId: req.userId!, courseId, assignmentId } },
    });
    if (!result) { res.status(404).json({ error: "No review found" }); return; }
    res.json(result);
  } catch (err) {
    console.error("get review error:", err);
    res.status(500).json({ error: "Failed to retrieve review" });
  }
});

export default router;
