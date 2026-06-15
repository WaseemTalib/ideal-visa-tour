# Tour & Travel Booking Website

A cloud-ready full-stack tour and travel website built with Next.js App Router, TypeScript, Tailwind CSS, Firebase Auth, Firestore, Firebase Storage, Firebase Admin SDK, Server Actions, Zod, Lucide icons, and Sonner notifications.

## Features

- Public landing page, package search, package listing, package details, group packages, about, and contact pages.
- Firestore-backed package search by location, date range, package type, travelers, duration, featured status, and budget.
- Contact and booking inquiries saved to Firestore.
- Protected `/dashboard` admin area using Firebase Auth session cookies.
- Admin package CRUD, group package management, locations, inquiries, testimonials, and website content.
- Firebase Storage image upload route for package, site, and testimonial images.
- One-command seed/setup script. Firebase has no SQL tables or schemas to create.

## 1. Create a Firebase Project

1. Go to `https://console.firebase.google.com`.
2. Create a Firebase project.
3. Add a Web App in Project Settings.
4. Copy the web app config values for the `NEXT_PUBLIC_FIREBASE_*` environment variables.

## 2. Enable Firebase Products

In Firebase Console:

1. Authentication → Sign-in method → enable Email/Password.
2. Firestore Database → create database.
3. Storage → create default bucket.

Firestore collections are created automatically by `npm run db:setup`.

## 3. Create Firebase Admin Credentials

Firebase Console → Project Settings → Service accounts → Generate new private key.

From the downloaded JSON, copy:

- `client_email` → `FIREBASE_CLIENT_EMAIL`
- `private_key` → `FIREBASE_PRIVATE_KEY`

Keep `FIREBASE_PRIVATE_KEY` wrapped in quotes in `.env.local` or `.env`.

## 4. Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

NEXT_PUBLIC_SITE_URL=http://localhost:3000

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-this-password
```

## 5. Seed Firestore and Create Admin

Run:

```bash
npm run db:setup
```

This automatically creates:

- `locations`
- `packages`
- `testimonials`
- `siteSettings`
- `profiles`
- the first Firebase Auth admin user, if `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set

## 6. Run Locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

Admin login:

```text
http://localhost:3000/login
```

Use `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

## 7. Firebase Rules

Rules are included:

- `firebase/firestore.rules`
- `firebase/storage.rules`

Deploy them with Firebase CLI if desired:

```bash
npm install -g firebase-tools
firebase login
firebase init firestore storage
firebase deploy --only firestore:rules,storage
```

## 8. Deploy on Vercel

1. Push the project to GitHub.
2. Import it into Vercel.
3. Add all Firebase environment variables in Vercel Project Settings.
4. Set `NEXT_PUBLIC_SITE_URL` to your Vercel production URL.
5. Deploy.

No Express backend, Docker, SQL database, or manual table creation is required.
