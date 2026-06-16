# Ideal Visa Tour

International tour & visa booking website built with Next.js App Router, TypeScript, Tailwind CSS, **Postgres + Drizzle ORM** for data, **custom JWT auth** for admin login, and **local file storage** under `public/storage/` for image uploads. Server Actions, Zod, Lucide icons, and Sonner notifications round it out.

## Architecture

- **Postgres** (local or hosted) accessed via **node-postgres (`pg`) + Drizzle ORM** — packages, locations, inquiries, testimonials, site settings, admin profiles (incl. password hashes).
- **Custom JWT** — admin login via bcrypt-hashed password, JWT issued by `app/api/auth/session`, stored in an HTTP-only cookie (`auth_session`). Verification via `jose`.
- **Local file storage** — `/api/upload` writes images under `public/storage/<bucket>/` and returns `/storage/<bucket>/<file>` URLs. Buckets: `package-images`, `location-images`, `testimonial-images`, `site-content`. No third-party storage required.
- Deploy: any Node host that has a writable filesystem (your own server, VPS, Render Web Service, Hostinger, cPanel, Plesk). **Vercel does not work for uploads** because its serverless filesystem is read-only — see the deployment note at the bottom.

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

## 3. File storage

Uploaded images are saved directly under `public/storage/` and served by Next from the same site:

- Path: `public/storage/<bucket>/<safe-name>-<random>.<ext>`
- Public URL: `/storage/<bucket>/<filename>`
- Buckets: `package-images`, `location-images`, `testimonial-images`, `site-content`
- Limits: 5 MB per file, accepted MIME types are `image/jpeg`, `image/png`, `image/webp`, `image/gif`, `image/svg+xml`.

The `public/storage/` directory is committed to git as empty folders (`.gitkeep`); uploaded binaries themselves are gitignored.

No external storage service or API keys are required.

## 4. Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Required:

- `DATABASE_URL` — Postgres connection string (local or hosted).
- `JWT_SECRET` — 32+ chars.

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

## 7. Deploy

This stack needs a host with a **writable filesystem** because uploads land under `public/storage/`. Good fits:

- Your own VPS / cPanel / Plesk / Hostinger Node hosting (use `server.js` as the entry point)
- Render Web Service, Railway, Fly.io, DigitalOcean App Platform, Azure App Service

Deployment steps (any host):

1. Push to GitHub.
2. Set environment variables on the host: `DATABASE_URL`, `JWT_SECRET`, `NEXT_PUBLIC_SITE_URL`, optional `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
3. Build command: `npm run build`. Start command: `npm start` (or `node server.js`).
4. Run `npm run db:migrate` once against the production `DATABASE_URL`.

Generated migrations in `drizzle/` are checked into the repo — run `npm run db:migrate` again whenever you push schema changes.

### Heads-up about Vercel

Vercel's serverless functions have a **read-only filesystem**, so `/api/upload` cannot write to `public/storage/` there. If you want to deploy on Vercel, you'll need to swap the upload route to an object storage backend (Cloudflare R2, AWS S3, UploadThing, Supabase Storage). The rest of the app (Postgres, JWT auth, public site, dashboard) runs on Vercel without changes.

## Notes

- Passwords are bcrypt-hashed (cost factor 12) and stored in `profiles.password_hash`. Sessions are JWTs (`HS256`, 7-day expiration) carried in the `auth_session` HTTP-only cookie.
- Admin role is stored on `profiles.role`. `npm run db:seed` writes it on first run.
- Image uploads go through `/api/upload` which saves files under `public/storage/<bucket>/`.
- No Express backend, no Docker, no SQL setup beyond the Drizzle migrations.
