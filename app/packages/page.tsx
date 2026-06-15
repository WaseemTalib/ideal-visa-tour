import type { Metadata } from "next";
import { PackageCard } from "@/components/public/package-card";
import { Footer } from "@/components/public/footer";
import { Navbar } from "@/components/public/navbar";
import { SearchForm } from "@/components/public/search-form";
import { getLocations, getPackages, getSiteSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Travel Packages" };

export default async function PackagesPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const [locations, packages, settings] = await Promise.all([getLocations(), getPackages(params), getSiteSettings()]);

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
        {packages.length ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{packages.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} />)}</div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white/60 p-12 text-center text-slate-600">
            No matching packages found. Try widening your filters.
          </div>
        )}
      </main>
      <Footer settings={settings} />
    </>
  );
}
