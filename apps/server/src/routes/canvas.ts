// apps/server/src/routes/canvas.ts
import { Router, Response } from "express";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { getCanvasCredentials, canvasFetch } from "../lib/canvas";

const router = Router();

// GET /canvas/assignments — all assignments across all active courses
router.get("/assignments", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const creds = await getCanvasCredentials(req.userId!);
    if (!creds) { res.status(400).json({ error: "Canvas not configured" }); return; }

    const courses: Array<{ id: number; name: string; course_code: string }> =
      await canvasFetch(creds.baseUrl, creds.apiKey, "/courses?enrollment_state=active&per_page=50");

    const results = await Promise.all(
      courses.map(async (course) => {
        try {
          const assignments = await canvasFetch(
            creds.baseUrl, creds.apiKey,
            `/courses/${course.id}/assignments?per_page=50&order_by=due_at&include[]=submission`
          );
          return (assignments as Array<Record<string, unknown>>).map((a) => ({
            ...a,
              courseId: String(course.id),
            courseName: course.name,
            courseCode: course.course_code,
          }));
        } catch { return []; }
      })
    );

    res.json(results.flat());
  } catch (err) {
    console.error("canvas all-assignments error:", err);
    res.status(502).json({ error: "Failed to fetch assignments" });
  }
});

// GET /canvas/courses
router.get("/courses", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const creds = await getCanvasCredentials(req.userId!);
    if (!creds) {
      res.status(400).json({ error: "Canvas not configured. Complete setup first." });
      return;
    }
    const data = await canvasFetch(creds.baseUrl, creds.apiKey, "/courses?enrollment_state=active&per_page=50");
    res.json(data);
  } catch (err) {
    console.error("canvas courses error:", err);
    res.status(502).json({ error: "Failed to fetch from Canvas API" });
  }
});

// GET /canvas/courses/:courseId/assignments
router.get("/courses/:courseId/assignments", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const creds = await getCanvasCredentials(req.userId!);
    if (!creds) {
      res.status(400).json({ error: "Canvas not configured. Complete setup first." });
      return;
    }
    const { courseId } = req.params;
    if (!/^\d+$/.test(courseId)) {
      res.status(400).json({ error: "Invalid courseId" });
      return;
    }
    const data = await canvasFetch(
      creds.baseUrl,
      creds.apiKey,
      `/courses/${courseId}/assignments?per_page=50&order_by=due_at`
    );
    res.json(data);
  } catch (err) {
    console.error("canvas assignments error:", err);
    res.status(502).json({ error: "Failed to fetch from Canvas API" });
  }
});

export default router;
