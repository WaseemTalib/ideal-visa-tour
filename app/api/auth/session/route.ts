import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

const expiresIn = 1000 * 60 * 60 * 24 * 5;

export async function POST(request: Request) {
  const auth = adminAuth();
  const db = adminDb();
  if (!auth || !db) return NextResponse.json({ error: "Firebase Admin is not configured." }, { status: 500 });

  const { idToken } = await request.json();
  if (!idToken) return NextResponse.json({ error: "Missing Firebase ID token." }, { status: 400 });

  const decoded = await auth.verifyIdToken(idToken);
  const profile = await db.collection("profiles").doc(decoded.uid).get();
  if (profile.data()?.role !== "admin") {
    return NextResponse.json({ error: "Only admin users can access the dashboard." }, { status: 403 });
  }

  const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
  const response = NextResponse.json({ ok: true });
  response.cookies.set("firebase_session", sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: expiresIn / 1000,
    path: "/",
  });
  return response;
}
