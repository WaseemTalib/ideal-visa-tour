import { requireAdmin } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <DashboardShell>{children}</DashboardShell>;
}
