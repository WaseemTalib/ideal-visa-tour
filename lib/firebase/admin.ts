import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

function privateKey() {
  return process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
}

export function hasFirebaseAdminEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY,
  );
}

export function getFirebaseAdminApp(): App | null {
  if (!hasFirebaseAdminEnv()) return null;
  if (getApps().length) return getApps()[0]!;

  return initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey(),
    }),
    storageBucket:
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
      `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.appspot.com`,
  });
}

export function adminAuth() {
  const app = getFirebaseAdminApp();
  return app ? getAuth(app) : null;
}

export function adminDb() {
  const app = getFirebaseAdminApp();
  return app ? getFirestore(app) : null;
}

export function adminStorage() {
  const app = getFirebaseAdminApp();
  return app ? getStorage(app) : null;
}

export function nowTimestamp() {
  return Timestamp.now();
}
