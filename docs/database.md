# Database

Postgres accessed via **node-postgres (`pg`) + Drizzle ORM**. Works against local Postgres or any hosted provider (Neon/Supabase/Railway). TLS toggles automatically based on `sslmode=require` in the URL.

## Files

- `lib/db/schema.ts` — every table definition + enums + inferred TS types
- `lib/db/index.ts` — `db()` lazy singleton (returns `null` if `DATABASE_URL` missing), `requireDb()` (throws), `pg.Pool` wrapper
- `lib/data.ts` — every read query (`getPackages`, `getLocations`, `getProfiles`, `getInquiries`, `getSiteSettings`, etc.)
- `drizzle.config.ts` — drizzle-kit config; **loads `.env` via `dotenv`** so migrations work on servers that don't auto-load it
- `drizzle/*.sql` — generated, committed migrations
- `scripts/seed-postgres.mjs` — `npm run db:seed` — populates DB + creates admin
- `scripts/create-admin.mjs` — `npm run create-admin -- email pass [name]` — reusable admin upsert

## Tables

| Table | PK | Notes |
|---|---|---|
| `locations` | text | slug-style ID (`istanbul`, `dubai`) |
| `packages` | text | slug-style ID; `gallery_images/included/excluded` are `text[]`; `itinerary` is `jsonb` |
| `inquiries` | uuid | auto-generated; `package_id` FK with `ON DELETE SET NULL` |
| `testimonials` | text | slug-style ID |
| `site_settings` | key (text) | one row per setting key, value as text |
| `profiles` | uuid | `email` unique; `password_hash` bcrypt; `status` boolean; `approved_at` nullable |

Enums: `package_type` (normal/group), `inquiry_type` (contact/booking), `inquiry_status` (new/contacted/confirmed/rejected), `profile_role` (user/admin).

## Connection rules

- **Never** import the Drizzle client at module top-level. Only call `db()` / `requireDb()` inside server functions. Otherwise the build pre-renders pages without `DATABASE_URL` and blows up.
- `db()` returns null when env is missing → `lib/data.ts` reads degrade to empty results. This keeps build prerender working when env isn't set.
- Pool size defaults to 10; override with `DATABASE_POOL_MAX`.

## Reads pattern (`lib/data.ts`)

- Use `aliasedTable` for `from_loc` / `to_loc` joins in `getPackages` so a single SQL statement returns the joined `TravelPackage`.
- All timestamps mapped to ISO strings via `toIso()`.
- Filters become SQL `WHERE` clauses, not in-memory `.filter()` — let Postgres do its job.
- Search filter (`searchFilter()` in users page) uses `ILIKE` with `OR` across `email` and `coalesce(full_name, '')`.

## Writes pattern (`app/actions.ts`)

- Always `await requireAdmin()` first.
- Use `new Date()` for `updated_at` — Drizzle handles conversion. `created_at` defaults to `NOW()` in schema.
- After writes, `revalidatePath()` every public route AND the dashboard list page that displays the data.
- `saveSiteSettingsAction` upserts each key with `.insert().onConflictDoUpdate(...)`.

## Migrations workflow

1. Edit `lib/db/schema.ts`.
2. `npm run db:generate` → drizzle-kit diffs schema and writes a new SQL file in `drizzle/`. **Commit it.**
3. For migrations that need a backfill (`0002_add_user_status.sql`, `0003_add_approved_at.sql`), **hand-edit** the generated SQL to add an `UPDATE` after the `ALTER` using `--> statement-breakpoint` as separator.
4. `npm run db:migrate` to apply locally.
5. On deploy, `deploy.sh` runs `npm run db:migrate` against `$DATABASE_URL` from `.env`.
6. **`npm run db:push`** skips committed migrations — only use in early dev on a throw-away DB.

## Current migration log

| File | What |
|---|---|
| `0000_init.sql` | Creates all tables and enums |
| `0001_add_agent_price.sql` | `packages.agent_price` (int, nullable) |
| `0002_add_user_status.sql` | `profiles.status` (bool, not null default false) + backfill admins to true |
| `0003_add_approved_at.sql` | `profiles.approved_at` (timestamptz) + backfill currently-active rows |

## Common pitfalls

- `db:migrate` failing with `url: ''` → `.env` not present on the server. `drizzle.config.ts` already loads via `dotenv`; just ensure `.env` exists at `$APP_DIR`.
- Forgetting to commit a new `drizzle/*.sql` → live DB stays behind, runtime "column does not exist" errors → API routes return non-JSON 500 → "Unexpected end of JSON input" in the browser.
- Slug-style PKs are validated as plain strings, **not** as UUIDs. Inquiries are the exception.
