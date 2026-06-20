import Link from "next/link";
import { ArrowRight, CalendarDays, MoonStar, Mountain, Plane, Users } from "lucide-react";
import { formatCurrency, formatDate, PACKAGE_CATEGORY_LABEL, type PackageCategory } from "@/lib/utils";
import type { TravelPackage } from "@/types/database.types";

const CATEGORY_ICON: Record<PackageCategory, typeof Plane> = {
  international: Plane,
  northern: Mountain,
  umrah: MoonStar,
};

const CATEGORY_GRADIENT: Record<PackageCategory, string> = {
  international: "from-teal-700 via-teal-800 to-emerald-800",
  northern: "from-emerald-700 via-teal-800 to-slate-900",
  umrah: "from-slate-800 via-teal-900 to-emerald-900",
};

const CATEGORY_BADGE: Record<PackageCategory, string> = {
  international: "text-teal-800",
  northern: "text-emerald-800",
  umrah: "text-slate-900",
};

export function PackageCard({ pkg, showAgentPrice = false }: { pkg: TravelPackage; showAgentPrice?: boolean }) {
  const hasDiscount = pkg.discount_price != null && pkg.discount_price > 0 && pkg.discount_price < pkg.price;
  const savings = hasDiscount ? pkg.price - (pkg.discount_price ?? 0) : 0;
  const showAgent = showAgentPrice && pkg.agent_price != null;
  const CategoryIcon = CATEGORY_ICON[pkg.type];
  const from = pkg.from_location?.name ?? "Flexible";
  const to = pkg.to_location?.name ?? "Destination";

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-[var(--shadow-lift)]">
      <div className={`relative overflow-hidden bg-gradient-to-br ${CATEGORY_GRADIENT[pkg.type]} px-5 pb-7 pt-5`}>
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
        <div className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 size-36 rounded-full bg-white/[0.06] blur-2xl" />

        <div className="relative flex items-start justify-between gap-2">
          <span className={`rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur ${CATEGORY_BADGE[pkg.type]}`}>
            {PACKAGE_CATEGORY_LABEL[pkg.type]}
          </span>
          {hasDiscount ? (
            <span className="rounded-full bg-gradient-to-r from-coral-500 to-coral-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-lg shadow-coral-900/30">
              Save {formatCurrency(savings)}
            </span>
          ) : null}
        </div>

        <div className="relative mt-6 flex items-center justify-between gap-3 text-white">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">From</p>
            <p className="mt-0.5 truncate text-base font-bold">{from}</p>
          </div>
          <span className="relative inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/20 backdrop-blur transition duration-500 group-hover:rotate-12 group-hover:scale-110">
            <CategoryIcon size={20} />
          </span>
          <div className="min-w-0 flex-1 text-right">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">To</p>
            <p className="mt-0.5 truncate text-base font-bold">{to}</p>
          </div>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-slate-950 transition group-hover:text-teal-800">{pkg.title}</h3>
        {pkg.short_description ? (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{pkg.short_description}</p>
        ) : null}
        <div className="mt-4 grid gap-2 text-sm text-slate-600">
          <span className="flex items-center gap-2">
            <CalendarDays size={15} className="text-teal-700" />
            {formatDate(pkg.start_date ?? pkg.available_from)} — {formatDate(pkg.end_date ?? pkg.available_to)}
          </span>
          {pkg.seats_available != null ? (
            <span className="flex items-center gap-2">
              <Users size={15} className="text-coral-500" />
              {pkg.seats_available} seats available
            </span>
          ) : null}
        </div>
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-dashed border-slate-200 pt-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              {pkg.duration_days}d / {pkg.duration_nights}n
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-xl font-bold tracking-tight text-teal-800">{formatCurrency(pkg.discount_price ?? pkg.price)}</p>
              {hasDiscount ? <p className="text-xs font-semibold text-slate-400 line-through">{formatCurrency(pkg.price)}</p> : null}
            </div>
            {showAgent ? (
              <p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-coral-50 px-2 py-0.5 text-[11px] font-semibold text-coral-700">
                <span className="uppercase tracking-wider">Agent</span>
                <span className="font-bold text-coral-800">{formatCurrency(pkg.agent_price ?? null)}</span>
              </p>
            ) : null}
          </div>
          <Link
            className="inline-flex items-center gap-1.5 rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-teal-900/15 transition hover:-translate-y-0.5 hover:bg-teal-800 hover:shadow-lg hover:shadow-teal-900/25"
            href={`/packages/${pkg.slug}`}
          >
            View details
            <ArrowRight size={14} aria-hidden className="transition group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
