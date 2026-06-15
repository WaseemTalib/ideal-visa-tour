import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

export async function getCurrentUser() {
  const auth = adminAuth();
  if (!auth) return null;
  const session = (await cookies()).get("firebase_session")?.value;
  if (!session) return null;
  try {
    return await auth.verifySessionCookie(session, true);
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const auth = adminAuth();
  const db = adminDb();
  if (!auth || !db) redirect("/login");
  const session = (await cookies()).get("firebase_session")?.value;
  if (!session) redirect("/login");
  let user;
  try {
    user = await auth.verifySessionCookie(session, true);
  } catch {
    redirect("/login");
  }
  if (!user) redirect("/login");
  const profile = await db.collection("profiles").doc(user.uid).get();
  if (profile.data()?.role !== "admin") redirect("/login?error=admin-required");
  return { user, profile: profile.data() };
}
