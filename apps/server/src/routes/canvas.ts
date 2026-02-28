// apps/server/src/routes/canvas.ts
import { Router, Response } from "express";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { decrypt } from "../lib/crypto";
import { prisma } from "../lib/prisma";

const router = Router();

async function getCanvasCredentials(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.canvasBaseUrl || !user?.canvasToken) return null;
  return { baseUrl: user.canvasBaseUrl, apiKey: decrypt(user.canvasToken) };
}

async function canvasFetch(baseUrl: string, apiKey: string, path: string) {
  const res = await fetch(`${baseUrl}/api/v1${path}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) throw new Error(`Canvas API error: ${res.status}`);
  return res.json();
}

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
  }t
});

export default router;
