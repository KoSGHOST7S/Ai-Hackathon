# Auth & Onboarding Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add JWT-based signup/login, AES-256-GCM encrypted Canvas API key storage, and a multi-step onboarding wizard to the Assignmint extension + server.

**Architecture:** Express route modules (`routes/auth.ts`, `routes/canvas.ts`) protected by JWT middleware. Canvas tokens encrypted at rest. Extension maintains JWT in `chrome.storage.local` via a `useAuth` hook and calls backend through a typed `api.ts` wrapper.

**Tech Stack:** Express, Prisma/PostgreSQL, `bcryptjs`, `jsonwebtoken`, Node.js built-in `crypto` (AES-256-GCM), React, `chrome.storage.local`

**Design doc:** `docs/plans/2026-02-27-auth-onboarding-design.md`

---

## Task 1: Server dependencies + env vars

**Files:**
- Modify: `apps/server/package.json`
- Modify: `.env`
- Modify: `.env.example`

**Step 1: Install new server dependencies**

```bash
cd apps/server
pnpm add bcryptjs jsonwebtoken
pnpm add -D @types/bcryptjs @types/jsonwebtoken
```

Expected: packages added to `apps/server/package.json`.

**Step 2: Add new env vars to `.env`**

Add these two lines to `.env`:
```
JWT_SECRET=your-very-long-random-secret-here
ENCRYPTION_SECRET=0123456789abcdef0123456789abcdef
```

`ENCRYPTION_SECRET` must be exactly 32 ASCII characters (used as AES-256 key).

**Step 3: Update `.env.example`**

Add the same two lines (with placeholder values) to `.env.example`:
```
JWT_SECRET=change-me-to-a-long-random-string
ENCRYPTION_SECRET=change-me-to-32-ascii-chars-exactly
```

**Step 4: Commit**

```bash
cd ../..
git add apps/server/package.json apps/server/pnpm-lock.yaml .env.example
git commit -m "chore: add bcryptjs and jsonwebtoken deps, add env var placeholders"
```

---

## Task 2: Prisma schema — add password field

**Files:**
- Modify: `apps/server/prisma/schema.prisma`

**Step 1: Add `password` field to User model**

In `apps/server/prisma/schema.prisma`, change the `User` model to:

```prisma
model User {
  id              String       @id @default(cuid())
  email           String       @unique
  password        String
  canvasBaseUrl   String?
  canvasToken     String?
  assignments     Assignment[]
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
}
```

**Step 2: Run migration**

```bash
cd apps/server
npx prisma migrate dev --name add-password-to-user
```

Expected output: `Your database is now in sync with your schema.`

**Step 3: Commit**

```bash
cd ../..
git add apps/server/prisma/
git commit -m "feat: add password field to User model"
```

---

## Task 3: Server — crypto utility

**Files:**
- Create: `apps/server/src/lib/crypto.ts`

**Step 1: Create the file**

```typescript
// apps/server/src/lib/crypto.ts
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGORITHM = "aes-256-gcm";
const KEY = Buffer.from(process.env.ENCRYPTION_SECRET!, "utf8"); // must be 32 bytes

export function encrypt(plaintext: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, KEY, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  // Store as hex:hex:hex so we can split on ":"
  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decrypt(stored: string): string {
  const [ivHex, tagHex, ciphertextHex] = stored.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");
  const ciphertext = Buffer.from(ciphertextHex, "hex");
  const decipher = createDecipheriv(ALGORITHM, KEY, iv);
  decipher.setAuthTag(tag);
  return decipher.update(ciphertext) + decipher.final("utf8");
}
```

**Step 2: Verify it compiles**

```bash
cd apps/server
npx tsc --noEmit
```

Expected: no errors.

**Step 3: Commit**

```bash
cd ../..
git add apps/server/src/lib/crypto.ts
git commit -m "feat: add AES-256-GCM encrypt/decrypt utility"
```

---

## Task 4: Server — JWT auth middleware

**Files:**
- Create: `apps/server/src/middleware/auth.ts`

**Step 1: Create the file**

```typescript
// apps/server/src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid Authorization header" });
    return;
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
    };
    req.userId = payload.userId;
    req.userEmail = payload.email;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
```

**Step 2: Verify it compiles**

```bash
cd apps/server
npx tsc --noEmit
```

Expected: no errors.

**Step 3: Commit**

```bash
cd ../..
git add apps/server/src/middleware/auth.ts
git commit -m "feat: add JWT requireAuth middleware"
```

---

## Task 5: Server — auth routes (signup, login, me, canvas-config)

**Files:**
- Create: `apps/server/src/routes/auth.ts`

**Step 1: Create the file**

```typescript
// apps/server/src/routes/auth.ts
import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { encrypt, decrypt } from "../lib/crypto";

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
```

**Step 2: Verify it compiles**

```bash
cd apps/server
npx tsc --noEmit
```

Expected: no errors.

**Step 3: Commit**

```bash
cd ../..
git add apps/server/src/routes/auth.ts
git commit -m "feat: add auth routes (signup, login, me, canvas-config)"
```

---

## Task 6: Server — Canvas proxy routes

**Files:**
- Create: `apps/server/src/routes/canvas.ts`

**Step 1: Create the file**

```typescript
// apps/server/src/routes/canvas.ts
import { Router, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { decrypt } from "../lib/crypto";

const router = Router();
const prisma = new PrismaClient();

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
  const creds = await getCanvasCredentials(req.userId!);
  if (!creds) {
    res.status(400).json({ error: "Canvas not configured. Complete setup first." });
    return;
  }
  const data = await canvasFetch(creds.baseUrl, creds.apiKey, "/courses?enrollment_state=active&per_page=50");
  res.json(data);
});

// GET /canvas/courses/:courseId/assignments
router.get("/courses/:courseId/assignments", requireAuth, async (req: AuthRequest, res: Response) => {
  const creds = await getCanvasCredentials(req.userId!);
  if (!creds) {
    res.status(400).json({ error: "Canvas not configured. Complete setup first." });
    return;
  }
  const { courseId } = req.params;
  const data = await canvasFetch(
    creds.baseUrl,
    creds.apiKey,
    `/courses/${courseId}/assignments?per_page=50&order_by=due_at`
  );
  res.json(data);
});

export default router;
```

**Step 2: Verify it compiles**

```bash
cd apps/server
npx tsc --noEmit
```

Expected: no errors.

**Step 3: Commit**

```bash
cd ../..
git add apps/server/src/routes/canvas.ts
git commit -m "feat: add Canvas API proxy routes (courses, assignments)"
```

---

## Task 7: Server — wire up routes in index.ts

**Files:**
- Modify: `apps/server/src/index.ts`

**Step 1: Replace `apps/server/src/index.ts` with:**

```typescript
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import authRouter from "./routes/auth";
import canvasRouter from "./routes/canvas";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRouter);
app.use("/canvas", canvasRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

**Step 2: Verify it compiles and starts**

```bash
cd apps/server
npx tsc --noEmit
```

Expected: no errors.

**Step 3: Commit**

```bash
cd ../..
git add apps/server/src/index.ts
git commit -m "feat: wire auth and canvas routes into express app"
```

---

## Task 8: Shared types

**Files:**
- Modify: `packages/shared/src/index.ts`

**Step 1: Add auth types to the shared package**

Append to `packages/shared/src/index.ts`:

```typescript
export interface SignupRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  jwt: string;
  user: { id: string; email: string };
}

export interface CanvasConfigRequest {
  canvasBaseUrl: string;
  canvasApiKey: string;
}

export interface MeResponse {
  id: string;
  email: string;
  hasCanvasConfig: boolean;
  canvasBaseUrl: string | null;
}
```

**Step 2: Rebuild shared**

```bash
pnpm --filter shared build
```

Expected: no errors.

**Step 3: Commit**

```bash
git add packages/shared/src/index.ts
git commit -m "feat: add auth and canvas-config shared types"
```

---

## Task 9: Extension — api.ts fetch wrapper

**Files:**
- Create: `apps/extension/src/lib/api.ts`

The backend URL is read from `import.meta.env.VITE_API_URL` (default `http://localhost:3000`).

**Step 1: Check if VITE_API_URL needs to be added to the extension's vite config**

Look at `apps/extension/vite.config.ts` — no change needed; Vite exposes all `VITE_*` env vars automatically. You may need to create `.env` in the extension directory:

```bash
echo "VITE_API_URL=http://localhost:3000" > apps/extension/.env
```

**Step 2: Create the file**

```typescript
// apps/extension/src/lib/api.ts
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

function getJwt(): string | null {
  // We access chrome.storage synchronously via a cached value set by useAuth.
  // For raw api calls we fall back to reading from chrome.storage async.
  // The pattern is: callers that need auth should use the helpers from useAuth.
  return null; // raw helper; jwt-aware callers use authedFetch below
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  jwt?: string
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (jwt) {
    headers["Authorization"] = `Bearer ${jwt}`;
  }
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) {
    throw new Error((data as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  return data as T;
}
```

**Step 3: Commit**

```bash
git add apps/extension/src/lib/api.ts apps/extension/.env
git commit -m "feat: add typed api fetch wrapper for extension"
```

---

## Task 10: Extension — useAuth hook

**Files:**
- Create: `apps/extension/src/hooks/useAuth.ts`

**Step 1: Create the file**

```typescript
// apps/extension/src/hooks/useAuth.ts
import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/api";
import type { AuthResponse, LoginRequest, SignupRequest } from "shared";

const STORAGE_KEY = "assignmint_jwt";

function storageGet(key: string): Promise<string | null> {
  if (typeof chrome !== "undefined" && chrome.storage) {
    return new Promise((resolve) => {
      chrome.storage.local.get(key, (result) => resolve(result[key] ?? null));
    });
  }
  return Promise.resolve(localStorage.getItem(key));
}

function storageSet(key: string, value: string): Promise<void> {
  if (typeof chrome !== "undefined" && chrome.storage) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, resolve);
    });
  }
  localStorage.setItem(key, value);
  return Promise.resolve();
}

function storageRemove(key: string): Promise<void> {
  if (typeof chrome !== "undefined" && chrome.storage) {
    return new Promise((resolve) => {
      chrome.storage.local.remove(key, resolve);
    });
  }
  localStorage.removeItem(key);
  return Promise.resolve();
}

export interface AuthState {
  jwt: string | null;
  user: { id: string; email: string } | null;
  isLoading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({ jwt: null, user: null, isLoading: true });

  useEffect(() => {
    storageGet(STORAGE_KEY).then((jwt) => {
      if (jwt) {
        // Decode the payload (no verification needed here — server does that)
        try {
          const payload = JSON.parse(atob(jwt.split(".")[1])) as {
            userId: string;
            email: string;
          };
          setState({ jwt, user: { id: payload.userId, email: payload.email }, isLoading: false });
        } catch {
          setState({ jwt: null, user: null, isLoading: false });
        }
      } else {
        setState({ jwt: null, user: null, isLoading: false });
      }
    });
  }, []);

  const signup = useCallback(async (data: SignupRequest) => {
    const res = await apiFetch<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
    await storageSet(STORAGE_KEY, res.jwt);
    setState({ jwt: res.jwt, user: res.user, isLoading: false });
    return res;
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    const res = await apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    await storageSet(STORAGE_KEY, res.jwt);
    setState({ jwt: res.jwt, user: res.user, isLoading: false });
    return res;
  }, []);

  const logout = useCallback(async () => {
    await storageRemove(STORAGE_KEY);
    setState({ jwt: null, user: null, isLoading: false });
  }, []);

  return { ...state, signup, login, logout };
}
```

**Step 2: Commit**

```bash
git add apps/extension/src/hooks/useAuth.ts
git commit -m "feat: add useAuth hook with chrome.storage JWT persistence"
```

---

## Task 11: Extension — OnboardingStep1 (account step)

**Files:**
- Create: `apps/extension/src/components/views/OnboardingStep1.tsx`

**Step 1: Create the file**

```tsx
// apps/extension/src/components/views/OnboardingStep1.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  onComplete: () => void;
}

export function OnboardingStep1({ onComplete }: Props) {
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup, login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        await signup({ email, password });
      } else {
        await login({ email, password });
      }
      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50";

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
        <span className="text-2xl">🌱</span>
      </div>
      <h1 className="text-xl font-bold text-foreground mb-1">
        {mode === "signup" ? "Create your account" : "Welcome back"}
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        {mode === "signup"
          ? "Step 1 of 2 — create your account"
          : "Sign in to continue to assignmint"}
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3 text-left">
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input
            id="email"
            type="email"
            placeholder="you@university.edu"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            className={inputClass}
            required
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            className={inputClass}
            required
            minLength={8}
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Please wait…" : mode === "signup" ? "Create Account" : "Sign In"}
        </Button>
      </form>

      <p className="mt-4 text-xs text-muted-foreground">
        {mode === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          type="button"
          onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setError(""); }}
          className="text-primary underline underline-offset-2"
        >
          {mode === "signup" ? "Sign in" : "Sign up"}
        </button>
      </p>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add apps/extension/src/components/views/OnboardingStep1.tsx
git commit -m "feat: add OnboardingStep1 account creation/login form"
```

---

## Task 12: Extension — OnboardingStep2 (Canvas config)

**Files:**
- Create: `apps/extension/src/components/views/OnboardingStep2.tsx`

**Step 1: Create the file**

```tsx
// apps/extension/src/components/views/OnboardingStep2.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

interface Props {
  jwt: string;
  onComplete: () => void;
}

export function OnboardingStep2({ jwt, onComplete }: Props) {
  const [canvasBaseUrl, setCanvasBaseUrl] = useState("");
  const [canvasApiKey, setCanvasApiKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiFetch(
        "/auth/canvas-config",
        { method: "PUT", body: JSON.stringify({ canvasBaseUrl, canvasApiKey }) },
        jwt
      );
      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50";

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
        <span className="text-2xl">🎓</span>
      </div>
      <h1 className="text-xl font-bold text-foreground mb-1">Connect Canvas</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Step 2 of 2 — link your Canvas account so assignmint can fetch your assignments
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3 text-left">
        <div className="space-y-1">
          <label htmlFor="baseUrl" className="text-sm font-medium">Canvas Base URL</label>
          <input
            id="baseUrl"
            type="url"
            placeholder="https://bw.instructure.com"
            value={canvasBaseUrl}
            onChange={(e) => { setCanvasBaseUrl(e.target.value); setError(""); }}
            className={inputClass}
            required
          />
          <p className="text-xs text-muted-foreground">Your school's Canvas domain</p>
        </div>
        <div className="space-y-1">
          <label htmlFor="apiKey" className="text-sm font-medium">Canvas API Key</label>
          <input
            id="apiKey"
            type="password"
            placeholder="••••••••••••••••"
            value={canvasApiKey}
            onChange={(e) => { setCanvasApiKey(e.target.value); setError(""); }}
            className={inputClass}
            required
          />
          <p className="text-xs text-muted-foreground">
            Generate one in Canvas → Account → Settings → New Access Token
          </p>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Saving…" : "Connect Canvas"}
        </Button>
      </form>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add apps/extension/src/components/views/OnboardingStep2.tsx
git commit -m "feat: add OnboardingStep2 Canvas URL + API key form"
```

---

## Task 13: Extension — update SetupView to multi-step wizard

**Files:**
- Modify: `apps/extension/src/components/views/SetupView.tsx`

**Step 1: Replace `SetupView.tsx` entirely with:**

```tsx
// apps/extension/src/components/views/SetupView.tsx
import { OnboardingStep1 } from "./OnboardingStep1";
import { OnboardingStep2 } from "./OnboardingStep2";

interface Props {
  onComplete: () => void;
  jwt: string | null;
  onStep1Complete: () => void;
}

export function SetupView({ onComplete, jwt, onStep1Complete }: Props) {
  if (!jwt) {
    return <OnboardingStep1 onComplete={onStep1Complete} />;
  }
  return <OnboardingStep2 jwt={jwt} onComplete={onComplete} />;
}
```

**Step 2: Commit**

```bash
git add apps/extension/src/components/views/SetupView.tsx
git commit -m "feat: replace SetupView with multi-step onboarding wizard"
```

---

## Task 14: Extension — update App.tsx to use useAuth

**Files:**
- Modify: `apps/extension/src/App.tsx`

**Step 1: Replace `App.tsx` with:**

```tsx
// apps/extension/src/App.tsx
import { useState, useEffect } from "react";
import { BottomNav, type Tab } from "@/components/BottomNav";
import { TodayView } from "@/components/views/TodayView";
import { PlanView } from "@/components/views/PlanView";
import { MeView } from "@/components/views/MeView";
import { SetupView } from "@/components/views/SetupView";
import { useCanvasUrl } from "@/hooks/useCanvasUrl";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/api";
import type { MeResponse } from "shared";

const VIEW_TITLE: Record<Tab, string> = {
  today: "Today",
  plan: "Plan",
  me: "Profile",
};

type OnboardingStep = "account" | "canvas" | "done";

export default function App() {
  const [tab, setTab] = useState<Tab>("today");
  const { jwt, user, isLoading, logout } = useAuth();
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>("account");
  const [meData, setMeData] = useState<MeResponse | null>(null);
  const { assignmentInfo } = useCanvasUrl();

  // Once we have a JWT, check if canvas is already configured
  useEffect(() => {
    if (!jwt) return;
    apiFetch<MeResponse>("/auth/me", {}, jwt)
      .then((me) => {
        setMeData(me);
        setOnboardingStep(me.hasCanvasConfig ? "done" : "canvas");
      })
      .catch(() => setOnboardingStep("canvas"));
  }, [jwt]);

  if (isLoading) {
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
          onComplete={() => setOnboardingStep("done")}
        />
      </div>
    );
  }

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "??";

  return (
    <div className="w-[390px] h-[600px] bg-background flex flex-col overflow-hidden">
      <header className="flex flex-col border-b border-border shrink-0 bg-card">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <span className="text-base font-bold text-primary tracking-tight">assignmint</span>
            <span className="mx-2 text-border select-none">·</span>
            <span className="text-sm font-medium text-foreground">{VIEW_TITLE[tab]}</span>
          </div>
          <div className="h-7 w-7 rounded-full bg-primary/12 border border-primary/20 flex items-center justify-center">
            <span className="text-[10px] font-bold text-primary">{initials}</span>
          </div>
        </div>

        {assignmentInfo && (
          <div className="px-4 py-2 bg-primary/10 border-t border-primary/20 flex items-center gap-2 text-xs text-primary-foreground">
            <span className="flex-1 text-primary font-medium">Canvas Assignment Detected</span>
            <div className="flex items-center gap-2 opacity-80 text-primary">
              <span className="bg-primary/20 px-1.5 py-0.5 rounded">C: {assignmentInfo.courseId}</span>
              <span className="bg-primary/20 px-1.5 py-0.5 rounded">A: {assignmentInfo.assignmentId}</span>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 min-h-0 p-4 overflow-hidden">
        {tab === "today" && <TodayView />}
        {tab === "plan" && <PlanView />}
        {tab === "me" && <MeView user={user} meData={meData} onLogout={logout} />}
      </main>

      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add apps/extension/src/App.tsx
git commit -m "feat: wire useAuth into App.tsx with onboarding step state"
```

---

## Task 15: Extension — update MeView to use real user data

**Files:**
- Modify: `apps/extension/src/components/views/MeView.tsx`

**Step 1: Update `MeView.tsx` to accept and display real user data**

Replace the existing component props and user display section. The component currently uses `user` from mock data. Change it to accept props:

```tsx
// apps/extension/src/components/views/MeView.tsx
import { useState } from "react";
import { GraduationCap, LogOut, Pencil } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import type { MeResponse } from "shared";

const PREFS = [
  { key: "notifications" as const, label: "Notifications", disabled: false },
  { key: "digest" as const, label: "Daily digest", disabled: false },
  { key: "darkMode" as const, label: "Dark mode", disabled: true, soon: true },
];

interface Props {
  user: { id: string; email: string } | null;
  meData: MeResponse | null;
  onLogout: () => void;
}

export function MeView({ user, meData, onLogout }: Props) {
  const [prefs, setPrefs] = useState({
    notifications: true,
    digest: false,
    darkMode: false,
  });

  const toggle = (key: keyof typeof prefs) =>
    setPrefs((p) => ({ ...p, [key]: !p[key] }));

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "??";

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center gap-3.5">
        <Avatar initials={initials} size="lg" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground text-sm">{user?.email ?? "—"}</p>
          {meData?.canvasBaseUrl && (
            <div className="flex items-center gap-1 mt-0.5">
              <GraduationCap className="h-3 w-3 text-muted-foreground shrink-0" />
              <p className="text-xs text-muted-foreground truncate">{meData.canvasBaseUrl}</p>
            </div>
          )}
        </div>
      </div>

      <Separator />

      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
          Preferences
        </p>
        <div>
          {PREFS.map((pref, i, arr) => (
            <div key={pref.key}>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2">
                  <span className={pref.disabled ? "text-sm text-muted-foreground" : "text-sm text-foreground"}>
                    {pref.label}
                  </span>
                  {pref.soon && (
                    <span className="text-[9px] font-semibold uppercase tracking-wide bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">
                      soon
                    </span>
                  )}
                </div>
                <Switch
                  checked={prefs[pref.key]}
                  onCheckedChange={() => !pref.disabled && toggle(pref.key)}
                  disabled={pref.disabled}
                />
              </div>
              {i < arr.length - 1 && <div className="h-px bg-border" />}
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="flex gap-2 mt-auto">
        <Button variant="outline" size="sm" className="flex-1 gap-1.5">
          <Pencil className="h-3.5 w-3.5" />
          Edit Profile
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/8"
          onClick={onLogout}
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add apps/extension/src/components/views/MeView.tsx
git commit -m "feat: update MeView to accept real user data props and wire logout"
```

---

## Task 16: Manual smoke test

**Step 1: Start the database**

```bash
docker compose up db -d
```

**Step 2: Start the server**

```bash
pnpm dev:server
```

**Step 3: Test signup**

```bash
curl -s -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' | jq .
```

Expected: `{ "jwt": "...", "user": { "id": "...", "email": "test@example.com" } }`

**Step 4: Test canvas-config (use JWT from step 3)**

```bash
JWT="<paste jwt here>"
curl -s -X PUT http://localhost:3000/auth/canvas-config \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT" \
  -d '{"canvasBaseUrl":"https://bw.instructure.com","canvasApiKey":"test-api-key"}' | jq .
```

Expected: `{ "ok": true }`

**Step 5: Test /auth/me**

```bash
curl -s http://localhost:3000/auth/me \
  -H "Authorization: Bearer $JWT" | jq .
```

Expected: `{ "id": "...", "email": "test@example.com", "hasCanvasConfig": true, "canvasBaseUrl": "https://bw.instructure.com" }`

**Step 6: Test the extension UI**

```bash
pnpm dev:extension
```

Open `http://localhost:5173`. You should see Step 1 (account form). Create an account, confirm Step 2 (Canvas config) appears. Fill in details, confirm the main app appears.

**Step 7: Final commit (if any cleanup needed)**

```bash
git add -A
git commit -m "chore: final cleanup after smoke test"
```
