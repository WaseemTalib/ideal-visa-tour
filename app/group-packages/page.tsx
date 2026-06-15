import type { Metadata } from "next";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { PackageCard } from "@/components/public/package-card";
import { getPackages, getSiteSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Group Packages" };

export default async function GroupPackagesPage() {
  const [packages, settings] = await Promise.all([getPackages({ type: "group" }), getSiteSettings()]);
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="animate-fade-up">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-coral-500">Fixed departures</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl">
            Group <span className="text-gradient-sunset">travel packages</span>
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-600">Join confirmed departures with set itineraries, group pricing, and reserved seats.</p>
        </div>
        {packages.length ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{packages.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} />)}</div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white/60 p-12 text-center text-slate-600">No published group packages yet.</div>
        )}
      </main>
      <Footer settings={settings} />
    </>
  );
}
