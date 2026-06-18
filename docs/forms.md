# Forms, validation, and server actions

Three coexisting form patterns. Pick the right one — mismatching them is the #1 source of bugs in this area.

## 1. Save actions — `useActionState` + client wrapper

Used by every dashboard save form (`PackageForm`, `LocationForm`, `TestimonialForm`, `ContentForm`, `ChangePasswordForm`) and the public `InquiryForm` / `RegisterForm`.

Action signature:

```ts
(_prev: ActionResult | null, formData: FormData) => Promise<ActionResult>
```

Where `ActionResult = { error?: string; success?: string; redirectTo?: string; values?: unknown }`.

Client form:

```tsx
const [state, formAction] = useActionState(action, null);
return (
  <form action={formAction}>
    <FormFeedback state={state} />
    ...
  </form>
);
```

`FormFeedback` (dashboard) fires `toast.success` / `toast.error`, then calls `router.push(state.redirectTo)` if present, else `router.refresh()`. Public forms (Inquiry, Register) wire their own `useEffect → toast` from `state`.

## 2. Delete + status actions — bare `<form action={fn}>`

Used by every "no-arg, void return" action: `deletePackageAction`, `deleteLocationAction`, `deleteTestimonialAction`, `deleteInquiryAction`, `deleteUserAction`, `approveUserAction`, `enableUserAction`, `disableUserAction`, `updateInquiryStatusAction`.

Action signature: `(formData: FormData) => Promise<void>`.

Trigger components wrap the form and supply:

- A confirm dialog (`ConfirmDialog`) shown before submit.
- An **optimistic** `toast.success` / `toast.warning` / `toast.error` fired the moment the user confirms (before the action runs server-side). If the action quietly fails, the toast was wrong — but the void-return pattern can't surface success/error, so optimism is the trade-off.

Trigger components:

- `DeleteButton` (`components/dashboard/delete-button.tsx`)
- `UserActionButton`
- `StatusToggle`
- `InquiryStatusForm`

## 3. Sign-out — fire-and-forget server action

`signOutAction()` in `app/actions.ts` — `() => void`, just deletes the cookie. Called by `LogoutButton` via `fetch /api/auth/signout` (the API route is preferred over the action so we can show a toast and `router.refresh()` in sequence).

## Validation — Zod (`lib/validations.ts`)

Schemas: `packageSchema`, `locationSchema`, `testimonialSchema`, `inquirySchema`, `registerSchema`, `changePasswordSchema`.

Use `.safeParse(...)` and surface the first issue via the shared `describeZodError` helper in `app/actions.ts`. Never throw.

Helpers at the top:

- `optionalText` — `string | null`, trimmed
- `optionalUrl` — accepts `""` or a valid `http(s)://...`
- `optionalPositiveInt` — accepts `""` / `null` / `number`, returns nullable int

**Don't validate IDs as UUIDs** — they're slug-style strings everywhere except `inquiries.id`.

HTML5 attributes (`required`, `minLength`, `pattern`) catch most issues client-side; the Zod schema is defense-in-depth.

## Required-field UX

- Use `<Label required>` from `components/ui/input.tsx` to render the red asterisk. Don't write `<label>` inline.
- Inputs/Select/Textarea exported from the same file.
- Checkboxes: use `<Checkbox label="..." description="..." />` from `components/ui/checkbox.tsx`. **Never** use a bare `<input type="checkbox">` — it'll look out of theme.

## Preserving input on error (React 19 quirk)

`useActionState` resets uncontrolled form fields on submission completion. For forms where users must not lose typing on validation error:

1. Echo `values` back in the action's `ActionResult`.
2. Render `defaultValue={defaults[field]}`.
3. Set `key={state ? ... : "fresh"}` so the form remounts on each result, picking up new defaults.

See `InquiryForm` and `RegisterForm` for working examples.

## Common pitfalls

- Wrapping `requireAdmin()` in `try/catch` swallows `NEXT_REDIRECT`. Don't.
- `<form action={voidAction}>` requires the action to return `void`. If you want to show success/error messages, switch to pattern #1.
- For pattern #2 the toast fires **before** the action runs server-side. Don't rely on it as proof of completion.
