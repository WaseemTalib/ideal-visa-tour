@AGENTS.md

# Ideal Visa Tour — quick reference

International tour & visa booking site: a public marketing/booking surface plus an admin dashboard. Single Next.js app, no separate backend service.

## Stack

- **Next.js 16.2.7** (App Router) — has breaking changes vs training data, see AGENTS.md.
- **React 19.2** — `useActionState`, `useFormStatus`, `useTransition`.
- **Tailwind CSS 4** with `@theme {}` tokens in `app/globals.css` (no `tailwind.config.js`).
- **Postgres + Drizzle ORM** — `pg` (node-postgres) Pool. TLS toggles automatically on `sslmode=require`.
- **Custom JWT auth** — bcrypt + `jose`. HTTP-only `auth_session` cookie, 7-day expiry. No Firebase, no NextAuth.
- **Local file storage** under `public/storage/<bucket>/`. No external storage.
- **Custom toast system** — `lib/toast.ts` + `components/toaster.tsx`. No external library.
- **Zod 4** for validation.
- Deploy: self-hosted on Hostinger (cPanel + PM2), driven by GitHub webhook → `deploy.sh`.

## File layout (high level)

```
app/
  actions.ts            # All server actions
  layout.tsx            # Root layout, mounts <Toaster />
  page.tsx, about, contact, group-packages, packages/, packages/[slug]
  login/, registeruser/
  dashboard/            # Admin (requireAdmin in layout)
  api/auth/session/, api/auth/signout/, api/upload/, api/webhook/
lib/
  db/                   # Drizzle schema + lazy db() singleton
  auth.ts, auth/jwt.ts, auth/password.ts
  data.ts               # All Postgres reads
  validations.ts        # Zod schemas
  utils.ts              # cn, slugify, formatCurrency, formatDate, etc.
  toast.ts              # Custom toast emitter
components/
  ui/                   # Primitives: Input, Textarea, Select, Label, Button, Checkbox, PasswordInput, ConfirmDialog
  dashboard/            # PackageForm, FormFeedback, DeleteButton, UserActionButton, StatusToggle, DashboardShell, ...
  forms/                # InquiryForm, LoginForm, RegisterForm
  public/               # Navbar, Footer, PackageCard, SearchForm
  toaster.tsx           # <Toaster />
types/database.types.ts
drizzle/                # Generated SQL migrations (committed)
drizzle.config.ts       # Loads .env via dotenv
scripts/seed-postgres.mjs, scripts/create-admin.mjs
docs/                   # Per-module deep docs — read these for detail
```

## Per-module docs (read these for detail)

Always check the matching doc in `docs/` before changing related code:

| Subsystem | Doc |
|---|---|
| Auth (login, register, JWT, requireAdmin, approval flow) | [docs/auth.md](docs/auth.md) |
| Database (schema, Drizzle, migrations, reads/writes) | [docs/database.md](docs/database.md) |
| Dashboard (admin pages, FormFeedback, DeleteButton, etc.) | [docs/dashboard.md](docs/dashboard.md) |
| Public site (home, packages, navbar, footer, agent pricing) | [docs/public-site.md](docs/public-site.md) |
| Forms + server actions + Zod (the 3 form patterns) | [docs/forms.md](docs/forms.md) |
| Toasts (custom system, colors, why no library) | [docs/toasts.md](docs/toasts.md) |
| Uploads (/api/upload, public/storage, UploadField) | [docs/uploads.md](docs/uploads.md) |
| Deployment (server.js, deploy.sh, webhook, PM2) | [docs/deployment.md](docs/deployment.md) |
| Doc index | [docs/README.md](docs/README.md) |

## Core conventions (cheat-sheet)

- **Headings:** `text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl`. Hero: `text-3xl sm:text-4xl lg:text-[3.25rem]`. Do **not** use `font-extrabold`.
- **Cards:** `rounded-2xl border border-slate-200/70 bg-white shadow-sm hover:-translate-y-0.5 hover:shadow-md`.
- **Eyebrow:** `text-xs font-semibold uppercase tracking-[0.18em] text-teal-700` (or coral).
- **Body:** `text-base leading-relaxed text-slate-600`.
- **Forms:** Always use `<Label required>` for the red asterisk and `<Checkbox label="..." description="..." />` from `components/ui/checkbox.tsx`. Import `Input/Label/Select/Textarea` from `@/components/ui/input` (single file). Password fields use `<PasswordInput />`.
- **Confirm before destructive actions:** wrap in `<ConfirmDialog>` from `components/ui/confirm-dialog.tsx`.
- **Toasts:** `import { toast } from "@/lib/toast"`. `toast.success / error / info / warning / default`.
- **Loading states:** `SubmitButton`, `DeleteButton`, `NavLink`, plus route-level `loading.tsx`. Every dashboard `<Link>` should go through `NavLink`.
- **Animations:** `animate-fade-up`, `-fade-in`, `-slide-down`, `-float`, `-shimmer`, `-toast-in` — defined as theme tokens. Respects `prefers-reduced-motion`.
- **Gradients:** `.text-gradient-teal`, `.text-gradient-sunset`, `.bg-grid` live in `globals.css`.

## Common gotchas

- `<form action={voidAction}>` requires the action to return `void`. Forms that need success/error UI must use `useActionState` + a client wrapper.
- React 19 + `useActionState` resets uncontrolled form fields on submit. To preserve input on error, echo `values` in the action result and key the form on the state object (see InquiryForm / RegisterForm).
- `lucide-react` in this version does NOT export `Facebook` or `Instagram` icons. Use the inline SVGs in `components/public/footer.tsx`.
- `db()` from `lib/db` must only be called inside functions/server actions, never at module top-level. Otherwise Vercel-style prerender breaks when `DATABASE_URL` is absent.
- **Never try/catch `requireAdmin()`** — it uses `redirect()` which throws `NEXT_REDIRECT`. Catching swallows the redirect.

## Verification before declaring work done

```
npm run lint
npm run build
```

Build does the full TS check and prerenders all static routes.

## Memory

User-level facts (preferences, recurring guidance) live in `/Users/mac/.claude/projects/-Users-mac-Projects-Ideal-Visa-Tour/memory/`. Project-level architecture and conventions live in `docs/` (and this file). Don't duplicate.
