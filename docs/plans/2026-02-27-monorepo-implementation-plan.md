# Assignmint Monorepo Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the current `assignmint` Chrome extension into a fully self-hostable monorepo with an Express/PostgreSQL backend via Docker Compose.

**Architecture:** We will set up an `npm` workspace with three packages: `apps/extension`, `apps/server`, and `packages/shared`. We will use Docker Compose to run the Express backend and a PostgreSQL database.

**Tech Stack:** Node.js, Express, TypeScript, Prisma, PostgreSQL, Docker Compose, React (Vite).

---

### Task 1: Restructure into a Monorepo

**Files:**
- Create: `package.json` (Root)
- Move: `assignmint/*` -> `apps/extension/*`
- Delete: `assignmint/`

**Step 1: Create root package.json for npm workspaces**

```bash
npm init -y
```

Update the root `package.json`:

```json
{
  "name": "assignmint-monorepo",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev:extension": "npm run dev -w apps/extension",
    "dev:server": "npm run dev -w apps/server",
    "build:extension": "npm run build -w apps/extension",
    "build:server": "npm run build -w apps/server"
  }
}
```

**Step 2: Move existing extension to apps/extension**

```bash
mkdir apps
Move-Item -Path "assignmint" -Destination "apps/extension"
```

**Step 3: Update extension name**

Modify `apps/extension/package.json` to change the name to `"name": "extension"`.

**Step 4: Commit**

```bash
git add package.json apps/extension
git commit -m "chore: setup monorepo and move extension"
```

---

### Task 2: Setup packages/shared

**Files:**
- Create: `packages/shared/package.json`
- Create: `packages/shared/tsconfig.json`
- Create: `packages/shared/src/index.ts`

**Step 1: Create package structure**

```bash
mkdir -p packages/shared/src
```

**Step 2: Create package.json**

Create `packages/shared/package.json`:

```json
{
  "name": "shared",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

**Step 3: Create tsconfig.json**

Create `packages/shared/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "commonjs",
    "declaration": true,
    "outDir": "./dist",
    "strict": true
  },
  "include": ["src/**/*"]
}
```

**Step 4: Create shared types**

Create `packages/shared/src/index.ts`:

```typescript
export interface User {
  id: string;
  email: string;
  canvasBaseUrl?: string;
}

export interface Assignment {
  id: string;
  userId: string;
  courseId: string;
  canvasAssignmentId: string;
  title: string;
}
```

**Step 5: Install dependencies and build**

```bash
npm install
npm run build -w shared
```

**Step 6: Commit**

```bash
git add packages/shared
git commit -m "feat: add shared types package"
```

---

### Task 3: Setup apps/server (Express + Prisma)

**Files:**
- Create: `apps/server/package.json`
- Create: `apps/server/tsconfig.json`
- Create: `apps/server/src/index.ts`
- Create: `apps/server/prisma/schema.prisma`

**Step 1: Initialize server package**

```bash
mkdir -p apps/server/src
```

Create `apps/server/package.json`:

```json
{
  "name": "server",
  "version": "1.0.0",
  "main": "dist/index.js",
  "scripts": {
    "dev": "ts-node-dev src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "@prisma/client": "^5.13.0",
    "shared": "*"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/node": "^20.12.7",
    "prisma": "^5.13.0",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.4.5"
  }
}
```

**Step 2: Create tsconfig.json**

Create `apps/server/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

**Step 3: Setup basic Express server**

Create `apps/server/src/index.ts`:

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { User } from 'shared';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

**Step 4: Initialize Prisma**

```bash
cd apps/server && npx prisma init
```

Update `apps/server/prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id              String       @id @default(cuid())
  email           String       @unique
  canvasBaseUrl   String?
  canvasToken     String?      // In a real app, this should be encrypted
  assignments     Assignment[]
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
}

model Assignment {
  id                 String   @id @default(cuid())
  userId             String
  courseId           String
  canvasAssignmentId String
  title              String
  user               User     @relation(fields: [userId], references: [id])
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  @@unique([userId, canvasAssignmentId])
}
```

**Step 5: Install dependencies**

```bash
npm install
```

**Step 6: Commit**

```bash
git add apps/server package-lock.json
git commit -m "feat: init express server with prisma"
```

---

### Task 4: Create Docker Compose

**Files:**
- Create: `docker-compose.yml`
- Create: `apps/server/Dockerfile`
- Create: `.env.example`

**Step 1: Create Dockerfile for Server**

Create `apps/server/Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy root package.json and lockfile
COPY package*.json ./

# Copy workspaces
COPY packages/shared/package.json ./packages/shared/
COPY apps/server/package.json ./apps/server/

# Install dependencies
RUN npm ci

# Copy source code
COPY packages/shared ./packages/shared
COPY apps/server ./apps/server

# Build shared package
RUN npm run build -w shared

# Generate Prisma Client
WORKDIR /app/apps/server
RUN npx prisma generate

# Build server
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

**Step 2: Create root docker-compose.yml**

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: apps/server/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://assignmint:password@db:5432/assignmint?schema=public
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=assignmint
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=assignmint
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U assignmint"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

**Step 3: Create .env.example**

Create `.env.example` in root:

```
DATABASE_URL=postgresql://assignmint:password@localhost:5432/assignmint?schema=public
PORT=3000
```

**Step 4: Commit**

```bash
git add docker-compose.yml apps/server/Dockerfile .env.example
git commit -m "feat: add docker compose for self-hosting"
```
