import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { encrypt } from "../lib/crypto";

const router = Router();
const prisma = new PrismaClient();

function makeJwt(userId: string, email: string) {
  return jwt.sign({ userId, email }, process.env.JWT_SECRET!, { expiresIn: "7d" });
}

// POST /auth/signup
router.post("/signup", async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  if (!email || !password) {
    res.status(400).json({ error: "email and password are required" });
    return;
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({ error: "An account with that email already exists" });
    return;
  }
  const hashed = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({ data: { email, password: hashed } });
  res.status(201).json({ jwt: makeJwt(user.id, user.email), user: { id: user.id, email: user.email } });
});

// POST /auth/login
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  if (!email || !password) {
    res.status(400).json({ error: "email and password are required" });
    return;
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }
  res.json({ jwt: makeJwt(user.id, user.email), user: { id: user.id, email: user.email } });
});

// GET /auth/me
router.get("/me", requireAuth, async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json({
    id: user.id,
    email: user.email,
    hasCanvasConfig: !!(user.canvasBaseUrl && user.canvasToken),
    canvasBaseUrl: user.canvasBaseUrl ?? null,
  });
});

// PUT /auth/canvas-config
router.put("/canvas-config", requireAuth, async (req: AuthRequest, res: Response) => {
  const { canvasBaseUrl, canvasApiKey } = req.body as {
    canvasBaseUrl: string;
    canvasApiKey: string;
  };
  if (!canvasBaseUrl || !canvasApiKey) {
    res.status(400).json({ error: "canvasBaseUrl and canvasApiKey are required" });
    return;
  }
  let parsedOrigin: string;
  try {
    parsedOrigin = new URL(canvasBaseUrl).origin;
  } catch {
    res.status(400).json({ error: "canvasBaseUrl must be a valid URL" });
    return;
  }
  const encryptedToken = encrypt(canvasApiKey);
  await prisma.user.update({
    where: { id: req.userId },
    data: { canvasBaseUrl: parsedOrigin, canvasToken: encryptedToken },
  });
  res.json({ ok: true });
});

export default router;
