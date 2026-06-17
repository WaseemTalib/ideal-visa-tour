import { ChangePasswordForm } from "@/components/dashboard/change-password-form";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const { profile } = await requireAdmin();

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">Account</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Change password</h1>
      <p className="mt-1 max-w-xl text-sm text-slate-600">
        Signed in as <b>{profile.email}</b>. Enter your current password to set a new one.
      </p>
      <div className="mt-6 max-w-xl">
        <ChangePasswordForm />
      </div>
    </div>
  );
}
