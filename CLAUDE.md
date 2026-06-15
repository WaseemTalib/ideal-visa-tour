@AGENTS.md

# Project context — Ideal Visa Tour

Tour & Travel booking site: a public marketing/booking surface plus an admin dashboard for managing packages, locations, testimonials, inquiries, and site content. Single Next.js app, no separate backend service.

## Stack

- **Next.js 16.2.7** (App Router, Turbopack) — has breaking changes vs training data, see AGENTS.md.
- **React 19.2** — use `useActionState`, `useFormStatus`, `useTransition`.
- **Tailwind CSS 4** with `@theme {}` tokens in `app/globals.css` (no `tailwind.config.js`).
- **Firebase** — Firestore (DB), Auth (admin login via session cookie), Storage (image uploads), Admin SDK on the server.
- **Zod 4** for validation, **sonner** for toasts, **lucide-react** for icons.
- Deploy: **Vercel** hosts the Next app; Firebase is backend only. Vercel root directory must be `.`, not `app/`.

## File layout

```
app/
  actions.ts            # All server actions (save/delete/status). Single file.
  layout.tsx            # Root layout, mounts <Toaster />
  page.tsx              # Public home
  about, contact, group-packages, packages, packages/[slug]  # Public pages
  login/                # Admin login (Firebase Auth client → session cookie)
  dashboard/            # Protected (layout calls requireAdmin())
    loading.tsx         # Route-segment loader
    packages/[id]/edit  # Edit form
    packages/new        # Create form
  api/
    auth/session        # POST id token → admin session cookie
    auth/signout
    upload              # Storage uploads via Firebase Admin
lib/
  firebase/admin.ts     # adminDb() / adminAuth() / nowTimestamp(). Returns null if env missing.
  firebase/client.ts    # firebaseAuth() for the login form
  data.ts               # All Firestore reads (getPackages, getLocations, ...)
  auth.ts               # requireAdmin() — redirects on failure (throws NEXT_REDIRECT)
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
scripts/setup-firebase.mjs # `npm run db:setup` seeds Firestore
firebase.json, firestore.rules, firestore.indexes.json
```

## Server actions (`app/actions.ts`)

Three patterns coexist — match the right one when adding actions:

1. **Save actions** (`savePackageAction`, `saveLocationAction`, `saveTestimonialAction`, `saveSiteSettingsAction`, `createInquiryAction`):
   - Signature `(_prev, formData) => Promise<ActionResult>` where `ActionResult = { error?, success?, redirectTo? }`.
   - Used via `useActionState` in a **client wrapper component**.
   - Validation errors and Firestore errors return `{ error }` — never throw, never `console.warn` + bare `return`.
   - On success include `redirectTo` if the form should navigate (e.g. package save → `/dashboard/packages`); otherwise the client wrapper calls `router.refresh()`.
   - `createInquiryAction` additionally echoes `values` in its result so the public InquiryForm keeps user input on failure (it remounts via `key` on each state change).

2. **Delete and status actions** (`deletePackageAction`, `updateInquiryStatusAction`, ...):
   - Signature `(formData) => Promise<void>`.
   - Used with `<form action={fn}>` directly (no `useActionState`).
   - Wrap the trigger in `DeleteButton` (with `confirm` text) or `InquiryStatusForm` so it shows pending state via `useFormStatus`.

3. **`signOutAction`** — `() => void`, redirects to `/login`.

Other rules:
- Always call `await requireAdmin()` first in mutating actions. **Do NOT try/catch around it** — it uses Next's `redirect()` which throws `NEXT_REDIRECT`; catching swallows the redirect.
- Always null-check `adminDb()` — it returns null when Firebase env vars are missing.
- Use `nowTimestamp()` for `created_at` / `updated_at`.
- After writes, `revalidatePath()` every public route that displays the data, plus the dashboard list page.

## Validation (`lib/validations.ts`)

- Use `safeParse`, surface errors via the shared `describeZodError` helper in `app/actions.ts`.
- Don't validate Firestore IDs as UUIDs — they're arbitrary strings (slugs, document IDs).
- Optional text/URL/number helpers at the top of validations.ts handle empty form fields without throwing.
- Required HTML form attributes (`required`, `minLength`, `pattern`) catch most issues client-side; server-side schemas are defense-in-depth.

## Auth flow

- `/login` (client) signs in with Firebase Auth, posts the ID token to `/api/auth/session`, which calls `adminAuth().createSessionCookie()` and sets `firebase_session` HTTP-only cookie.
- `lib/auth.ts#requireAdmin` verifies the cookie and confirms `profiles/{uid}.role === "admin"` in Firestore.
- Admin role is **set in Firestore** (`profiles/<uid>` doc), not in Firebase Auth claims. Firebase Auth Console has no role UI for this.

## Data layer (`lib/data.ts`)

- All Firestore reads centralized here.
- `getPackages()` does location joins **in memory** to avoid composite-index setup. Do not add `.where()` chains that need indexes.
- Timestamps normalized to ISO strings via `toIso()`.
- `getSiteSettings()` collects `siteSettings/<key>` docs into a flat record.

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

## Verification

Always run before declaring work done:
```
npm run lint
npm run build
```
Build does the full TS check and prerenders all static routes — much stricter than dev.

## Memory

User-level facts (preferences, recurring guidance) live in `/Users/mac/.claude/projects/-Users-mac-Projects-Ideal-Visa-Tour/memory/`. Project-level architecture and conventions live in this file. Don't duplicate.
