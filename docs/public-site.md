# Public site

Marketing surface for browsing packages and submitting inquiries.

## Routes

| Path | Purpose |
|---|---|
| `/` | Home — hero, search form, featured packages, group packages, popular destinations, "How it works", visa-friendly countries, why-choose-us strip, testimonials, gallery, CTA |
| `/packages` | Filterable package list with search + chip-style destination filter |
| `/packages/[slug]` | Package detail — gallery, itinerary, included/excluded, inquiry form, related packages |
| `/group-packages` | Group-only package list + "how group tours work" + "what's included" |
| `/about` | Brand pillars, process steps, FAQ |
| `/contact` | Contact details, office hours, FAQ, inquiry form, Google Maps embed |

Every route in this list uses `export const dynamic = "force-dynamic"` because they all read `getCurrentUser()` to decide whether to show agent prices (see below). Build-time prerendering is skipped to avoid DB hits at build.

## Shared widgets (`components/public/`)

- `navbar.tsx` — async server component. Reads `getCurrentUser()`. Shows `<LogoutButton />` if signed in.
- `footer.tsx` — async server component. Reads session + site settings. Hides the "Login" link when signed in. Renders social icons (Facebook / Instagram / TikTok inline SVGs — lucide doesn't ship Facebook/Instagram).
- `package-card.tsx` — takes `showAgentPrice` prop; renders the agent-price pill when true and `pkg.agent_price != null`.
- `search-form.tsx` — frosted glass search box; client-side `useRouter().push("/packages?...")`.

## Agent pricing visibility

Any signed-in profile (admin OR approved user) gets the agent price visible on cards and on `/packages/[slug]`. Each page does:

```ts
const session = await getCurrentUser();
const showAgentPrice = !!session;
```

Then passes `showAgentPrice={showAgentPrice}` to every `<PackageCard />`. The detail page additionally renders an extra "Agent price" Stat tile when both `showAgentPrice` and `pkg.agent_price != null`.

## Inquiry submission

`components/forms/inquiry-form.tsx` uses `useActionState(createInquiryAction)`. The action:

- Echoes submitted `values` back on error so form fields aren't cleared.
- Inquiry form uses `key={…}` based on the action state to remount and reseed `defaultValue`s — preserves typing on error, clears on success.
- Phone is required, email is optional (deliberate per business choice).

## Branding tokens

Defined in `app/globals.css`:

- Colors: `coral-500/600`, `sand-50/100`, `ink-900` extend Tailwind 4's palette via `@theme {}`.
- Shadows: `shadow-soft`, `shadow-lift`.
- Animations: `fade-up`, `fade-in`, `slide-down`, `float`, `shimmer`, `toast-in`, `toast-shrink`. All respect `prefers-reduced-motion`.
- Utility classes: `.text-gradient-teal`, `.text-gradient-sunset`, `.bg-grid`.

## Heading conventions

- Page/hero: `text-3xl sm:text-4xl lg:text-[3.25rem] font-bold tracking-tight`
- Section: `text-2xl sm:text-3xl font-bold tracking-tight`
- Eyebrow: `text-xs font-semibold uppercase tracking-[0.18em] text-teal-700` (or coral for sunset variants)
- Body: `text-base leading-relaxed text-slate-600`

**Don't use `font-extrabold`** — it reads too heavy across this theme.
