import Link from "next/link";
import { CheckCircle2, ChevronLeft, ChevronRight, Search, UserCheck, UserX } from "lucide-react";
import {
  approveUserAction,
  deleteUserAction,
  disableUserAction,
  enableUserAction,
} from "@/app/actions";
import { StatusToggle } from "@/components/dashboard/status-toggle";
import { UserActionButton } from "@/components/dashboard/user-action-button";
import { getCurrentUser } from "@/lib/auth";
import { getApprovedProfiles, getPendingProfiles } from "@/lib/data";
import { formatDate } from "@/lib/utils";

const PER_PAGE = 10;

type ProfileRow = {
  id: string;
  email: string;
  full_name: string | null;
  role: "user" | "admin";
  status: boolean;
  created_at: string;
  approved_at: string | null;
};

export default async function DashboardUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const { page: pageParam, q: searchParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? 1) || 1);
  const search = (searchParam ?? "").trim();

  const [pending, approved, session] = await Promise.all([
    getPendingProfiles(search),
    getApprovedProfiles(page, PER_PAGE, search),
    getCurrentUser(),
  ]);
  const currentId = session?.sub ?? null;
  const totalPages = Math.max(1, Math.ceil(approved.total / PER_PAGE));
  const safePage = Math.min(page, totalPages);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">User management</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Approve registered users</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            New signups land in <b>Pending approvals</b>. Approve to activate an account, or reject to remove it.
          </p>
        </div>
        <div className="rounded-full bg-coral-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-coral-700">
          {pending.length} pending
        </div>
      </div>

      <form action="/dashboard/users" className="mt-6 flex max-w-md items-center gap-2 rounded-2xl border border-slate-200/70 bg-white p-2 pl-3 shadow-sm">
        <Search size={16} className="shrink-0 text-slate-400" />
        <input
          type="search"
          name="q"
          defaultValue={search}
          placeholder="Search by name or email…"
          className="h-9 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
        />
        <button
          type="submit"
          className="rounded-md bg-gradient-to-r from-teal-700 to-teal-800 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white shadow-md shadow-teal-900/20 hover:-translate-y-0.5"
        >
          Search
        </button>
        {search ? (
          <Link
            href="/dashboard/users"
            className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600 hover:bg-slate-50"
          >
            Clear
          </Link>
        ) : null}
      </form>

      <section className="mt-8">
        <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-coral-600">Pending approvals</h2>
        <div className="mt-3 grid gap-3">
          {pending.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
              {search ? "No pending users match your search." : "No pending users right now."}
            </p>
          ) : null}
          {pending.map((user) => (
            <article key={user.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-coral-500/15 to-coral-600/15 text-coral-600 ring-1 ring-coral-100">
                  <UserCheck size={18} />
                </span>
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 font-semibold text-slate-900">
                    {user.full_name || user.email.split("@")[0]}
                    <span className="rounded-full bg-coral-50 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-coral-700">
                      Pending
                    </span>
                  </p>
                  <p className="text-sm text-slate-600">{user.email}</p>
                  <p className="text-xs text-slate-500">Joined {formatDate(user.created_at.slice(0, 10))}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <UserActionButton
                  id={user.id}
                  action={approveUserAction}
                  label="Approve"
                  pendingLabel="Approving…"
                  variant="default"
                  icon={<CheckCircle2 size={14} />}
                  confirm="Are you sure you want to approve this user?"
                  successMessage="User approved"
                />
                <UserActionButton
                  id={user.id}
                  action={deleteUserAction}
                  label="Reject"
                  pendingLabel="Rejecting…"
                  variant="danger"
                  icon={<UserX size={14} />}
                  confirm="Are you sure you want to reject this user?"
                  successMessage="User rejected"
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-teal-700">
            Approved users {approved.total ? `(${approved.total})` : ""}
          </h2>
          {totalPages > 1 ? (
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Page {safePage} of {totalPages}
            </p>
          ) : null}
        </div>

        <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3 hidden md:table-cell">Joined</th>
                <th className="px-4 py-3 hidden md:table-cell">Approved</th>
                <th className="px-4 py-3">Access</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {approved.rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                    {search ? "No approved users match your search." : "No approved users yet."}
                  </td>
                </tr>
              ) : null}
              {approved.rows.map((user) => (
                <ApprovedRow key={user.id} user={user} currentId={currentId} />
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 ? <Pagination page={safePage} totalPages={totalPages} search={search} /> : null}
      </section>
    </div>
  );
}

function ApprovedRow({ user, currentId }: { user: ProfileRow; currentId: string | null }) {
  const isYou = user.id === currentId;
  return (
    <tr className="border-t border-slate-100">
      <td className="px-4 py-3">
        <p className="font-semibold text-slate-900">{user.full_name || user.email.split("@")[0]}</p>
        <p className="text-xs text-slate-500">{user.email}</p>
      </td>
      <td className="px-4 py-3 hidden text-xs text-slate-600 md:table-cell">
        {formatDate(user.created_at.slice(0, 10))}
      </td>
      <td className="px-4 py-3 hidden text-xs text-slate-600 md:table-cell">
        {user.approved_at ? formatDate(user.approved_at.slice(0, 10)) : "—"}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <StatusToggle
            id={user.id}
            enabled={user.status}
            enableAction={enableUserAction}
            disableAction={disableUserAction}
            disabled={isYou}
          />
          <span
            className={
              user.status
                ? "rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700"
                : "rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500"
            }
          >
            {user.status ? "Enabled" : "Disabled"}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        {isYou ? (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-600">
            You
          </span>
        ) : (
          <UserActionButton
            id={user.id}
            action={deleteUserAction}
            label="Delete"
            pendingLabel="Deleting…"
            variant="danger"
            icon={<UserX size={14} />}
            confirm="Are you sure you want to delete this user?"
            successMessage="User deleted"
          />
        )}
      </td>
    </tr>
  );
}

function Pagination({ page, totalPages, search }: { page: number; totalPages: number; search: string }) {
  const buildHref = (n: number) => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    params.set("page", String(n));
    return `?${params.toString()}`;
  };
  const prev = Math.max(1, page - 1);
  const next = Math.min(totalPages, page + 1);
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <nav className="mt-6 flex items-center justify-center gap-2" aria-label="Pagination">
      <PageLink href={buildHref(prev)} disabled={!hasPrev}>
        <ChevronLeft size={14} /> Prev
      </PageLink>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <Link
          key={n}
          href={buildHref(n)}
          className={
            n === page
              ? "inline-flex size-9 items-center justify-center rounded-md bg-teal-700 text-sm font-semibold text-white"
              : "inline-flex size-9 items-center justify-center rounded-md border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50"
          }
          aria-current={n === page ? "page" : undefined}
        >
          {n}
        </Link>
      ))}
      <PageLink href={buildHref(next)} disabled={!hasNext}>
        Next <ChevronRight size={14} />
      </PageLink>
    </nav>
  );
}

function PageLink({ href, disabled, children }: { href: string; disabled?: boolean; children: React.ReactNode }) {
  if (disabled) {
    return (
      <span className="inline-flex h-9 items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-400">
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className="inline-flex h-9 items-center gap-1 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
    >
      {children}
    </Link>
  );
}
