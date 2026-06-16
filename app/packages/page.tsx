import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, FileCheck2, Headphones, Hotel, Plane } from "lucide-react";
import { PackageCard } from "@/components/public/package-card";
import { Footer } from "@/components/public/footer";
import { Navbar } from "@/components/public/navbar";
import { SearchForm } from "@/components/public/search-form";
import { getLocations, getPackages, getSiteSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Travel Packages" };

const STANDARD_INCLUSIONS = [
  { Icon: FileCheck2, title: "Visa support", text: "Documentation, embassy filing, and follow-up." },
  { Icon: Plane, title: "Return flights", text: "Economy class with luggage allowance included." },
  { Icon: Hotel, title: "Hand-picked hotels", text: "3-4 star stays vetted by our team." },
  { Icon: Headphones, title: "On-trip support", text: "WhatsApp coordinator throughout your trip." },
];

export default async function PackagesPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const [locations, packages, settings] = await Promise.all([getLocations(), getPackages(params), getSiteSettings()]);

  const popularDestinations = locations
    .filter((loc) => loc.slug !== "lahore")
    .slice(0, 8);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 animate-fade-up">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">Package search</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl">
            Browse <span className="text-gradient-teal">tour packages</span>
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-600">Filter by route, type, and price to find the trip that fits your plan.</p>
        </div>
        <SearchForm locations={locations} />
        <form className="mt-6 grid gap-3 rounded-2xl border border-slate-200/70 bg-white/80 p-4 backdrop-blur md:grid-cols-5" action="/packages">
          <select name="to" defaultValue={params.to ?? ""} className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm">
            <option value="">Destination</option>
            {locations.map((l) => <option key={l.id} value={l.slug}>{l.name}</option>)}
          </select>
          <select name="from" defaultValue={params.from ?? ""} className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm">
            <option value="">From location</option>
            {locations.map((l) => <option key={l.id} value={l.slug}>{l.name}</option>)}
          </select>
          <input name="maxPrice" defaultValue={params.maxPrice ?? ""} placeholder="Max price" className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm" />
          <select name="type" defaultValue={params.type ?? ""} className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm">
            <option value="">Any type</option>
            <option value="normal">Normal</option>
            <option value="group">Group</option>
          </select>
          <button className="h-11 rounded-md bg-gradient-to-r from-teal-700 to-teal-800 px-4 text-sm font-semibold text-white shadow-md shadow-teal-900/20 hover:-translate-y-0.5">
            Apply filters
          </button>
        </form>

        {popularDestinations.length ? (
          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-coral-500">Browse by destination</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {popularDestinations.map((loc) => {
                const active = params.to === loc.slug;
                return (
                  <Link
                    key={loc.id}
                    href={`/packages?to=${loc.slug}`}
                    aria-current={active ? "page" : undefined}
                    className={
                      active
                        ? "inline-flex items-center gap-2 rounded-full border border-teal-700 bg-teal-700 px-4 py-1.5 text-sm font-semibold text-white shadow-sm"
                        : "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:text-teal-800 hover:shadow-md"
                    }
                  >
                    {loc.name}
                    {loc.country ? (
                      <span className={active ? "text-[11px] font-medium text-white/80" : "text-[11px] font-medium text-slate-400"}>
                        {loc.country}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
              {params.to ? (
                <Link
                  href="/packages"
                  className="inline-flex items-center gap-1 rounded-full border border-transparent bg-slate-100 px-4 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-200"
                >
                  Clear filter
                </Link>
              ) : null}
            </div>
          </div>
        ) : null}

        {packages.length ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{packages.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} />)}</div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white/60 p-12 text-center text-slate-600">
            No matching packages found. Try widening your filters.
          </div>
        )}

        <section className="mt-16 rounded-2xl border border-slate-200/70 bg-gradient-to-br from-sand-50 to-white p-6 shadow-sm sm:p-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">Every package includes</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Travel essentials, <span className="text-gradient-teal">always bundled in</span>
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-slate-600">
              No surprise add-ons at checkout — every package comes with visa support, flights, and on-trip help.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STANDARD_INCLUSIONS.map(({ Icon, title, text }) => (
              <div
                key={title}
                className="group rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/15 to-teal-700/15 text-teal-700 ring-1 ring-teal-100 transition group-hover:rotate-6">
                  <Icon size={20} />
                </span>
                <h3 className="mt-4 flex items-center gap-2 text-base font-bold text-slate-950">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  );
}
