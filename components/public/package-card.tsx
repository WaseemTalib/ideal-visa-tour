import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { TravelPackage } from "@/types/database.types";

export function PackageCard({ pkg, showAgentPrice = false }: { pkg: TravelPackage; showAgentPrice?: boolean }) {
  const hasDiscount = pkg.discount_price != null && pkg.discount_price > 0 && pkg.discount_price < pkg.price;
  const savings = hasDiscount ? pkg.price - (pkg.discount_price ?? 0) : 0;
  const showAgent = showAgentPrice && pkg.agent_price != null;

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-[var(--shadow-lift)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <Image
          src={pkg.main_image_url || "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"}
          alt={pkg.title}
          fill
          className="object-cover transition duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-teal-800 backdrop-blur">
          {pkg.type}
        </span>
        {hasDiscount ? (
          <span className="absolute right-3 top-3 rounded-full bg-gradient-to-r from-coral-500 to-coral-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-lg shadow-coral-500/30">
            Save {formatCurrency(savings)}
          </span>
        ) : null}
        <p className="absolute bottom-3 left-3 right-3 line-clamp-2 text-sm font-semibold text-white drop-shadow">
          {pkg.from_location?.name ?? "Flexible"} → {pkg.to_location?.name ?? "Destination"}
        </p>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-slate-950 transition group-hover:text-teal-800">{pkg.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{pkg.short_description}</p>
        <div className="mt-4 grid gap-2 text-sm text-slate-600">
          <span className="flex items-center gap-2"><MapPin size={15} className="text-teal-700" />{pkg.from_location?.name ?? "Flexible"} to {pkg.to_location?.name ?? "Destination"}</span>
          <span className="flex items-center gap-2"><CalendarDays size={15} className="text-teal-700" />{formatDate(pkg.start_date ?? pkg.available_from)} — {formatDate(pkg.end_date ?? pkg.available_to)}</span>
          {pkg.type === "group" ? <span className="flex items-center gap-2"><Users size={15} className="text-coral-500" />{pkg.seats_available ?? 0} seats available</span> : null}
        </div>
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-dashed border-slate-200 pt-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{pkg.duration_days}d / {pkg.duration_nights}n</p>
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
            <span aria-hidden className="transition group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
