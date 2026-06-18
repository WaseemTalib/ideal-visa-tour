# Deployment

Self-hosted on Hostinger (cPanel-style Node) via PM2, driven by a GitHub webhook → `deploy.sh` pipeline. **Vercel is not in use** because the upload route needs a writable filesystem.

## Files

- `server.js` — Node HTTP entry point that wraps `next` for cPanel/Plesk/Render
- `deploy.sh` — shell pipeline that runs on the live server (gitignored — server-only)
- `app/api/webhook/route.ts` — GitHub-signature-verified webhook endpoint at `/api/webhook` that triggers `deploy.sh`

## Required env vars on the live server

```
DATABASE_URL=postgresql://user:pass@host:5432/dbname[?sslmode=require]
JWT_SECRET=<≥ 32 random chars; openssl rand -base64 48>
NEXT_PUBLIC_SITE_URL=https://idealvisa.wtsolutions.pk

WEBHOOK_SECRET=<long random string; same value in GitHub webhook config>
APP_DIR=/home/wtsoluti/idealvisa.wtsolutions.pk
DEPLOY_BRANCH=main
```

Place in a `.env` file at the project root on the server. **`drizzle-kit` doesn't auto-load `.env`** — we patched `drizzle.config.ts` to load it via `dotenv` so `npm run db:migrate` works during deploy.

## `deploy.sh` pipeline

When the webhook fires, `deploy.sh $APP_DIR` runs and:

1. `cd $APP_DIR`
2. `git fetch origin` then `git reset --hard origin/$DEPLOY_BRANCH` then `git clean -fd` — overwrites whatever's there with the latest commit
3. Re-creates `public/storage/<bucket>` folders (idempotent)
4. `npm install` — generates a fresh `package-lock.json` (the lock is gitignored)
5. `npm run db:migrate` — applies pending Drizzle migrations against `$DATABASE_URL`
6. `npm run build` — Next.js production build
7. Kills any existing Node process matching `node.*$APP_DIR` (manual PM2 restart pattern)
8. Appends every step's output to `$APP_DIR/deploy.log`

Tail it during a deploy:

```bash
tail -f /home/wtsoluti/idealvisa.wtsolutions.pk/deploy.log
```

## GitHub webhook

| Setting | Value |
|---|---|
| Payload URL | `https://idealvisa.wtsolutions.pk/api/webhook` |
| Content type | `application/json` |
| Secret | Same value as `WEBHOOK_SECRET` env var |
| Events | Just push events |

The webhook handler verifies the signature with `crypto.timingSafeEqual`, refuses anything from a branch other than `$DEPLOY_BRANCH`, then `exec`s `$APP_DIR/deploy.sh $APP_DIR` and returns 200 immediately while the script runs in the background.

## PM2

```bash
pm2 start /home/wtsoluti/idealvisa.wtsolutions.pk/server.js --name ideal-visa
pm2 save               # persist current list
pm2 startup            # auto-start on server reboot
pm2 restart ideal-visa # manual restart
pm2 logs ideal-visa    # tail stdout/stderr
```

The current `deploy.sh` uses `pkill -f "node.*$APP_DIR"` to stop the existing process — PM2 will auto-restart it because the script was registered with `pm2 save`. If your PM2 setup uses a different process name, edit the `pkill` line in `deploy.sh`.

## Node version

`package.json` pins `"engines": { "node": ">=20" }`. PM2 / cPanel must be running Node 20 or 22 — both work with Next 16, React 19, and `firebase-admin`-free dependency set.

## First-time setup checklist on a fresh server

```bash
# 1. Clone the repo
git clone https://github.com/<you>/ideal-visa-tour.git /home/wtsoluti/idealvisa.wtsolutions.pk
cd /home/wtsoluti/idealvisa.wtsolutions.pk

# 2. Create .env (see env vars above)
nano .env

# 3. Install deps
npm install

# 4. Run migrations + seed once
npm run db:migrate
npm run db:seed     # creates initial admin from ADMIN_EMAIL / ADMIN_PASSWORD

# 5. Build
npm run build

# 6. Start with PM2
pm2 start server.js --name ideal-visa
pm2 save
pm2 startup        # follow the printed instructions

# 7. Configure GitHub webhook (see above)
```

## Common pitfalls

- `db:migrate` fails with `url: ''` → `.env` not on the server, or in a different working directory. Verify with `grep DATABASE_URL .env` from the project root.
- `/api/webhook` returns 403 → signature mismatch. `WEBHOOK_SECRET` env var must match the secret configured in GitHub webhook settings exactly.
- After a deploy, login still broken → migrations didn't run (check `deploy.log`); or new migration files weren't committed → push them.
- `pkill` can't find the process → PM2 process name doesn't match the pattern; either rename or adjust the line in `deploy.sh`.
- `public/storage/` empty after a deploy → make sure the gitignore rule keeps the folders and `.gitkeep` files; `git clean -fd` shouldn't touch them but verify with `ls public/storage/*`.
