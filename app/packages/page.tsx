import type { Metadata } from "next";
import Link from "next/link";
import { Compass } from "lucide-react";
import { Footer } from "@/components/public/footer";
import { Navbar } from "@/components/public/navbar";
import { PackageCard } from "@/components/public/package-card";
import { Input, Label, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { getDistinctDestinations, getPackages, getSiteSettings } from "@/lib/data";
import { PACKAGE_CATEGORY_LABEL, type PackageCategory } from "@/lib/utils";

export const metadata: Metadata = { title: "All Packages" };
export const dynamic = "force-dynamic";

type Filter = "all" | PackageCategory;

const FILTERS: Array<{ value: Filter; label: string }> = [
  { value: "all", label: "All packages" },
  { value: "international", label: PACKAGE_CATEGORY_LABEL.international },
  { value: "northern", label: PACKAGE_CATEGORY_LABEL.northern },
  { value: "umrah", label: PACKAGE_CATEGORY_LABEL.umrah },
];

function parseFilter(value: string | undefined): Filter {
  if (value === "international" || value === "northern" || value === "umrah") return value;
  return "all";
}

function clean(value: string | undefined) {
  const v = (value ?? "").trim();
  return v || undefined;
}

function buildQuery(params: Record<string, string | undefined>) {
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v) search.set(k, v);
  const q = search.toString();
  return q ? `?${q}` : "";
}

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; to?: string; startDate?: string; endDate?: string }>;
}) {
  const sp = await searchParams;
  const filter = parseFilter(sp.category);
  const toParam = clean(sp.to);
  const startDate = clean(sp.startDate);
  const endDate = clean(sp.endDate);

  const [allPackages, destinations, settings, session] = await Promise.all([
    getPackages({ to: toParam, startDate, endDate }),
    getDistinctDestinations(),
    getSiteSettings(),
    getCurrentUser(),
  ]);

  const counts: Record<Filter, number> = {
    all: allPackages.length,
    international: 0,
    northern: 0,
    umrah: 0,
  };
  for (const pkg of allPackages) {
    counts[pkg.type] += 1;
  }

  const visible =
    filter === "all" ? allPackages : allPackages.filter((pkg) => pkg.type === filter);
  const showAgentPrice = !!session;
  const hasFilters = Boolean(filter !== "all" || toParam || startDate || endDate);

  return (
    <>
      <Navbar />
      <main>
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="animate-fade-up">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-coral-500">All categories</p>
            <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl">
              Browse every <span className="text-gradient-sunset">tour we run</span>
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-600">
              International tours, northern Pakistan departures, and Umrah packages — all in one place. Filter by category, destination, or date.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          {/* Category chips */}
          <div className="sticky top-16 z-20 -mx-4 mb-6 border-b border-slate-200/70 bg-white/85 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Category</span>
              {FILTERS.map(({ value, label }) => {
                const active = filter === value;
                const count = counts[value];
                const href = `/packages${buildQuery({
                  category: value === "all" ? undefined : value,
                  to: toParam,
                  startDate,
                  endDate,
                })}`;
                return (
                  <Link
                    key={value}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={
                      active
                        ? "inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-700 to-teal-800 px-4 py-1.5 text-sm font-semibold text-white shadow-md shadow-teal-900/20"
                        : "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-teal-200 hover:text-teal-700 hover:shadow-sm"
                    }
                  >
                    {label}
                    <span
                      className={
                        active
                          ? "rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-bold"
                          : "rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600"
                      }
                    >
                      {count}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Destination + Date filters */}
          <form
            action="/packages"
            method="get"
            className="mb-8 grid gap-4 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm sm:p-5 md:grid-cols-[1.4fr_1fr_1fr_auto] md:items-end"
          >
            {filter !== "all" ? <input type="hidden" name="category" value={filter} /> : null}
            <div>
              <Label>Destination</Label>
              <Select name="to" defaultValue={toParam ?? ""}>
                <option value="">Any destination</option>
                {destinations.map((dest) => (
                  <option key={dest} value={dest}>{dest}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Depart on or after</Label>
              <Input type="date" name="startDate" defaultValue={startDate ?? ""} />
            </div>
            <div>
              <Label>Return on or before</Label>
              <Input type="date" name="endDate" defaultValue={endDate ?? ""} />
            </div>
            <div className="flex items-center gap-2">
              <Button type="submit" className="w-full sm:w-auto">Apply</Button>
              {hasFilters ? (
                <Link
                  href="/packages"
                  className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
                >
                  Reset
                </Link>
              ) : null}
            </div>
          </form>

          {visible.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {visible.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} showAgentPrice={showAgentPrice} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-12 text-center">
              <Compass className="mx-auto mb-3 size-8 text-slate-400" />
              <p className="font-semibold text-slate-700">No packages match these filters.</p>
              <p className="mt-1 text-sm text-slate-500">
                Try a different category, destination, or date — or{" "}
                <Link href="/contact" className="font-semibold text-teal-700 hover:underline">
                  ask us about an upcoming departure
                </Link>
                .
              </p>
            </div>
          )}
        </section>
      </main>
      <Footer settings={settings} />
    </>
  );
}
