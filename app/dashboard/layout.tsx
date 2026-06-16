import { requireAdmin } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

// Dashboard is request-time only — never prerender (avoids build-time DB hits
// on Vercel/Turbopack where the build worker times out at 60s).
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <DashboardShell>{children}</DashboardShell>;
}
