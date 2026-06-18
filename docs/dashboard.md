# Dashboard

Admin-only area at `/dashboard/*`. Layout calls `requireAdmin()` which redirects non-admins to `/login`. Every route in this subtree is `export const dynamic = "force-dynamic"` (declared on the layout).

## Routes

| Path | Purpose |
|---|---|
| `/dashboard` | Overview: metric cards (packages, group packages, inquiries, featured), recent inquiries, upcoming group tours |
| `/dashboard/packages` + `[id]/edit` + `/new` | Package CRUD via `PackageForm` |
| `/dashboard/group-packages` | Read-only view of `type='group'` packages |
| `/dashboard/locations` | Location CRUD via `LocationForm` |
| `/dashboard/testimonials` | Testimonial CRUD via `TestimonialForm` |
| `/dashboard/inquiries` | Inquiry list, status updater, delete |
| `/dashboard/users` | User approval workflow (see auth.md) |
| `/dashboard/content` | Site settings (hero, contact, social, map) via `ContentForm` |
| `/dashboard/account` | Admin password change via `ChangePasswordForm` |

## Shared widgets (`components/dashboard/`)

- `dashboard-shell.tsx` — sidebar + nav + `<LogoutButton />` slot at the bottom
- `form-feedback.tsx` — render-null component that fires `toast.success` / `toast.error` from an `ActionResult` and calls `router.push(redirectTo)` or `router.refresh()` on success
- `submit-button.tsx` — uses `useFormStatus` to flip to a loading spinner
- `delete-button.tsx` — opens a `ConfirmDialog`; fires optimistic `toast.success(successMessage)` on confirm
- `user-action-button.tsx` — generic button-with-confirm-dialog; picks success/error toast color from `variant`
- `status-toggle.tsx` — iOS-style switch + confirm dialog; pauses CSS animation if disabled (own row)
- `inquiry-status-form.tsx` — dropdown + Update button; toasts on submit
- `nav-link.tsx` — `useTransition`-driven Link that shows a spinner during navigation
- `upload-field.tsx` — `<input type=file>` + URL field; POSTs to `/api/upload`; toasts on result
- `change-password-form.tsx`, `package-form.tsx`, `location-form.tsx`, `testimonial-form.tsx`, `content-form.tsx` — `useActionState` client wrappers around server actions

## Sidebar

`DashboardShell` is a client component. Each nav link uses `useTransition` so the icon swaps to a spinner during route navigation. Active route gets a teal background. Logout is a `<LogoutButton />` at the bottom.

## Patterns

- **Save actions**: signature `(_prev, FormData) => Promise<ActionResult>`, wired through `useActionState` in a client form wrapper. `FormFeedback` shows toasts and handles redirect/refresh.
- **Delete / status actions**: signature `(FormData) => Promise<void>`, used with `<form action={fn}>`. The trigger component handles confirm dialog + optimistic toast.
- All mutating actions start with `await requireAdmin()`.
- After every write, `revalidatePath()` the public AND dashboard paths that show the data.

## User approval flow (highlight)

1. User registers at `/registeruser` → row in `profiles` with `role='user'`, `status=false`, `approved_at=NULL`.
2. Admin opens `/dashboard/users` → row appears in **Pending approvals**.
3. Approve → `status=true` AND `approved_at=NOW()`. Row moves to **Approved users** table.
4. Toggle in approved table → flips `status`. Row stays where it is.
5. User can log in only while `status=true`.

The approved-users table uses server-side pagination (10 per page), `?q=` for search across email + name. Admins are excluded by `role='user'`.
