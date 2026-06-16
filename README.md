# Ideal Visa Tour

International tour & visa booking website built with Next.js App Router, TypeScript, Tailwind CSS, **Postgres + Drizzle ORM** for data, **custom JWT auth** for admin login, **Firebase Storage** for image uploads, Server Actions, Zod, Lucide icons, and Sonner notifications.

## Architecture

- **Postgres** (local or hosted) accessed via **node-postgres (`pg`) + Drizzle ORM** — packages, locations, inquiries, testimonials, site settings, admin profiles (incl. password hashes).
- **Custom JWT** — admin login via bcrypt-hashed password, JWT issued by `app/api/auth/session`, stored in an HTTP-only cookie (`auth_session`). Verification via `jose`.
- **Firebase Storage** (Admin SDK only) — image uploads for packages, locations, testimonials, and hero image. **Firebase Auth is no longer used.**
- **Vercel** hosts the Next.js app. Project root must be `.` (not `app/`).

## 1. Database — Local Postgres (with pgAdmin)

These steps assume a local Postgres 16/17 install (matches your setup).

### Create the database in pgAdmin

1. Open **pgAdmin** → connect to your local server (usually `PostgreSQL 16` or `17`).
2. Right-click **Databases** → **Create** → **Database…**
3. Set:
   - **Database**: `ideal_visa_tour`
   - **Owner**: `postgres` (or any user you have a password for)
4. Click **Save**.

### Connection string format

```
postgresql://USER:PASSWORD@localhost:5432/ideal_visa_tour
```

Examples:

- `postgresql://postgres:postgres@localhost:5432/ideal_visa_tour`
- `postgresql://postgres:postgres@localhost:5433/ideal_visa_tour` (Postgres 17 default if 16 is on 5432)

Check the port pgAdmin shows for the server — Postgres 16 typically runs on `5432`, Postgres 17 on `5433` if both are installed side-by-side.

Paste it into `.env` as `DATABASE_URL`. No `sslmode=require` needed for local — the app skips TLS automatically when that parameter is absent.

### Hosted alternative

A managed Postgres (Neon, Supabase, Railway, RDS) works the same — paste the provider's connection string into `DATABASE_URL`. If the URL contains `sslmode=require`, the app turns on TLS automatically.

## 2. JWT secret

Generate a long random string and put it in `.env` as `JWT_SECRET`:

```bash
openssl rand -base64 48
```

Must be at least 32 characters. **Do not commit it.** Use a different secret in production (set it as a Vercel environment variable).

## 3. Firebase (Storage only)

1. Create a project at https://console.firebase.google.com.
2. **Storage** → create the default bucket. (You don't need Authentication.)
3. **Project Settings → Service accounts** → generate a private key. From the downloaded JSON, set:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (wrap in double quotes; keep the `\n` escapes)
4. Optionally set `FIREBASE_STORAGE_BUCKET` if your bucket name doesn't match `<project_id>.appspot.com`.

## 4. Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Required:

- `DATABASE_URL` — Neon (or any Postgres) connection string.
- `JWT_SECRET` — 32+ chars.
- `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` — for image uploads.

Optional but recommended:

- `NEXT_PUBLIC_SITE_URL` — your deployed URL (used for absolute metadata URLs).
- `ADMIN_EMAIL`, `ADMIN_PASSWORD` — `npm run db:seed` will create an admin with these credentials.

## 5. Run Migrations + Seed

```bash
npm install
npm run db:migrate      # applies drizzle/0000_init.sql to DATABASE_URL
npm run db:seed         # inserts sample data; creates the admin profile with bcrypt-hashed password
```

Useful extras:

- `npm run db:generate` — regenerate migration SQL after editing `lib/db/schema.ts`.
- `npm run db:push` — push schema directly (handy in dev; don't use on shared environments).
- `npm run db:studio` — open Drizzle Studio in the browser.

## 6. Run Locally

```bash
npm run dev
```

- Public site: http://localhost:3000
- Admin login: http://localhost:3000/login (use `ADMIN_EMAIL` / `ADMIN_PASSWORD`)

## 7. Deploy on Vercel

1. Push the project to GitHub.
2. Import in Vercel. **Root directory must be `.`** (the folder containing `package.json`).
3. Add all environment variables (`DATABASE_URL`, `JWT_SECRET`, all `FIREBASE_*`).
4. Set `NEXT_PUBLIC_SITE_URL` to your Vercel production URL.
5. Deploy.

Generated migrations in `drizzle/` are checked into the repo — run `npm run db:migrate` once against your production database (locally with prod `DATABASE_URL`, or via a CI step) when you push schema changes.

## Notes

- Passwords are bcrypt-hashed (cost factor 12) and stored in `profiles.password_hash`. Sessions are JWTs (`HS256`, 7-day expiration) carried in the `auth_session` HTTP-only cookie.
- Admin role is stored on `profiles.role`. `npm run db:seed` writes it on first run.
- Image uploads go through `/api/upload` which writes to Firebase Storage using the Admin SDK.
- No Express backend, no Docker, no SQL setup beyond the Drizzle migrations.
