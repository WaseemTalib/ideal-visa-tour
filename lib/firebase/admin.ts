import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

function privateKey() {
  return process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
}

function projectId() {
  return (
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    ""
  );
}

export function hasFirebaseAdminEnv() {
  return Boolean(projectId() && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY);
}

export function getFirebaseAdminApp(): App | null {
  if (!hasFirebaseAdminEnv()) return null;
  if (getApps().length) return getApps()[0]!;

  const id = projectId();
  return initializeApp({
    credential: cert({
      projectId: id,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey(),
    }),
    storageBucket:
      process.env.FIREBASE_STORAGE_BUCKET ||
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
      `${id}.appspot.com`,
  });
}

export function adminStorage() {
  const app = getFirebaseAdminApp();
  return app ? getStorage(app) : null;
}
