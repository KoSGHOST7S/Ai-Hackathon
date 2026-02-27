# Assignmint

A monorepo containing a browser extension and a backend API server for tracking Canvas LMS assignments.

## Structure

```
.
├── apps/
│   ├── extension/   # Chrome extension (React + Vite)
│   └── server/      # Express API server (TypeScript + Prisma + PostgreSQL)
└── packages/
    └── shared/      # Shared TypeScript types used by both apps
```

## Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [pnpm](https://pnpm.io/) v8+ (`npm install -g pnpm`)
- [Docker](https://www.docker.com/) and Docker Compose (for running the database or full stack)

## Quick start

### 1. Install dependencies

From the repo root:

```bash
pnpm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and set the values:

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://assignmint:password@localhost:5432/assignmint?schema=public` |
| `PORT` | Port the API server listens on | `3000` |

### 3. Start the database

```bash
docker compose up db -d
```

### 4. Run database migrations

```bash
cd apps/server
npx prisma migrate dev
```

### 5. Start development servers

In separate terminals (from the repo root):

```bash
# API server (hot-reload)
pnpm dev:server
```

For the extension there are two workflows depending on what you're working on:

**UI-only iteration** — runs a Vite dev server at `http://localhost:5173`. Hot reload works, but `chrome.*` APIs are not available:

```bash
pnpm dev:extension
```

**Testing as a real Chrome extension** — watch mode rebuilds on every save:

```bash
cd apps/extension && npx vite build --watch
```

Then load `apps/extension/dist/` as an unpacked extension in Chrome (see [Building → Load in Chrome](#load-in-chrome) below). After each rebuild, click the **refresh icon** on the extension card in `chrome://extensions` to pick up changes.

## Building

### Build everything

```bash
# Build the shared package first, then both apps
pnpm --filter shared build
pnpm build:server
pnpm build:extension
```

### Build individual pieces

```bash
pnpm build:server      # compiles apps/server → apps/server/dist/
pnpm build:extension   # compiles apps/extension → apps/extension/dist/
```

#### Load in Chrome

1. Go to `chrome://extensions`
2. Enable **Developer mode** (toggle, top-right)
3. Click **Load unpacked** → select `apps/extension/dist/`
4. The extension icon appears in your toolbar

After any rebuild, click the **refresh icon** on the extension card in `chrome://extensions` to reload it.

## Running the full stack with Docker

Build and start the API server and database together:

```bash
docker compose up --build
```

The API will be available at `http://localhost:3000`.

## Database

The server uses [Prisma](https://www.prisma.io/) to manage the PostgreSQL schema.

```bash
cd apps/server

# Apply pending migrations
npx prisma migrate dev

# Open Prisma Studio (database GUI)
npx prisma studio

# Re-generate the Prisma client after schema changes
npx prisma generate
```
