import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import { signSession, SESSION_MAX_AGE_SECONDS } from "@/lib/auth/jwt";
import { SESSION_COOKIE } from "@/lib/auth";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const conn = db();
  if (!conn) return NextResponse.json({ error: "Database is not configured." }, { status: 500 });

  const [profile] = await conn
    .select()
    .from(schema.profiles)
    .where(eq(schema.profiles.email, email))
    .limit(1);
  if (!profile) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const ok = await verifyPassword(password, profile.password_hash);
  if (!ok) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }
  if (profile.role !== "admin" && !profile.status) {
    return NextResponse.json({ error: "Contact admin for account approval" }, { status: 403 });
  }

  let token: string;
  try {
    token = await signSession({ sub: profile.id, email: profile.email, role: profile.role });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to sign session." },
      { status: 500 },
    );
  }

  const response = NextResponse.json({ ok: true, role: profile.role });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
  });
  return response;
}
