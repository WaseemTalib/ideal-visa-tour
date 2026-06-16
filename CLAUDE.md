@AGENTS.md

# Project context — Ideal Visa Tour

International tour & visa booking site: a public marketing/booking surface plus an admin dashboard for managing packages, locations, testimonials, inquiries, and site content. Single Next.js app.

## Stack

- **Next.js 16.2.7** (App Router, Turbopack) — has breaking changes vs training data, see AGENTS.md.
- **React 19.2** — use `useActionState`, `useFormStatus`, `useTransition`.
- **Tailwind CSS 4** with `@theme {}` tokens in `app/globals.css` (no `tailwind.config.js`).
- **Postgres + Drizzle ORM** — primary data store. Driver is `pg` (node-postgres) Pool wrapped by `drizzle-orm/node-postgres`. Works against local Postgres or any hosted provider (Neon/Supabase/Railway). Schema in `lib/db/schema.ts`, client in `lib/db/index.ts`, migrations in `drizzle/`. TLS toggles automatically based on `sslmode=require` in the URL.
- **Custom JWT auth** — email/password login against `profiles` table, bcrypt hash, `jose`-signed HS256 JWT in HTTP-only `auth_session` cookie (7-day expiry). Helpers in `lib/auth/jwt.ts` + `lib/auth/password.ts`. No Firebase Auth, no NextAuth.
- **Local file storage** — `/api/upload` writes images under `public/storage/<bucket>/`. Buckets: `package-images`, `location-images`, `testimonial-images`, `site-content`. URLs returned as `/storage/<bucket>/<file>`. No Firebase, no external storage. **Requires a writable filesystem on deploy** — Vercel serverless won't work, use a VPS / Render / Railway / `server.js` host.
- **Zod 4** for validation, **sonner** for toasts, **lucide-react** for icons.
- Deploy: **Vercel** hosts the Next app; Neon hosts Postgres; Firebase hosts Auth + Storage. Vercel root directory must be `.`, not `app/`.

## File layout

```
app/
  actions.ts            # All server actions (save/delete/status). Drizzle-backed.
  layout.tsx            # Root layout, mounts <Toaster />
  page.tsx              # Public home
  about, contact, group-packages, packages, packages/[slug]  # Public pages
  login/                # Admin login (Firebase Auth client → session cookie)
  dashboard/            # Protected (layout calls requireAdmin())
    loading.tsx
    packages/[id]/edit, packages/new
  api/
    auth/session        # POST id token → admin session cookie
    auth/signout
    upload              # Storage uploads via Firebase Admin
lib/
  db/
    schema.ts           # All Drizzle table defs + enums + inferred types
    index.ts            # db() lazy singleton — Neon HTTP driver
  data.ts               # All Postgres reads via Drizzle (joins for locations)
  auth.ts               # requireAdmin() — verifies JWT cookie + queries `profiles`
  auth/
    jwt.ts              # signSession / verifySession (jose, HS256, 7d)
    password.ts         # hashPassword / verifyPassword (bcryptjs, cost 12)
  validations.ts        # Zod schemas
  utils.ts              # cn, slugify, formatCurrency, formatDate, listFromText,
                        # itineraryFromText, extractMapSrc
components/
  ui/                   # Primitives: Input, Textarea, Select, Label, Button, Checkbox
  dashboard/            # PackageForm, LocationForm, TestimonialForm, ContentForm,
                        # FormFeedback, SubmitButton, DeleteButton, NavLink,
                        # InquiryStatusForm, UploadField, DashboardShell
  forms/                # InquiryForm (public), LoginForm
  public/               # Navbar, Footer, PackageCard, SearchForm
types/database.types.ts # Domain types (TravelPackage, Location, Inquiry, ...)
drizzle/                # Generated SQL migrations (committed)
drizzle.config.ts       # drizzle-kit config; reads DATABASE_URL
scripts/seed-postgres.mjs # `npm run db:seed` — populates Postgres + creates Firebase admin
```

## Data layer (`lib/db/`)

- `schema.ts` defines tables `locations`, `packages`, `inquiries`, `testimonials`, `site_settings`, `profiles`, and enums `package_type`, `inquiry_type`, `inquiry_status`, `profile_role`.
- IDs are `text` primary keys matching the human-readable slug-style IDs used previously (e.g. `istanbul`, `turkiye-classic-7-days`). New rows pick an ID by slugifying. Inquiries use `uuid` PKs since they're auto-generated.
- `packages.gallery_images`, `included`, `excluded` are `text[]`; `itinerary` is `jsonb` typed as `{day, title, detail}[]`.
- Foreign keys: `packages.from_location_id` / `to_location_id` → `locations.id` (`ON DELETE SET NULL`); `inquiries.package_id` → `packages.id` (`ON DELETE SET NULL`).
- `db()` is a lazy singleton returning a Drizzle client over a `pg.Pool`. Pool size defaults to 10; override with `DATABASE_POOL_MAX`. **Never** import the client at module top-level — only inside functions, otherwise build prerenders blow up when `DATABASE_URL` is absent.

## Reads (`lib/data.ts`)

- All reads use Drizzle. Location joins use `aliasedTable` for `from_loc` / `to_loc` aliases so a single SQL statement returns the joined `TravelPackage`.
- `getPackages(filters, publishedOnly)` applies all filters as SQL `WHERE` clauses — no more in-memory filtering. Composite indexes are fine here since Postgres handles them automatically.
- Timestamps are mapped to ISO strings via `toIso()` so the existing string-based UI keeps working.

## Server actions (`app/actions.ts`)

Three patterns coexist — match the right one when adding actions:

1. **Save actions** (`savePackageAction`, `saveLocationAction`, `saveTestimonialAction`, `saveSiteSettingsAction`, `createInquiryAction`):
   - Signature `(_prev, formData) => Promise<ActionResult>` where `ActionResult = { error?, success?, redirectTo? }`.
   - Used via `useActionState` in a **client wrapper component**.
   - Validation errors and Postgres errors return `{ error }` — never throw, never silently swallow.
   - On success include `redirectTo` if the form should navigate (e.g. package save → `/dashboard/packages`); otherwise the client wrapper calls `router.refresh()`.
   - `createInquiryAction` additionally echoes `values` in its result so the public InquiryForm keeps user input on failure (it remounts via `key` on each state change).
   - For inserts the new row's PK is the slug (or slugified name for testimonials). Edits route through the `editing` id read from the hidden `id` form field.
   - `saveSiteSettingsAction` upserts each key individually via `insert().onConflictDoUpdate(...)`.

2. **Delete and status actions** (`deletePackageAction`, `updateInquiryStatusAction`, ...):
   - Signature `(formData) => Promise<void>`.
   - Used with `<form action={fn}>` directly (no `useActionState`).
   - Wrap the trigger in `DeleteButton` (with `confirm` text) or `InquiryStatusForm` so it shows pending state via `useFormStatus`.

3. **`signOutAction`** — `() => void`, redirects to `/login`.

Other rules:
- Always call `await requireAdmin()` first in mutating actions. **Do NOT try/catch around it** — it uses Next's `redirect()` which throws `NEXT_REDIRECT`; catching swallows the redirect.
- Use `new Date()` for `updated_at` — Drizzle handles the conversion. `created_at` defaults to `NOW()` in the schema.
- After writes, `revalidatePath()` every public route that displays the data, plus the dashboard list page.

## Auth flow

- `/login` (client) POSTs email + password to `/api/auth/session` directly (no third-party SDK).
- The route looks up `profiles` by lowercased email, compares the bcrypt hash, checks `role === 'admin'`, signs a JWT with `sub`=profile id, then sets the `auth_session` HTTP-only cookie (`secure` in prod, `sameSite=lax`, 7-day `maxAge`).
- `lib/auth.ts#requireAdmin` reads the cookie, runs `verifySession` (jose `jwtVerify` against `JWT_SECRET`), then queries `profiles` by id to confirm `role === 'admin'`. Redirects to `/login` on any failure.
- Sign-out clears the cookie via `signOutAction` or `POST /api/auth/signout`. Cookie name is exported from `lib/auth.ts` as `SESSION_COOKIE` — use it instead of a string literal.
- First admin is created by `npm run db:seed` if `ADMIN_EMAIL` / `ADMIN_PASSWORD` are in `.env`. The script bcrypt-hashes the password and inserts the `profiles` row with `role='admin'` and a fresh `uuid` id.
- **`JWT_SECRET` must be ≥ 32 chars.** `signSession` / `verifySession` throw at runtime if it's missing or too short, so misconfiguration surfaces immediately at login.

## Validation (`lib/validations.ts`)

- Use `safeParse`, surface errors via the shared `describeZodError` helper in `app/actions.ts`.
- Don't validate IDs as UUIDs — they're slug-style strings (except inquiries, which are real UUIDs but the dashboard never edits those).
- Optional text/URL/number helpers at the top of validations.ts handle empty form fields without throwing.
- Required HTML form attributes (`required`, `minLength`, `pattern`) catch most issues client-side; server-side schemas are defense-in-depth.

## Migrations workflow

- Edit `lib/db/schema.ts`.
- `npm run db:generate` → drizzle-kit diffs the schema and writes a new SQL file in `drizzle/`. **Commit it.**
- `npm run db:migrate` to apply locally. Run the same in CI/production against the prod `DATABASE_URL`.
- `npm run db:push` is fine in early dev but skips committed migrations — don't use it on shared environments.

## Site settings keys (used by dashboard Content form)

`hero_title`, `hero_subtitle`, `hero_image`, `about_content`, `contact_phone`, `whatsapp`, `email`, `address`, `facebook`, `instagram`, `tiktok`, `google_maps_embed`, `homepage_cta`.

`google_maps_embed` stores the full iframe HTML pasted from Google Maps → Share → Embed; `extractMapSrc()` in `lib/utils.ts` pulls only the `src` and rejects anything that isn't a `https://www.google.com/maps/` URL before the contact page renders its own iframe.

## UI conventions

- **Headings:** `text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl` for page/section; hero `text-3xl sm:text-4xl lg:text-[3.25rem]`. **Do not use `font-extrabold`** — it reads heavy.
- **Eyebrow labels:** `text-xs font-semibold uppercase tracking-[0.18em] text-teal-700` (or coral for sunset variants).
- **Body copy:** `text-base leading-relaxed text-slate-600`.
- **Cards:** `rounded-2xl border border-slate-200/70 bg-white shadow-sm`. Hover: add `hover:-translate-y-0.5 hover:shadow-md`.
- **Buttons:** use the `Button` primitive — variants `default`, `secondary`, `outline`, `ghost`, `danger`. All gradient variants lift on hover (disabled state cancels the lift).
- **Form labels:** use `<Label required>` to render the red asterisk. Don't write `<label>` inline.
- **Checkboxes:** always use `<Checkbox label="..." description="..." />` from `components/ui/checkbox.tsx`. Never use bare `<input type="checkbox">`.
- **Toasts:** sonner is mounted in `app/layout.tsx`. Use `toast.success(...)` / `toast.error(...)`. Dashboard form feedback goes through the shared `FormFeedback` component, not direct toast calls in pages.
- **Gradients:** classes `.text-gradient-teal`, `.text-gradient-sunset`, and `.bg-grid` live in `globals.css`. Body background is a soft radial gradient — sections that need a solid surface use `bg-white`.
- **Animations:** `animate-fade-up`, `animate-fade-in`, `animate-slide-down`, `animate-float`, `animate-shimmer` (theme tokens in globals.css). Stagger hero content with `[animation-delay:120ms]`, `[animation-delay:240ms]`. Respects `prefers-reduced-motion`.
- **Loading states everywhere:** `SubmitButton` for form submits, `DeleteButton` for deletes, `NavLink` for in-app navigation, `app/dashboard/loading.tsx` and `app/packages/loading.tsx` for route segments. Never add a `<Link>` to the dashboard that doesn't go through `NavLink`.

## Common gotchas

- `<form action={serverAction}>` (without `useActionState`) requires the action to return `void`. Forms that need to show errors must go through `useActionState` + a client wrapper.
- React 19 + `useActionState` resets uncontrolled form fields after submission. For forms that must preserve user input on failure (currently only `InquiryForm`), echo submitted values back in the action result and key the form on the state object so it remounts with the echoed defaults.
- Lucide-react in this version **does not export `Facebook` or `Instagram`** icons — use the inline SVGs already in `components/public/footer.tsx`.
- Always import `Label`/`Input`/`Select`/`Textarea` from `@/components/ui/input` (single file) and `Checkbox` from `@/components/ui/checkbox`.
- `db()` from `lib/db` must only be called inside functions/server actions — never at module top-level — so the Vercel build can prerender pages without `DATABASE_URL` set.

## Verification

Always run before declaring work done:
```
npm run lint
npm run build
```
Build does the full TS check and prerenders all static routes — much stricter than dev.

## Memory

User-level facts (preferences, recurring guidance) live in `/Users/mac/.claude/projects/-Users-mac-Projects-Ideal-Visa-Tour/memory/`. Project-level architecture and conventions live in this file. Don't duplicate.
