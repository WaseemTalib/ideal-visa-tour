# Auth

Stateless JWT in an HTTP-only cookie. No session store, no Firebase, no NextAuth.

## Files

- `lib/auth.ts` — `getCurrentUser()`, `requireAdmin()`, exports `SESSION_COOKIE`
- `lib/auth/jwt.ts` — `signSession()` / `verifySession()` (`jose`, HS256, 7-day expiry, fails fast if `JWT_SECRET` is missing or < 32 chars)
- `lib/auth/password.ts` — `hashPassword()` / `verifyPassword()` (bcryptjs, cost 12)
- `app/api/auth/session/route.ts` — POST `{email, password}` → sets `auth_session` cookie + returns `{ ok, role }`
- `app/api/auth/signout/route.ts` — POST clears `auth_session`
- `app/actions.ts#signOutAction` — server action variant of signout
- `app/login/page.tsx` — redirects authenticated users away
- `app/registeruser/page.tsx` — public signup (role=user, status=false)
- `components/forms/login-form.tsx` — `fetch /api/auth/session`, role-based redirect (admin → /dashboard, user → /)
- `components/forms/register-form.tsx` — `useActionState(registerUserAction)`
- `components/dashboard/logout-button.tsx` — confirm dialog + POST signout + toast + `router.refresh()`

## Cookie

```
name:     auth_session
secure:   prod only
httpOnly: true
sameSite: lax
maxAge:   604800 (7 days)
```

## Login decision tree (`/api/auth/session`)

1. Lookup `profiles` by lowercased email.
2. `bcrypt.compare(password, password_hash)` — wrong → 401 "Invalid email or password."
3. `role !== 'admin' && !status` → 403 "Contact admin for account approval".
4. Sign JWT with `{ sub: profile.id, email, role }` → set cookie → respond `{ ok: true, role }`.

Admins bypass the status check (they're seeded; status is set by the migration backfill).

## requireAdmin()

Used in the dashboard layout and every mutating server action:

1. Read `auth_session` cookie → `verifySession()` → returns null if missing/invalid → `redirect("/login")`.
2. SELECT profile by `sub` from Postgres.
3. If profile missing or `role !== 'admin'` → `redirect("/login?error=admin-required")`.
4. Returns `{ profile, session }`.

**Do NOT try/catch around `requireAdmin()`** — it uses Next's `redirect()` which throws `NEXT_REDIRECT`; catching swallows the redirect.

## getCurrentUser()

Soft variant — verifies the JWT only (no DB hit). Returns the payload or null. Used by the navbar (to render Logout), the footer (to hide the Login link), the login/register page guards, and PackageCard agent-price visibility.

## Approval model

`profiles` has two flags:

- `status` (boolean) — currently active (login allowed)
- `approved_at` (timestamp, nullable) — has this user **ever** been approved

```
Pending    = role='user' AND approved_at IS NULL          → /dashboard/users "Pending" section
Approved   = role='user' AND approved_at IS NOT NULL      → /dashboard/users "Approved" table
Active     = status = true                                 → can log in
```

Approving a pending user sets BOTH `status=true` AND `approved_at=NOW()`. The toggle on the approved-users table only flips `status` — `approved_at` stays set, so the row stays in the approved table even while disabled.

## Common pitfalls

- `JWT_SECRET` < 32 chars → `signSession` throws at login. Always run `openssl rand -base64 48`.
- `requireAdmin()` inside a try/catch silently swallows redirects — never wrap it.
- After role change, the existing JWT is still valid until 7 days expire. `requireAdmin` re-queries the DB, so admin-side surfaces always see the latest. Public-side (`getCurrentUser`) trusts the JWT.
