import { ShieldCheck, ShieldOff, UserCheck, UserX } from "lucide-react";
import {
  deleteUserAction,
  demoteUserAction,
  promoteUserAction,
} from "@/app/actions";
import { UserActionButton } from "@/components/dashboard/user-action-button";
import { getCurrentUser } from "@/lib/auth";
import { getProfiles } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export default async function DashboardUsersPage() {
  const [profiles, session] = await Promise.all([getProfiles(), getCurrentUser()]);
  const currentId = session?.sub ?? null;
  const pending = profiles.filter((p) => p.role === "user");
  const admins = profiles.filter((p) => p.role === "admin");

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">User management</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Approve registered users
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            New signups land in <b>Pending approvals</b>. Promote them to admin to grant dashboard access.
          </p>
        </div>
        <div className="rounded-full bg-coral-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-coral-700">
          {pending.length} pending
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-coral-600">Pending approvals</h2>
        <div className="mt-3 grid gap-3">
          {pending.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
              No pending users right now.
            </p>
          ) : null}
          {pending.map((user) => (
            <UserRow key={user.id} user={user} currentId={currentId}>
              <UserActionButton
                id={user.id}
                action={promoteUserAction}
                label="Change to admin"
                pendingLabel="Promoting…"
                variant="default"
                icon={<ShieldCheck size={14} />}
                confirm={`Promote ${user.email} to admin? They'll be able to sign in to the dashboard.`}
              />
              {user.id !== currentId ? (
                <UserActionButton
                  id={user.id}
                  action={deleteUserAction}
                  label="Delete"
                  pendingLabel="Deleting…"
                  variant="danger"
                  icon={<UserX size={14} />}
                  confirm={`Delete ${user.email}? This cannot be undone.`}
                />
              ) : null}
            </UserRow>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-teal-700">Active admins</h2>
        <div className="mt-3 grid gap-3">
          {admins.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
              No admins exist yet.
            </p>
          ) : null}
          {admins.map((user) => (
            <UserRow key={user.id} user={user} currentId={currentId}>
              {user.id !== currentId ? (
                <>
                  <UserActionButton
                    id={user.id}
                    action={demoteUserAction}
                    label="Revoke admin"
                    pendingLabel="Revoking…"
                    variant="outline"
                    icon={<ShieldOff size={14} />}
                    confirm={`Revoke admin access for ${user.email}? They'll keep the account but lose dashboard access.`}
                  />
                  <UserActionButton
                    id={user.id}
                    action={deleteUserAction}
                    label="Delete"
                    pendingLabel="Deleting…"
                    variant="danger"
                    icon={<UserX size={14} />}
                    confirm={`Delete ${user.email}? This cannot be undone.`}
                  />
                </>
              ) : (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  You
                </span>
              )}
            </UserRow>
          ))}
        </div>
      </section>
    </div>
  );
}

function UserRow({
  user,
  currentId,
  children,
}: {
  user: { id: string; email: string; full_name: string | null; role: "user" | "admin"; created_at: string };
  currentId: string | null;
  children: React.ReactNode;
}) {
  const isYou = user.id === currentId;
  return (
    <article className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span
          className={
            user.role === "admin"
              ? "inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/15 to-teal-700/15 text-teal-700 ring-1 ring-teal-100"
              : "inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-coral-500/15 to-coral-600/15 text-coral-600 ring-1 ring-coral-100"
          }
        >
          {user.role === "admin" ? <ShieldCheck size={18} /> : <UserCheck size={18} />}
        </span>
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2 font-semibold text-slate-900">
            {user.full_name || user.email.split("@")[0]}
            <span
              className={
                user.role === "admin"
                  ? "rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-teal-700"
                  : "rounded-full bg-coral-50 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-coral-700"
              }
            >
              {user.role}
            </span>
            {isYou ? (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                You
              </span>
            ) : null}
          </p>
          <p className="text-sm text-slate-600">{user.email}</p>
          <p className="text-xs text-slate-500">Joined {formatDate(user.created_at.slice(0, 10))}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </article>
  );
}
