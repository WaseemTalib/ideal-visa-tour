import Link from "next/link";
import { Award, CalendarCheck, Inbox, Package } from "lucide-react";
import { getInquiries, getPackages } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const [packages, inquiries] = await Promise.all([getPackages({}, false), getInquiries()]);
  const groupPackages = packages.filter((pkg) => pkg.type === "group");
  const upcoming = groupPackages
    .filter((pkg) => pkg.start_date && new Date(pkg.start_date) >= new Date())
    .slice(0, 5);
  const newInquiries = inquiries.filter((inq) => inq.status === "new").length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">Dashboard</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Welcome back, <span className="text-gradient-teal">admin</span>
          </h1>
          <p className="mt-1 text-sm text-slate-600">Snapshot of packages, inquiries, and upcoming tours.</p>
        </div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="Total packages" value={packages.length} Icon={Package} tint="from-teal-500/15 to-teal-600/5" accent="text-teal-700" />
        <Metric label="Group packages" value={groupPackages.length} Icon={CalendarCheck} tint="from-coral-500/15 to-coral-600/5" accent="text-coral-600" />
        <Metric
          label="Total inquiries"
          value={inquiries.length}
          Icon={Inbox}
          tint="from-amber-500/15 to-amber-600/5"
          accent="text-amber-600"
          badge={newInquiries > 0 ? `${newInquiries} new` : undefined}
        />
        <Metric label="Featured packages" value={packages.filter((pkg) => pkg.featured).length} Icon={Award} tint="from-emerald-500/15 to-emerald-600/5" accent="text-emerald-700" />
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Panel title="Recent inquiries" href="/dashboard/inquiries">
          {inquiries.length === 0 ? (
            <p className="text-sm text-slate-500">No inquiries yet.</p>
          ) : (
            inquiries.slice(0, 6).map((inq) => (
              <div key={inq.id} className="flex items-center justify-between border-b border-slate-100 py-3 text-sm last:border-0">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">{inq.name}</p>
                  <p className="truncate text-xs text-slate-500">{inq.subject || inq.type}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
                    inq.status === "new"
                      ? "bg-coral-100 text-coral-700"
                      : inq.status === "contacted"
                      ? "bg-amber-100 text-amber-700"
                      : inq.status === "confirmed"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {inq.status}
                </span>
              </div>
            ))
          )}
        </Panel>
        <Panel title="Upcoming group tours" href="/dashboard/group-packages">
          {upcoming.length === 0 ? (
            <p className="text-sm text-slate-500">No upcoming group tours.</p>
          ) : (
            upcoming.map((pkg) => (
              <div key={pkg.id} className="flex items-center justify-between border-b border-slate-100 py-3 text-sm last:border-0">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">{pkg.title}</p>
                  <p className="text-xs text-slate-500">{formatDate(pkg.start_date)}</p>
                </div>
                <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-teal-700">
                  {pkg.seats_available ?? 0} seats
                </span>
              </div>
            ))
          )}
        </Panel>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  Icon,
  tint,
  accent,
  badge,
}: {
  label: string;
  value: number | string;
  Icon: typeof Package;
  tint: string;
  accent: string;
  badge?: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className={`pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-gradient-to-br ${tint} blur-2xl`} />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
          <p className={`mt-2 text-3xl font-bold tracking-tight ${accent}`}>{value}</p>
          {badge ? (
            <span className="mt-2 inline-flex items-center rounded-full bg-coral-50 px-2 py-0.5 text-[11px] font-bold text-coral-600">
              {badge}
            </span>
          ) : null}
        </div>
        <span className={`inline-flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${tint} ring-1 ring-slate-200/60 ${accent} transition group-hover:rotate-6`}>
          <Icon size={18} />
        </span>
      </div>
    </div>
  );
}

function Panel({ title, href, children }: { title: string; href: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-slate-950">{title}</h2>
        <Link className="text-xs font-bold uppercase tracking-wider text-teal-700 hover:underline" href={href}>
          View all →
        </Link>
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}
