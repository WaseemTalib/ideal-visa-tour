# Toasts

Custom in-house toast system. **No external library.** Earlier attempts with sonner and react-toastify both fought us — sonner had no built-in progress bar, react-toastify v11 had a StrictMode regression that snapped toasts in < 1s. Building our own took 80 lines and made both problems disappear.

## Files

- `lib/toast.ts` — module-level state + emitter + public API
- `components/toaster.tsx` — `<Toaster />` mounted in `app/layout.tsx`. Renders into `document.body` via `createPortal`.

## API

```ts
import { toast } from "@/lib/toast";

toast.success("Saved");
toast.error("Could not save");
toast.info("Heads up");
toast.warning("Subscription expiring");
toast.default("Note");

// custom duration (default 5000ms)
toast.success("Long message", { duration: 10000 });

// programmatic dismiss
const id = toast.error("Connection lost");
toast.dismiss(id);

// nuke all
toast.dismissAll();
```

## Why it doesn't snap

- Toasts live in **module-level state**, not in React state subscribed via `useEffect`. StrictMode's double-mount doesn't touch the queue.
- Each `<ToastItem>` mounts → starts a `setTimeout(dismiss, remaining)`. On hover, `paused` flips and the effect re-runs to capture elapsed time; on mouse-leave it resumes from where it left off.
- The container uses `useSyncExternalStore` for SSR-safe subscription — no `setState`-in-effect lint warning.

## Variants and colors

Modern, vibrant palette (intentionally not the dark-maroon Tailwind 600s):

| Variant | Background | Text | Progress bar | Icon |
|---|---|---|---|---|
| success | `emerald-500` | white | white/70 | `CheckCircle2` |
| error | `rose-500` | white | white/70 | `XCircle` |
| info | `sky-500` | white | white/70 | `Info` |
| warning | `amber-400` | slate-900 | slate-900/40 | `TriangleAlert` |
| default | `slate-800` | white | white/60 | `Info` |

If you want different colors, edit `VARIANT_BG`, `VARIANT_BAR`, `VARIANT_ICON` in `components/toaster.tsx`.

## Features

- **Progress bar** at the bottom of every toast, animated via CSS `scaleX(1) → scaleX(0)` over the toast's `duration`. Pauses on hover (`animationPlayState: paused`).
- **Close button** (×) — always visible at 80% opacity, brightens on hover. Click dismisses immediately.
- **Hover-to-pause** on both the dismiss timer AND the progress bar, so the countdown stays honest.
- **Slide-in entry** from the right via `animate-toast-in` (keyframes in `globals.css`).
- **Stack** at the top-right; max width 320px; respects `max-w-[calc(100vw-2rem)]` so it doesn't overflow mobile.

## Where they fire

| Surface | Trigger |
|---|---|
| Login | success on signed-in, error on failure |
| Logout | success on logged-out, error on failure |
| Register | success/error from server action's `state` |
| Inquiry submission | success/error from server action's `state` |
| Any dashboard save form (package/location/testimonial/content/password) | success/error via `FormFeedback` |
| Delete buttons (package/location/testimonial/inquiry/user) | optimistic success on confirm |
| Approve / Reject user | optimistic success / error on confirm |
| Status toggle (enable/disable user) | optimistic success / warning on confirm |
| Inquiry status update | success on submit |
| Image upload | success on 2xx, error on failure |

For comprehensive coverage, see [forms.md](./forms.md) — pattern #1 forms wire toasts via `FormFeedback`, pattern #2 (void delete/status actions) fire optimistic toasts in the trigger components.

## Common pitfalls

- **Don't import `toast` at module scope outside `app/`**. The emitter is client-only; importing it into a server file works (it's just JS state) but calling `toast.success(...)` on the server is a no-op.
- The progress bar animation is keyed by `toast.duration`. Changing the default duration without updating the CSS variable is fine — the inline style passes `${toast.duration}ms` directly.
- Adding a new variant: edit all three records in `components/toaster.tsx` (BG, BAR, ICON) and the `ToastVariant` union in `lib/toast.ts`.
