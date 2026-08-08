# E_Summit_Backend

Production API and data engine for **PEC Summit 2026** (E-Cell PEC, Chandigarh).

Implements [`BACKEND_IMPLEMENTATION_PLAN.md`](./BACKEND_IMPLEMENTATION_PLAN.md). It replaces the `localStorage` mocks in the `ESUMMIT` public site and serves the `esummit-admin` operations portal.

## Status

Roadmap phases **b1 (Core Setup)** and **b2 (Auth & JWT + Role Guards)** are built and verified end-to-end. Everything after that is still to come.

| Plan section | Status |
| :--- | :--- |
| §3 Database schema | ✅ Full Prisma schema, migrated |
| §4.1 Auth module | ✅ register / login / refresh / logout / me — ⚠️ `POST /auth/google` returns 501 |
| §5.3 Rate limiting | ⚠️ In-memory, not yet Redis-backed |
| §4.2 Registrations & passes | ⬜ Not started |
| §4.3 Payments & Razorpay webhooks | ⬜ Not started |
| §4.4 Gate check-in (HMAC QR) | ⬜ Not started |
| §4.5 Teams & submissions | ⬜ Not started |
| §4.6 AI Concierge RAG (SSE) | ⬜ Not started (pgvector extension is live) |
| BullMQ workers (email, PDF badge) | ⬜ Not started |

## Tech stack

NestJS 10 · TypeScript · Prisma 6 · PostgreSQL 16 (pgvector) · Redis 7 · Passport JWT · argon2 · Zod (env validation)

## Quick start

Requires Node.js 18+ and Docker.

```bash
npm install
cp .env.example .env      # then fill in the three secrets below
npm run infra:up          # Postgres :5433 + Redis :6380
npx prisma migrate dev
npm run start:dev         # http://localhost:4000/api/v1
```

Generate the required secrets with `openssl rand -base64 48` and set:

- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `QR_HMAC_SECRET` — ⚠️ rotating this invalidates every issued badge; do not change mid-event.

The app validates its whole environment at boot (`src/config/env.validation.ts`) and refuses to start with a clear error if anything required is missing.

Verify it's up:

```bash
curl http://localhost:4000/api/v1/health
```

## Scripts

| Script | Description |
| :--- | :--- |
| `npm run start:dev` | Dev server with watch mode |
| `npm run build` / `start:prod` | Compile to `dist/` and run it |
| `npm run lint` / `format` | ESLint (autofix) / Prettier |
| `npm test` | Jest unit tests |
| `npm run prisma:migrate` | Create + apply a migration |
| `npm run prisma:studio` | Browse the database |
| `npm run infra:up` / `infra:down` | Start / stop Postgres + Redis |

## Ports

Chosen to avoid colliding with anything already running locally.

| Service | Port |
| :--- | :--- |
| API | 4000 |
| PostgreSQL | 5433 (container 5432) |
| Redis | 6380 (container 6379) |

## Endpoints

All routes are under the `/api/v1` prefix.

| Method | Route | Auth | Notes |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | public | Liveness + DB reachability |
| `POST` | `/auth/register` | public | 5 req/min per IP |
| `POST` | `/auth/login` | public | 5 req/min per IP |
| `POST` | `/auth/refresh` | refresh cookie | Rotates the token |
| `POST` | `/auth/logout` | refresh cookie | Revokes the session family |
| `GET` | `/auth/me` | bearer | Profile + pass status |
| `POST` | `/auth/google` | public | **501** — not implemented yet |

## Auth design

Authentication is **deny-by-default**: `JwtAuthGuard` is registered globally, and a route must opt out with `@Public()` to be reachable anonymously.

**Access tokens** are short-lived JWTs (15m default) sent as `Authorization: Bearer <token>`. The JWT strategy re-reads the user from the database on every request, so a role change or account deletion takes effect immediately instead of lingering until the token expires.

**Refresh tokens** are opaque 48-byte random strings — deliberately *not* JWTs, because they must be revocable server-side. Only an HMAC of each token is persisted (`RefreshToken.tokenHash`), so a database leak does not yield usable tokens. They are delivered as an `httpOnly` cookie scoped to `path=/api/v1/auth`.

**Rotation and theft detection:** every refresh revokes the presented token and issues a new one in the same `familyId`. Presenting an already-revoked token is treated as theft — the entire family is revoked, logging the attacker *and* the legitimate user out. This is verified behaviour, not just intent.

**Authorization** uses `@Roles(...)` + `RolesGuard`, where `SUPER_ADMIN` is an implicit member of every role set. No route uses `@Roles` yet; the guard is wired and ready for the check-in and jury modules.

The global `ValidationPipe` runs with `whitelist` and `forbidNonWhitelisted`, so unknown request properties are rejected outright — a client cannot smuggle `"role": "SUPER_ADMIN"` into a registration payload.

## Schema notes

`prisma/schema.prisma` follows §3 of the plan. Additions beyond that blueprint are marked `// +plan` with an inline rationale:

- **`RefreshToken`** — required by the §4.1 refresh/logout flow, which needs server-side revocation.
- **`KnowledgeChunk`** — the pgvector retrieval index backing the §4.6 RAG concierge.
- **`Score.judge` relation** — the plan had `judgeId` as a bare string; a real foreign key prevents orphaned scores.
- **`Registration.updatedAt`** — check-in and badge writes mutate the row.
- Assorted `@@index` declarations on columns the planned queries filter by.

## Known gaps

- **Rate limiting is in-memory.** §5.3 specifies a Redis token bucket. Limits currently apply per process, so they will not hold correctly across multiple replicas. Swap in `ThrottlerStorageRedisService` when the Redis module lands.
- **Google OAuth is unimplemented** (`POST /auth/google` → 501). It fails loudly rather than silently so the `ESUMMIT` client gets an honest signal if it wires the button up early.
- **No seed data yet.** `prisma/seed.ts` is referenced in `package.json` but not written; the CMS content in `ESUMMIT/lib/data.ts` is the natural source for it.
- **No tests yet.** Jest is configured; the auth flow was verified manually via curl (registration, duplicate-email conflict, bad credentials, validation rejection, privilege-escalation rejection, refresh rotation, reuse detection, rate limiting).
