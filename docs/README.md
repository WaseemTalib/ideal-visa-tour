# Project context docs

Each subsystem has its own focused doc. Start with whichever matches the task.

| Doc | Read when… |
|---|---|
| [auth.md](./auth.md) | Touching login, register, signup approval, JWT, sessions, `requireAdmin`, role/status logic |
| [database.md](./database.md) | Editing the schema, writing a query, generating a migration, debugging a connection issue |
| [dashboard.md](./dashboard.md) | Adding/editing admin pages, working with `FormFeedback`, `DeleteButton`, `UserActionButton`, `StatusToggle` |
| [public-site.md](./public-site.md) | Editing the marketing pages, `<PackageCard>`, `<Navbar>`, `<Footer>`, agent-price visibility |
| [forms.md](./forms.md) | Writing a new server action, picking between save / void / signout patterns, using Zod, preserving input on error |
| [toasts.md](./toasts.md) | Firing a toast, changing toast colors, adding a new variant, understanding why we don't use react-toastify |
| [uploads.md](./uploads.md) | Image upload route, `<UploadField>`, the `public/storage/` layout, deploy implications |
| [deployment.md](./deployment.md) | Server setup, `deploy.sh`, GitHub webhook, PM2, troubleshooting a failed deploy |

The top-level `CLAUDE.md` and `AGENTS.md` give the 30-second project summary; come here for the detail.

## When to update these

Whenever you change behavior that contradicts what's in one of these docs, edit the doc in the same commit. Drift is the enemy.

## Glossary

- **Pattern #1 form** — `useActionState` + `ActionResult` return type + `FormFeedback` toasts. Used for every save form.
- **Pattern #2 form** — bare `<form action={voidAction}>` + confirm dialog + optimistic toast. Used for deletes, status updates, approve/reject.
- **`requireAdmin()`** — verifies JWT, re-queries the DB for role. Never wrap in try/catch.
- **Bucket** (uploads) — logical sub-folder under `public/storage/`. Four allowed values: `package-images`, `location-images`, `testimonial-images`, `site-content`.
