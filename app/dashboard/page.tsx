import Link from "next/link";
import { CalendarCheck, Globe2, MoonStar, Mountain, Package } from "lucide-react";
import { getPackages } from "@/lib/data";
import { formatDate, PACKAGE_CATEGORY_LABEL } from "@/lib/utils";

export default async function DashboardPage() {
  const packages = await getPackages({}, false);
  const now = new Date();
  const upcoming = packages
    .filter((pkg) => pkg.start_date && new Date(pkg.start_date) >= now)
    .slice(0, 5);
  const upcomingTotal = packages.filter((pkg) => pkg.start_date && new Date(pkg.start_date) >= now).length;

  const counts = {
    international: packages.filter((p) => p.type === "international").length,
    northern: packages.filter((p) => p.type === "northern").length,
    umrah: packages.filter((p) => p.type === "umrah").length,
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">Dashboard</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Welcome back, <span className="text-gradient-teal">admin</span>
          </h1>
          <p className="mt-1 text-sm text-slate-600">Snapshot of packages, categories, and upcoming departures.</p>
        </div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Metric label="Total packages" value={packages.length} Icon={Package} tint="from-teal-500/15 to-teal-600/5" accent="text-teal-700" />
        <Metric label={PACKAGE_CATEGORY_LABEL.international} value={counts.international} Icon={Globe2} tint="from-sky-500/15 to-sky-600/5" accent="text-sky-700" />
        <Metric label={PACKAGE_CATEGORY_LABEL.northern} value={counts.northern} Icon={Mountain} tint="from-emerald-500/15 to-emerald-600/5" accent="text-emerald-700" />
        <Metric label={PACKAGE_CATEGORY_LABEL.umrah} value={counts.umrah} Icon={MoonStar} tint="from-slate-500/15 to-slate-700/5" accent="text-slate-700" />
        <Metric label="Upcoming departures" value={upcomingTotal} Icon={CalendarCheck} tint="from-coral-500/15 to-coral-600/5" accent="text-coral-600" />
      </div>
      <div className="mt-10">
        <Panel title="Upcoming departures" href="/dashboard/packages">
          {upcoming.length === 0 ? (
            <p className="text-sm text-slate-500">No upcoming departures.</p>
          ) : (
            upcoming.map((pkg) => (
              <div key={pkg.id} className="flex items-center justify-between gap-4 border-b border-slate-100 py-3 text-sm last:border-0">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">{pkg.title}</p>
                  <p className="text-xs text-slate-500">
                    {PACKAGE_CATEGORY_LABEL[pkg.type]} · {formatDate(pkg.start_date)}
                  </p>
                </div>
                {pkg.seats_available != null ? (
                  <span className="shrink-0 rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-teal-700">
                    {pkg.seats_available} seats
                  </span>
                ) : null}
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
}: {
  label: string;
  value: number | string;
  Icon: typeof Package;
  tint: string;
  accent: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className={`pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-gradient-to-br ${tint} blur-2xl`} />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
          <p className={`mt-2 text-3xl font-bold tracking-tight ${accent}`}>{value}</p>
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
