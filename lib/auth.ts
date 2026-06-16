import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { verifySession, type SessionPayload } from "@/lib/auth/jwt";

export const SESSION_COOKIE = "auth_session";

export async function getCurrentUser(): Promise<SessionPayload | null> {
  const cookie = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!cookie) return null;
  try {
    return await verifySession(cookie);
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const session = await getCurrentUser();
  if (!session) redirect("/login");
  const conn = db();
  if (!conn) redirect("/login");
  const [profile] = await conn
    .select()
    .from(schema.profiles)
    .where(eq(schema.profiles.id, session.sub))
    .limit(1);
  if (!profile || profile.role !== "admin") redirect("/login?error=admin-required");
  return { profile, session };
}
