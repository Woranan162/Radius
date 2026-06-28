# Radius

**Dependency failure simulator for platform and SRE teams.**

Model service dependencies on an interactive graph, simulate outages, measure weighted blast radius, plan recovery waves, and rank single points of failure (SPOF).

---

## What it does

| Feature | Description |
|---------|-------------|
| **Blast radius** | BFS cascade — see which services break when one node fails |
| **Weighted impact** | Critical services count more in the impact score (%) |
| **Recovery waves** | Ordered restore plan with estimated time and cost |
| **SPOF ranking** | Rank services by how much damage each one causes if it fails alone |
| **Interactive graph** | React Flow UI — click any node to run a simulation |
| **Text demo** | Server-rendered results at `/demo` (no graph, works offline) |

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS |
| Graph UI | `@xyflow/react` (React Flow v12) |
| Backend | Next.js App Router API routes |
| Database | PostgreSQL 16 (Docker locally → Aurora in production) |
| ORM | Prisma 6 |
| Hosting | Vercel |

---

## Prerequisites

- **Node.js** 18+ (20+ recommended)
- **npm**
- **Docker Desktop** (for local Postgres) — [download](https://www.docker.com/products/docker-desktop/)

Verify Docker:

```bash
docker -v
docker compose version
```

---

## Quick start

```bash
# 1. Clone and install
cd d:\project\Hack-0
npm install

# 2. Environment
cp .env.example .env
# Also copy to .env.local for Next.js (same DATABASE_URL)

# 3. Start Postgres
docker compose up -d
docker compose ps    # blastradius-postgres should be "running"

# 4. Create tables + seed demo data
npm run db:migrate
npm run db:seed

# 5. Run the app
npm run dev
```

Open:

| URL | What |
|-----|------|
| http://localhost:3000 | Landing page |
| http://localhost:3000/graph | Interactive simulator |
| http://localhost:3000/demo?fail=auth-service | Text demo (switch `fail=` to any service id) |

---

## Environment variables

Create `.env` and `.env.local` (both need the same value):

```env
DATABASE_URL="postgresql://blastradius:blastradius@localhost:5432/blastradius?connect_timeout=5"
```

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |

**Never commit `.env` or `.env.local`** — only `.env.example` is tracked.

### Production (Aurora)

Replace `DATABASE_URL` with your Aurora PostgreSQL connection string in Vercel project settings. Run migrations against Aurora before first deploy:

```bash
DATABASE_URL="postgresql://user:pass@your-aurora-host:5432/dbname" npm run db:migrate
DATABASE_URL="postgresql://user:pass@your-aurora-host:5432/dbname" npm run db:seed
```

---

## npm scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (http://localhost:3000) |
| `npm run build` | Prisma generate + production build |
| `npm run start` | Run production build |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Apply Prisma migrations |
| `npm run db:seed` | Load sample graph into Postgres |
| `npm run db:studio` | Open Prisma Studio GUI |

---

## Docker (local Postgres)

`docker-compose.yml` runs PostgreSQL 16 (same engine family as Aurora):

| Setting | Value |
|---------|-------|
| Container | `blastradius-postgres` |
| Port | `5432` |
| User / password / database | `blastradius` |

```bash
docker compose up -d      # start
docker compose ps         # status
docker compose down       # stop (data kept in volume)
docker compose down -v    # stop + delete data
```

Verify data:

```bash
docker exec -it blastradius-postgres psql -U blastradius -d blastradius -c "SELECT id, name FROM services;"
```

### Docker troubleshooting (Windows)

| Problem | Fix |
|---------|-----|
| `docker: command not found` | Install Docker Desktop, restart PC |
| Docker not running | Open Docker Desktop, wait for green status |
| Port 5432 in use | Stop other Postgres or change port in `docker-compose.yml` |
| WSL 2 required | Enable WSL 2 in Docker Desktop settings |

---

## Database schema

Defined in `prisma/schema.prisma`:

| Table | Purpose |
|-------|---------|
| `services` | Architecture nodes (id, name, tier, weight, restore time/cost) |
| `dependencies` | Edges — `dependent_id` depends on `dependency_id` |
| `simulation_runs` | Audit log of each simulation (failed ids + JSON result) |

Data flow:

```
API route → graph-store.ts → Prisma → PostgreSQL
```

- `getGraph()` reads services + dependencies; auto-seeds sample data if empty
- Falls back to in-memory sample graph if DB is unreachable (graph UI still works)

---

## Pages

| Route | Type | Description |
|-------|------|-------------|
| `/` | Server | Marketing landing — hero, how it works, features |
| `/graph` | Client | Interactive React Flow simulator + results panel |
| `/demo` | Server | Text-only simulation demo (`?fail=service-id`) |

### Graph UI (`/graph`)

- **Toolbar** — service count, reset, show/hide results (mobile)
- **Canvas** — click a node to simulate failure
- **Results panel** — tabs: Impact · Recovery · SPOF
- Simulations run **instantly in the browser**; results optionally saved to DB via API
- Graph loads from **built-in sample data** first, then syncs from `/api/graph` in background

---

## API routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/graph` | Full graph with layout positions for React Flow |
| `GET` | `/api/services` | List all services |
| `POST` | `/api/services` | Add a service (+ optional dependencies) |
| `POST` | `/api/simulate` | Run simulation — body: `{ "failedIds": ["auth-service"] }` |
| `GET` | `/api/spof` | SPOF leaderboard for current graph |
| `POST` | `/api/seed` | Reset database to sample graph |

### Example: simulate via curl

```bash
curl -X POST http://localhost:3000/api/simulate \
  -H "Content-Type: application/json" \
  -d "{\"failedIds\": [\"auth-service\"]}"
```

---

## Simulation engine

Located in `src/lib/simulation/`:

| File | Purpose |
|------|---------|
| `types.ts` | `ServiceNode`, `DependencyEdge`, `ArchitectureGraph`, result types |
| `sample-graph.ts` | Hardcoded 5-service demo architecture |
| `blast-radius.ts` | BFS cascade from failed node(s) |
| `weighted-impact.ts` | Impact % based on service weights |
| `recovery.ts` | Recovery waves (topological order + greedy cost) |
| `spof.ts` | SPOF ranking — simulate each service failing alone |
| `simulate.ts` | Orchestrator — runs all of the above |
| `graph-utils.ts` | Shared helpers (dependents map, lookup by id) |

### Dependency model

Edges are stored as **`from` depends on `to`**:

```
orders-api ──depends on──► auth-service
{ from: "orders-api", to: "auth-service" }
```

**Rule:** If `auth-service` fails → `orders-api` is affected (and anything that depends on `orders-api`, etc.)

### Blast radius algorithm (BFS)

1. Build reverse map: dependency → list of dependents
2. Seed queue with failed node(s) at depth 0
3. Walk queue — each dependent gets depth + 1
4. Return affected ids + depth per service

### Sample architecture

```
                    API Gateway
                   /           \
            Auth Service    Orders API
                              /    \
                    Payment Provider  Redis Cache
```

| Service | Tier | Weight |
|---------|------|--------|
| `api-gateway` | critical | 10 |
| `auth-service` | critical | 10 |
| `orders-api` | customer-facing | 7 |
| `payment-provider` | critical | 10 |
| `redis-cache` | internal | 3 |

Try failing different services:

- `auth-service` → large blast radius (many dependents)
- `redis-cache` → small blast radius (few dependents)

---

## Project structure

```
Hack-0/
├── docker-compose.yml          # Local Postgres
├── prisma/
│   ├── schema.prisma           # DB schema
│   └── seed.ts                 # Seed script
├── src/
│   ├── app/
│   │   ├── page.tsx            # Landing (/)
│   │   ├── layout.tsx          # Root layout + metadata
│   │   ├── globals.css         # Notion-style design tokens
│   │   ├── graph/              # Simulator page
│   │   ├── demo/               # Text demo page
│   │   └── api/                # REST API routes
│   ├── components/
│   │   ├── graph/              # React Flow, nodes, panel
│   │   ├── marketing/          # Hero, how-it-works
│   │   ├── demo/               # Demo page UI
│   │   └── layout/             # Nav, logo
│   └── lib/
│       ├── simulation/         # Pure TS engine (no DB)
│       ├── store/graph-store.ts
│       ├── db/prisma.ts
│       └── graph-response.ts
├── .env.example
└── package.json
```

---

## Deploy to production

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "Radius hackathon MVP"
git remote add origin https://github.com/YOUR_USER/radius.git
git branch -M main
git push -u origin main
```

### Step 2 — Aurora PostgreSQL (AWS)

1. Create **Aurora PostgreSQL** cluster in AWS RDS
2. Note host, port, database, user, password
3. Build connection string: `postgresql://USER:PASS@HOST:5432/DBNAME`
4. Run `db:migrate` and `db:seed` against Aurora (see Environment variables above)

### Step 3 — Vercel

1. Import GitHub repo at [vercel.com](https://vercel.com)
2. Add environment variable: `DATABASE_URL` = Aurora connection string
3. Deploy
4. Test live URL: `/`, `/demo`, `/graph`

### Step 4 — Hackathon submission

- **3-minute demo video** — landing → graph → click failure → show impact/recovery/SPOF
- **Architecture diagram** — 5 services + dependencies
- **Live URL** on Devpost
- **Credits form** (optional): https://forms.gle/ozhbhvaXAxHxu3kMA (deadline June 26)

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Graph shows toolbar but no nodes | Hard refresh `Ctrl+Shift+R`; restart `npm run dev` |
| Graph slow on first load | Normal — graph renders instantly from sample data; DB syncs in background |
| `EPERM` on build | Stop dev server, run `npm run build` again |
| Prisma migrate fails | Use Prisma 6 (not 7); check `DATABASE_URL` |
| Postgres connection timeout | `docker compose up -d`; check `.env` has `connect_timeout=5` |
| Port 5432 busy | Stop other Postgres or change port in `docker-compose.yml` |
| Empty database | `npm run db:seed` |
| `.env` not picked up | Copy to `.env.local` for Next.js; restart dev server |

---

## Hackathon status

| Area | Status |
|------|--------|
| Simulation engine | Done |
| API layer | Done |
| Landing + demo + graph UI | Done |
| Local Postgres + Prisma | Done |
| GitHub push | Not done |
| Aurora + Vercel deploy | Not done |
| Demo video + Devpost | Not done |

---

## License

Private — H0 Hackathon project.
