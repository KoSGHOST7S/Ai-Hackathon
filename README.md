# Assignmint.ai

AI-powered assignment analysis for Canvas LMS. A Chrome extension that generates grading rubrics, milestone plans, lets you chat with an AI about any assignment, and scores your work against the rubric before you submit — powered by IBM watsonx Granite.

## Architecture

```
apps/
├── extension/   Chrome extension popup (React 19 + Vite + Tailwind)
├── server/      Express API (TypeScript + Prisma + PostgreSQL)
└── agents/      AI pipeline (Python + FastAPI + IBM watsonx)

packages/
└── shared/      Shared TypeScript types
```

**How it works:** The extension detects Canvas assignment pages, fetches assignment data through the Express server, which calls the Python agents service. Two multi-agent pipelines run sequentially via SSE streaming:

1. **Analysis pipeline** (3 agents): rubric generator → rubric validator → milestone builder
2. **Review pipeline** (3 agents): scorer → feedback writer → review validator

Results are persisted in Postgres. Users can also chat with the AI about any analyzed assignment, and submit their work (PDF/DOCX/text) for pre-submission scoring against the generated rubric.

## Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [pnpm](https://pnpm.io/) v8+ (`npm install -g pnpm`)
- [Python](https://www.python.org/) 3.13+ with [uv](https://docs.astral.sh/uv/)
- [Docker](https://www.docker.com/) and Docker Compose

## Environment variables

Copy the example and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description | Required |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `PORT` | Express server port | No (default: `3000`) |
| `JWT_SECRET` | Secret for signing auth tokens | Yes |
| `ENCRYPTION_SECRET` | 32-byte key for encrypting Canvas tokens at rest | Yes |
| `WATSONX_API_KEY` | IBM watsonx.ai API key | Yes |
| `WATSONX_PROJECT_ID` | watsonx.ai project ID | Yes |
| `WATSONX_URL` | watsonx.ai endpoint | Yes (default: `https://us-south.ml.cloud.ibm.com/`) |
| `GRANITE_MODEL` | Model ID for analysis | No (default: `gpt-oss-120b`) |
| `CANVAS_API_KEY` | Canvas LMS API key (for testing) | No |
| `CANVAS_BASE_URL` | Canvas instance URL (for testing) | No |

## Quick start (local dev)

### 1. Install dependencies

```bash
# Node.js packages (from repo root)
pnpm install

# Python packages
cd apps/agents
uv sync
cd ../..
```

### 2. Start the database

```bash
docker compose up db -d
```

### 3. Run migrations

```bash
cd apps/server
npx prisma migrate dev
cd ../..
```

### 4. Start all three services

Open three terminals:

**Terminal 1 — Express API server:**
```bash
pnpm dev:server
```

**Terminal 2 — Python agents service:**
```bash
cd apps/agents
uv run uvicorn main:app --port 8000 --reload
```

**Terminal 3 — Extension build (watch mode):**
```bash
cd apps/extension
pnpm build --watch
```

### 5. Load the extension in Chrome

1. Go to `chrome://extensions`
2. Enable **Developer mode** (toggle, top-right)
3. Click **Load unpacked** → select `apps/extension/dist/`
4. The extension icon appears in your toolbar

After rebuilds, click the **refresh icon** on the extension card to reload.

## Full stack with Docker

Build and start everything (database + API server + agents service):

```bash
docker compose up --build
```

Then run migrations (first time only):

```bash
docker compose exec api sh -c "cd apps/server && npx prisma migrate deploy"
```

| Service | URL | Description |
|---|---|---|
| `api` | http://localhost:3000 | Express API server |
| `agents` | http://localhost:8000 | Python FastAPI agents service |
| `db` | localhost:5432 | PostgreSQL 17 |

The extension still needs to be built locally (`cd apps/extension && pnpm build`) and loaded in Chrome.

## Public HTTPS deployment (Docker + Caddy)

Use this when hosting on a server so the extension can reach your API over HTTPS.

### 1. Prepare server env

```bash
cp server.env.example .env
```

Edit `.env` and set:
- `DOMAIN` to your public API hostname (example: `api.example.com`)
- `JWT_SECRET` and `ENCRYPTION_SECRET`
- `WATSONX_*` values

### 2. Configure DNS and firewall

- Point your domain (for example `api.example.com`) to the server IP
- Open inbound TCP ports `80` and `443`

### 3. Start the stack (with production override)

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

This keeps `db` and `agents` internal and exposes only Caddy (`80/443`) publicly.

### 4. Run database migrations

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml exec api \
  sh -c "cd apps/server && npx prisma migrate deploy"
```

### 5. Point extension at hosted API

In `apps/extension/.env`:

```bash
VITE_API_URL=https://your-domain.example.com
```

Then rebuild and reload the extension:

```bash
cd apps/extension
pnpm build
```

## Public HTTPS deployment (Docker + Cloudflare Tunnel)

Use this if you prefer no inbound ports on your server.

### 1. Create tunnel and route in Cloudflare

In Cloudflare Zero Trust:
- Create a new Tunnel (connector type: Docker)
- Add a public hostname (example: `api.example.com`)
- Set service URL to `http://api:3000`
- Copy the generated tunnel token

### 2. Prepare server env

```bash
cp server.tunnel.env.example .env
```

Edit `.env` and set:
- `CLOUDFLARE_TUNNEL_TOKEN`
- `JWT_SECRET` and `ENCRYPTION_SECRET`
- `WATSONX_*` values

### 3. Start stack with tunnel override

```bash
docker compose -f docker-compose.yml -f docker-compose.tunnel.yml up -d --build
```

This keeps `db`, `agents`, and `api` internal; `cloudflared` publishes your API through Cloudflare.

### 4. Run database migrations

```bash
docker compose -f docker-compose.yml -f docker-compose.tunnel.yml exec api \
  sh -c "cd apps/server && npx prisma migrate deploy"
```

### 5. Point extension at hosted API

In `apps/extension/.env`:

```bash
VITE_API_URL=https://your-domain.example.com
```

Then rebuild and reload the extension:

```bash
cd apps/extension
pnpm build
```

## Services

### Express API (`apps/server`)

Authentication, Canvas API proxy, and analysis orchestration.

| Endpoint | Method | Description |
|---|---|---|
| `/health` | GET | Health check |
| `/auth/signup` | POST | Create account |
| `/auth/login` | POST | Log in |
| `/auth/me` | GET | Current user profile |
| `/auth/canvas-config` | PUT | Configure Canvas integration |
| `/canvas/courses` | GET | List active Canvas courses |
| `/canvas/assignments` | GET | All assignments across all courses |
| `/canvas/courses/:id/assignments` | GET | Assignments for a specific course |
| `/assignments/analyze` | POST | Analyze assignment (non-streaming) |
| `/assignments/analyze/stream` | POST | Analyze assignment (SSE streaming) |
| `/assignments/results` | GET | List all analyzed assignment IDs |
| `/assignments/:cid/:aid/result` | GET | Get cached analysis result |
| `/assignments/:cid/:aid/chat` | POST | Chat about an analyzed assignment (SSE) |
| `/assignments/:cid/:aid/review` | POST | Submit work for AI scoring (SSE streaming) |
| `/assignments/:cid/:aid/review` | GET | Get cached review result |

All endpoints except `/health`, `/auth/signup`, and `/auth/login` require a JWT bearer token.

### Python Agents (`apps/agents`)

Three-agent AI pipeline using IBM watsonx Granite.

| Endpoint | Method | Description |
|---|---|---|
| `/health` | GET | Health check |
| `/analyze` | POST | Run full analysis pipeline (returns JSON) |
| `/analyze/stream` | POST | Run pipeline with SSE progress events |
| `/chat` | POST | Chat completion with system context (SSE) |
| `/parse-file` | POST | Parse PDF/DOCX file → plain text |
| `/review` | POST | Run review pipeline (returns JSON) |
| `/review/stream` | POST | Run review pipeline with SSE progress events |

**Analysis pipeline:**
1. **Rubric Generator** — takes assignment description + Canvas rubric + file contents → generates structured rubric JSON (4 levels per criterion)
2. **Rubric Validator** — checks rubric against assignment requirements, fixes gaps
3. **Milestone Generator** — creates 4–7 ordered milestones mapped to rubric criteria

**Review pipeline:**
1. **Scorer** — reads student submission against the rubric → assigns a level + points + feedback per criterion
2. **Feedback Writer** — reads scored rubric + submission → writes strengths, improvements, and next steps
3. **Review Validator** — validates scores are consistent with feedback, checks all criteria covered

### Chrome Extension (`apps/extension`)

React popup (390×600px) with sub-page navigation.

**Views:**
- **Today** — upcoming assignments sorted by due date, stats row, AI analysis badges
- **Plan** — week calendar with navigation, assignments grouped by day
- **Profile** — Canvas connection status, assignment/analysis/course stats
- **Assignment Detail** — tappable rows for description, rubric criteria, milestones, chat
- **Sub-pages** — DescriptionPage, CriterionPage (color-coded levels), MilestonePage (with completion toggle), ChatPage (streaming AI responses), SubmitPage (file upload / text paste), ReviewPage (full scorecard with per-criterion feedback)

**Auto-detection:** When you open the popup while on a Canvas assignment page (`/courses/*/assignments/*`), it automatically navigates to that assignment's detail view.

## Database

PostgreSQL with Prisma ORM. Three models:

- **User** — email, password (bcrypt), encrypted Canvas token, profile info
- **Assignment** — Canvas assignment tracking
- **AnalysisResult** — persisted rubric + milestones JSON per user/assignment
- **ReviewResult** — persisted review scorecard (scores, strengths, improvements, next steps) per user/assignment

```bash
cd apps/server

npx prisma migrate dev      # Apply migrations
npx prisma studio           # Open database GUI
npx prisma generate         # Regenerate client after schema changes
```

## Tech stack

| Layer | Technology |
|---|---|
| Extension | React 19, TypeScript, Vite, Tailwind CSS, Chrome MV3 |
| API Server | Express, TypeScript, Prisma, PostgreSQL, JWT |
| AI Agents | Python 3.13, FastAPI, IBM watsonx.ai SDK, Pydantic v2 |
| AI Model | gpt-oss-120b (via watsonx endpoint) |
| File Parsing | pymupdf (PDF), python-docx (DOCX) |
| Package Management | pnpm (Node.js), uv (Python) |
| Infrastructure | Docker Compose, PostgreSQL 17 |

## Development

### UI-only iteration (no Chrome APIs)

```bash
pnpm dev:extension
```

Opens Vite dev server at http://localhost:5173 with hot reload. `chrome.*` APIs won't work.

### Testing the agents service

```bash
# Health check
curl http://localhost:8000/health

# Analyze an assignment (non-streaming)
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","description":"Write an essay on recursion","points_possible":100}'

# Analyze with streaming progress
curl -N -X POST http://localhost:8000/analyze/stream \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","description":"Write an essay on recursion","points_possible":100}'
```

### Building

```bash
pnpm --filter shared build   # Build shared types
pnpm build:server             # Build API server
pnpm build:extension          # Build Chrome extension
```
