# RSIPF Learning Management System

A full-stack Learning Management System (LMS) for the **Royal Solomon Islands Police Force**, built with [Payload CMS 3.x](https://payloadcms.com/) installed directly into a [Next.js 15](https://nextjs.org/) App Router project, backed by **PostgreSQL**.

## Stack

- Payload CMS 3.x (`@payloadcms/db-postgres`, `@payloadcms/richtext-lexical`)
- Next.js 15 (App Router) + React 19
- TypeScript end-to-end
- Tailwind CSS for the public UI
- Resend for transactional email
- `@react-pdf/renderer` for certificate PDFs
- Recharts for admin dashboards

## Quick start

### 1. Requirements

- Node.js **≥ 20.9**
- Docker Desktop (or an equivalent that supports `docker compose`)
- (Optional) A Resend API key — email is mocked to the console when missing

The repo includes a `compose.local.yml` that spins up everything the app needs for local development:

| Service | Purpose | Host port(s) |
| --- | --- | --- |
| `postgres` | Main database | `5432` |
| `minio` | S3-compatible object storage (uploads bucket) | `9000` (S3), `9001` (console) |
| `minio-init` | One-shot — creates the `rsipf-lms-media` bucket | — |

Start it once and the bucket is created automatically:

```bash
docker compose -f compose.local.yml up -d
```

MinIO web console: <http://localhost:9001> (login `minio` / `minio12345`).

### 2. Install

```bash
git clone <repo-url> rsipf-lms
cd rsipf-lms
npm install
```

### 3. Configure environment

Copy `.env.example` to `.env` and adjust:

```bash
cp .env.example .env
```

| Variable                 | Description                                                                   |
| ------------------------ | ----------------------------------------------------------------------------- |
| `DATABASE_URI`           | PostgreSQL connection string (e.g. `postgresql://user:pw@host:5432/rsipf_lms`) |
| `PAYLOAD_SECRET`         | Long random string used to sign tokens                                        |
| `RESEND_API_KEY`         | Resend API key (optional in development)                                      |
| `RESEND_FROM_EMAIL`      | Verified Resend sender address                                                |
| `NEXT_PUBLIC_SERVER_URL` | Public site URL, e.g. `http://localhost:3000`                                 |
| `S3_ENDPOINT`            | S3-compatible endpoint (MinIO uses `http://localhost:9000` locally)           |
| `S3_REGION`              | S3 region (any value works for MinIO — default `us-east-1`)                   |
| `S3_BUCKET`              | Bucket name — `rsipf-lms-media` matches what `minio-init` creates             |
| `S3_ACCESS_KEY`          | Access key (`minio` for local MinIO)                                          |
| `S3_SECRET_KEY`          | Secret key (`minio12345` for local MinIO)                                     |

### 4. Run the dev server

```bash
npm run dev
```

The public app is at <http://localhost:3000> and the Payload admin at <http://localhost:3000/admin>.

### 5. Seed sample data

With the dev server stopped (so the seed has exclusive DB access) run:

```bash
npm run seed
```

This creates:

- 1 admin: `admin@rsipf.local` / `Password123!`
- 1 instructor: `instructor@rsipf.local` / `Password123!`
- 2 officers: `officer1@rsipf.local`, `officer2@rsipf.local` / `Password123!`
- 2 courses, each with 2 modules and 3 lessons
- 1 multi-question quiz on Course 1's first lesson

## Project layout

```
src/
├── access/              # Reusable Payload access-control helpers
├── app/
│   ├── (frontend)/      # Public UI: login, dashboard, courses, certificates, admin pages
│   ├── (payload)/       # Payload admin UI mount + REST routes
│   └── api/             # Custom Next.js route handlers (lesson complete, quiz submit, PDF)
├── collections/         # Payload collection configs (Users, Courses, …, Announcements)
├── components/          # Shared React components (NavBar, etc.)
├── lib/                 # Helpers (auth, email, certificate ID)
├── payload.config.ts    # Payload config wiring everything together
└── seed.ts              # Seed script
```

## Collections

| Collection      | Purpose                                                                |
| --------------- | ---------------------------------------------------------------------- |
| `users`         | Authenticated users (admin / instructor / officer) with RSIPF metadata |
| `media`         | Upload bucket for images, videos, PDFs (stored in MinIO via S3 plugin) |
| `courses`       | Course definitions and metadata                                        |
| `modules`       | Ordered groups of lessons within a course                              |
| `lessons`       | Individual learning items (video, document, or text)                   |
| `quizzes`       | Multi-choice quizzes attached to a lesson                              |
| `attempts`      | Read-only record of each quiz attempt                                  |
| `progress`      | Per-officer-per-course progress, lesson completion, completion date    |
| `certificates`  | Issued certificates with unique `RSIPF-YYYY-XXXXXX` number             |
| `announcements` | Targeted announcements (all / officers / instructors)                  |

## Access control

All authorisation is enforced through Payload access-control functions (no Next.js middleware):

- **admin** — full CRUD on every collection.
- **instructor** — can create and edit `courses`, `modules`, `lessons`, and `quizzes` they own; read-only access to officer `progress` and `attempts` for their courses.
- **officer** — can only read published courses assigned to their role; can create their own `attempts` and `progress`; can read their own `certificates`.

See `src/collections/*.ts` for per-collection rules and `src/access/roles.ts` for shared helpers.

## Frontend routes

| Route                                       | Who         | Purpose                                                                       |
| ------------------------------------------- | ----------- | ----------------------------------------------------------------------------- |
| `/login`                                    | Everyone    | Payload-backed sign-in                                                        |
| `/dashboard`                                | Signed in   | Role-aware dashboard (officer progress, instructor stats, admin system stats) |
| `/courses`                                  | Officer+    | Course catalogue                                                              |
| `/courses/[slug]`                           | Officer+    | Course overview with module + lesson tree and progress bar                    |
| `/courses/[slug]/lessons/[lessonId]`        | Officer+    | Lesson viewer (video / document / text) + “mark complete” button              |
| `/courses/[slug]/quiz/[quizId]`             | Officer+    | Timed multiple-choice quiz, submission, and result                            |
| `/certificates`                             | Officer+    | Earned certificates with PDF download                                         |
| `/admin/courses`                            | Admin/Instr | Course management (links into Payload admin)                                  |
| `/admin/users`                              | Admin       | User management                                                               |
| `/admin/reports`                            | Admin       | Recharts-powered reports (completion by unit, pass rates, active users)       |
| `/admin`                                    | Admin/Instr | Payload's built-in admin UI                                                   |

## Email notifications

`src/lib/email.ts` sends transactional email via Resend when:

- A course transitions to **published** (notifies all active officers — assignment).
- A `progress` record reaches 100% (certificate-issued email with cert number).
- An `attempt` is recorded as not passed (encouragement to retry).

In development, missing `RESEND_API_KEY` logs the email to the console instead.

## Certificates

When a `progress` record reaches 100%, an `afterChange` hook:

1. Generates a unique number in the format `RSIPF-YYYY-XXXXXX`.
2. Creates a matching `certificates` document.
3. Flips `progress.certificateIssued` to `true` and stamps `completedAt`.
4. Sends the certificate-issued email.

Officers download the PDF from `/certificates` — the file is rendered on demand by `src/app/api/certificates/[id]/pdf/route.ts` using `@react-pdf/renderer`.

## Server-side data fetching

All Next.js server components use Payload's **Local API** (`getPayload({ config })`) via the `requireUser` / `getCurrentUser` helpers in `src/lib/auth.ts`. No REST round-trips from the server.

## Mobile

The Tailwind layouts use responsive grids and stack cleanly down to phone widths — handy for officers accessing training in the field.

## Deploy to Vercel

The same code runs on Vercel against managed Postgres + S3-compatible storage. Only the environment variables differ.

### 1. Managed Postgres (Neon)

Create a project on [Neon](https://neon.tech). On the **Connection Details** tab, copy the **pooled** connection string (the hostname ends in `-pooler.…`). Vercel's serverless functions open one Postgres connection per cold invocation; the pooler endpoint is what keeps you under the connection cap.

```
DATABASE_URI=postgresql://USER:PASSWORD@ep-xxx-pooler.region.aws.neon.tech/rsipf_lms?sslmode=require
```

### 2. Media storage (Google Cloud Storage via the S3-compatible API)

The same `@payloadcms/storage-s3` plugin we use against MinIO locally also works against GCS — GCS exposes an S3-compatible XML API on `https://storage.googleapis.com`.

```bash
# Replace PROJECT and pick a bucket name.
gcloud storage buckets create gs://rsipf-lms-media --project=PROJECT --location=AUSTRALIA-SOUTHEAST1 --uniform-bucket-level-access

# Generate HMAC interoperability keys (these become S3_ACCESS_KEY / S3_SECRET_KEY).
gcloud storage hmac create SERVICE_ACCOUNT_EMAIL --project=PROJECT
```

The plugin enables **direct browser → bucket uploads** (`clientUploads: true`), which means the bucket needs CORS allowing your Vercel origin:

```bash
cat > /tmp/cors.json <<'EOF'
[{"origin":["https://learn.rsipf.orgclinic.com.sb"],"method":["GET","PUT","POST","HEAD"],"responseHeader":["Content-Type","ETag"],"maxAgeSeconds":3600}]
EOF
gcloud storage buckets update gs://rsipf-lms-media --cors-file=/tmp/cors.json
```

### 3. Vercel project

Push the repo to GitHub, then on Vercel:

1. **Add New → Project**, pick the repo. Vercel detects Next.js automatically; no build settings to change.
2. Set environment variables (Project Settings → Environment Variables):

   | Key | Value |
   | --- | --- |
   | `DATABASE_URI` | Neon pooled connection string |
   | `PAYLOAD_SECRET` | long random string |
   | `RESEND_API_KEY` | from resend.com |
   | `RESEND_FROM_EMAIL` | verified sender address |
   | `NEXT_PUBLIC_SERVER_URL` | `https://learn.rsipf.orgclinic.com.sb` |
   | `S3_ENDPOINT` | `https://storage.googleapis.com` |
   | `S3_REGION` | `auto` (GCS ignores it; any value is fine) |
   | `S3_BUCKET` | `rsipf-lms-media` |
   | `S3_ACCESS_KEY` | HMAC access key from step 2 |
   | `S3_SECRET_KEY` | HMAC secret from step 2 |

3. Deploy.

### 4. Custom domain

In **Project → Settings → Domains** add `learn.rsipf.orgclinic.com.sb`. Vercel shows the DNS record it expects. In **Google Cloud DNS** add the matching CNAME (or A/AAAA pair):

```
learn.rsipf.orgclinic.com.sb.   CNAME   cname.vercel-dns.com.
```

Vercel issues the TLS cert automatically once the record propagates.

### 5. First-run seeding

The `npm run seed` script connects directly to Postgres, so run it locally against the **same Neon database** (set `DATABASE_URI` to the Neon string in `.env`) once before going live:

```bash
DATABASE_URI=postgresql://...neon... npm run seed
```

### Local-only files

`compose.local.yml`, anything under `media/`, and any `.tmp-*` debug artifacts are excluded from the Vercel deploy via `.vercelignore`.

## Scripts

| Command         | Description                                |
| --------------- | ------------------------------------------ |
| `npm run dev`   | Start Next.js + Payload in dev mode        |
| `npm run build` | Production build                           |
| `npm run start` | Run the production build                   |
| `npm run seed`  | Populate the database with sample data     |
| `npm run lint`  | Lint                                       |

## License

Internal use — Royal Solomon Islands Police Force.
