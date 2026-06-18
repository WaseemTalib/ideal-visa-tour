# Uploads

Images are saved directly under `public/storage/` and served by Next from the same site. No Firebase Storage, no S3 — local disk only.

## Files

- `app/api/upload/route.ts` — POST endpoint that writes to disk
- `components/dashboard/upload-field.tsx` — `<UploadField name=... bucket=... />` widget; URL input + file picker; uploads via fetch; toasts on result

## Endpoint contract (`POST /api/upload`)

- Auth: `await requireAdmin()`.
- Body: `FormData` with `bucket` (string) and `file` (File).
- Allowed buckets: `package-images`, `location-images`, `testimonial-images`, `site-content`.
- Allowed MIME: `image/jpeg`, `image/png`, `image/webp`, `image/gif`, `image/svg+xml`.
- Max size: 5 MB.
- File saved to `public/storage/<bucket>/<slug>-<8-char-uuid>.<ext>`.
- Returns `{ url, path }` where both are `/storage/<bucket>/<filename>`.

Errors → JSON `{ error }` with appropriate HTTP status.

## File layout

```
public/
  storage/
    package-images/      .gitkeep
    location-images/     .gitkeep
    testimonial-images/  .gitkeep
    site-content/        .gitkeep
```

The four folders are committed (with empty `.gitkeep` files) so a fresh clone has the structure. Uploaded binaries are gitignored — see `.gitignore`'s `/public/storage/**/*` rule.

## Filename sanitization

```
baseName = slugify(filename without extension) || "upload"
ext      = inferred from MIME type, falls back to original extension or "bin"
final    = "<baseName>-<crypto.randomUUID().slice(0,8)>.<ext>"
```

So uploads can't collide and won't contain spaces / unicode / shell metacharacters.

## Where uploads happen

| Form | Field | Bucket |
|---|---|---|
| Package form (`PackageForm`) | Main image, Gallery images | `package-images` |
| Location form (`LocationForm`) | Image | `location-images` |
| Testimonial form (`TestimonialForm`) | Photo | `testimonial-images` |
| Content form (`ContentForm`) | Hero background | `site-content` |

`UploadField` keeps both the URL input and the file picker — if you've already got a CDN URL you can paste it; if not, upload a file and the field auto-fills.

## Deployment requirement

This setup needs a host with a **writable filesystem**:

- ✅ Your own VPS / cPanel / Plesk / Hostinger Node hosting (`server.js`)
- ✅ Render Web Service, Railway, Fly.io, DigitalOcean App Platform, Azure App Service
- ❌ **Vercel** — its serverless functions have a read-only filesystem. `/api/upload` will fail there. If you want to deploy on Vercel, swap the route's `writeFile` call for an object-storage client (R2 / S3 / UploadThing / Supabase Storage). The rest of the app runs on Vercel without changes.

## Common pitfalls

- After uploading, the file lives in `public/storage/`. **Don't manually delete files on the server while there are still DB rows referencing them** — package cards will 404 their images. Deleting the package via the dashboard does NOT remove the file (leftover image accumulation is a known accept-able trade-off; we can add cleanup later).
- `deploy.sh` uses `git clean -fd` which would wipe untracked files. Uploaded files survive because `public/storage/**/*` is gitignored, so `git clean` doesn't see them as untracked-but-trackable.
