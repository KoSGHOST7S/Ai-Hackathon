# Backend Architecture & Monorepo Design

**Date:** 2026-02-27
**Topic:** Monorepo with Express & PostgreSQL for assignmint Extension

## Goal
Transition the `assignmint` Chrome extension into a full-stack monorepo. Build a self-hostable Express + PostgreSQL backend to securely manage Canvas API interactions and store user configuration, rather than making direct Canvas API calls from the browser extension.

## Architecture & Monorepo Design

### 1. Directory Structure (Monorepo via npm workspaces)
We will restructure the repository into an `npm` workspace with three main packages to keep everything organized and allow code sharing:
* `apps/extension`: The existing React-based Chrome Extension code.
* `apps/server`: The new Express.js backend.
* `packages/shared`: Shared TypeScript interfaces (e.g. `Assignment`, `User`) used by both frontend and backend.

### 2. The Backend (`apps/server`)
* **Framework:** Express.js + TypeScript
* **Database:** PostgreSQL
* **ORM:** Prisma (for type-safe database queries and migration management)
* **Auth:** Simple JWT (JSON Web Tokens) or session-based auth to verify the extension making requests.

### 3. The Database Schema (Prisma)
Initial minimal schema to support the Canvas integration:
* `User`: `id`, `email`, `canvasBaseUrl`, `encryptedCanvasToken`
* `Assignment`: `id`, `userId`, `courseId`, `canvasAssignmentId`, `title`, `dueDate`, `status`

### 4. Deployment & Self-Hosting
* We will create a `docker-compose.yml` at the root of the project to allow for trivial self-hosting.
* It will define two containers:
  1. **Postgres database container**
  2. **Node.js API container** running the compiled `apps/server` code.
* Configuration will be managed via a `.env` file (e.g. for JWT secrets and DB passwords).

### 5. Flow of Data
1. The user logs into the extension (authenticating with the server).
2. The user inputs their Canvas API token into the extension UI.
3. The extension sends this token to `apps/server` to be securely saved in Postgres.
4. When the extension opens on a Canvas page, it sends the `courseId` and `assignmentId` to `apps/server`.
5. The `apps/server` uses the securely saved Canvas Token to fetch the assignment details directly from Canvas, and returns the formatted data back to the extension.
