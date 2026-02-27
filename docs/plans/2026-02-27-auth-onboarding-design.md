# Auth & Onboarding Design

**Date:** 2026-02-27  
**Status:** Approved

## Overview

Add full authentication (signup + login) and a multi-step onboarding flow to Assignmint. Users register with email + password, configure their Canvas base URL and API key, and the extension maintains a JWT session. The server proxies Canvas API calls on behalf of the authenticated user using their securely stored API key.

## Goals

- Email + password signup and login
- Canvas base URL + API key collected after account creation and stored encrypted on the server
- JWT-based session maintained in `chrome.storage.local`
- Server-side Canvas API proxy: extension calls backend, backend decrypts token and calls Canvas
- Support both new users (signup) and returning users (login) in the onboarding UI

## Non-Goals

- OAuth / social login
- Password reset / email verification (out of scope for hackathon)
- Multi-device session management

---

## Architecture

### Server

**New dependencies:** `bcryptjs`, `jsonwebtoken`, `@types/bcryptjs`, `@types/jsonwebtoken`

**New env vars:**
- `JWT_SECRET` — used to sign/verify JWTs
- `ENCRYPTION_SECRET` — 32-byte hex string used for AES-256-GCM encryption of Canvas tokens

**Prisma schema changes:**
- Add `password String` field to `User` model

**New file structure:**
```
apps/server/src/
  routes/
    auth.ts          # POST /auth/signup, POST /auth/login
    canvas.ts        # PUT /auth/canvas-config, GET /canvas/*
  middleware/
    auth.ts          # JWT verification middleware
  lib/
    crypto.ts        # AES-256-GCM encrypt/decrypt for canvas token
  index.ts           # Wire up routes
```

**Routes:**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/signup` | No | Create user, return JWT |
| POST | `/auth/login` | No | Verify credentials, return JWT |
| PUT | `/auth/canvas-config` | Yes | Save/update canvasBaseUrl + canvasToken (encrypted) |
| GET | `/auth/me` | Yes | Return current user profile |
| GET | `/canvas/courses` | Yes | Proxy: fetch user's Canvas courses |
| GET | `/canvas/assignments` | Yes | Proxy: fetch assignments for a course |

**JWT payload:** `{ userId: string, email: string }`  
**JWT expiry:** 7 days

**Canvas token encryption:** AES-256-GCM. `crypto.ts` exposes `encrypt(plaintext)` → `{ iv, tag, ciphertext }` stored as a single `iv:tag:ciphertext` string in the DB. `decrypt(stored)` reverses this.

### Extension

**New/modified files:**
```
apps/extension/src/
  hooks/
    useAuth.ts           # JWT state from chrome.storage, login/signup/logout helpers
  components/views/
    SetupView.tsx        # Replaced: multi-step wizard (Step 1: account, Step 2: canvas config)
    OnboardingStep1.tsx  # Email + password form with signup/login toggle
    OnboardingStep2.tsx  # Canvas base URL + API key form
  lib/
    api.ts               # Typed fetch wrapper that injects Authorization header
```

**Onboarding flow:**
1. App checks `chrome.storage.local` for JWT on mount
2. If no JWT → show `SetupView` (multi-step wizard)
3. Step 1: user enters email + password, picks signup or login → calls `/auth/signup` or `/auth/login` → JWT stored in `chrome.storage.local`
4. Step 2: user enters Canvas base URL + API key → calls `PUT /auth/canvas-config` → on success, onboarding complete
5. App renders normally with `useAuth` providing the JWT for all subsequent requests

**`useAuth` hook:**
- Reads JWT from `chrome.storage.local` on mount
- Exposes `{ jwt, user, login, signup, logout, isLoading }`
- `login` / `signup` call the respective API endpoints and persist the JWT
- `logout` clears `chrome.storage.local`

**`api.ts`:**
- `apiFetch(path, options)` — wraps `fetch` with `Authorization: Bearer <jwt>` header and base URL from env/config
- Typed request/response helpers for each endpoint

---

## Data Flow

```
[Extension]                     [Server]                    [Canvas API]
    |                               |                              |
    |-- POST /auth/signup --------> |                              |
    |<- { jwt } ------------------- |                              |
    |                               |                              |
    |-- PUT /auth/canvas-config --> | (stores encrypted token)     |
    |<- { ok } ------------------- |                              |
    |                               |                              |
    |-- GET /canvas/courses ------> | decrypt token                |
    |                               |-- GET /api/v1/courses -----> |
    |                               |<- courses ------------------- |
    |<- courses ------------------- |                              |
```

---

## Security Notes

- Passwords hashed with `bcrypt` (cost factor 12)
- Canvas tokens encrypted with AES-256-GCM; raw token never stored plaintext
- `ENCRYPTION_SECRET` and `JWT_SECRET` must be set in environment and never committed
- JWTs are stateless; invalidation requires secret rotation (acceptable for hackathon scope)
- CORS configured to allow the extension origin

---

## Shared Types (`packages/shared`)

Add to shared package:
```ts
export interface SignupRequest { email: string; password: string; }
export interface LoginRequest { email: string; password: string; }
export interface AuthResponse { jwt: string; user: { id: string; email: string; } }
export interface CanvasConfigRequest { canvasBaseUrl: string; canvasApiKey: string; }
```
