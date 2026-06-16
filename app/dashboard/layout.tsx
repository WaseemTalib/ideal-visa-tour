import { requireAdmin } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

// Dashboard is request-time only — never prerender. Avoids build-time DB hits.
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <DashboardShell>{children}</DashboardShell>;
}
