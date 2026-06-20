import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, FileCheck2, Plane, Users } from "lucide-react";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { PackageCard } from "@/components/public/package-card";
import { getPackages, getSiteSettings } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = { title: "International Group Tours" };
export const dynamic = "force-dynamic";

const STEPS = [
  {
    Icon: Users,
    title: "Reserve your seat",
    text: "Pay a small advance to lock in your seat on the next confirmed departure.",
  },
  {
    Icon: FileCheck2,
    title: "Visa handled together",
    text: "We file visa applications for the whole group in one batch — faster turnaround, no individual follow-up.",
  },
  {
    Icon: Plane,
    title: "Travel as a group",
    text: "A coordinator flies with you for the whole route — transfers, hotels, sightseeing, all pre-booked.",
  },
];

const INCLUDED = [
  "Round-trip economy flights",
  "Visa documentation and filing",
  "3–4 star hotels (twin sharing)",
  "Airport and intercity transfers",
  "Daily breakfast",
  "Group tour coordinator",
  "All sightseeing per itinerary",
  "24/7 WhatsApp support",
];

export default async function GroupPackagesPage() {
  const [packages, settings, session] = await Promise.all([
    getPackages({ type: "international" }),
    getSiteSettings(),
    getCurrentUser(),
  ]);
  const showAgentPrice = !!session;
  return (
    <>
      <Navbar />
      <main>
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="animate-fade-up">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-coral-500">Fixed departures</p>
            <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl">
              International <span className="text-gradient-sunset">group tours</span>
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-600">
              Confirmed departures abroad — Türkiye, Dubai, Malaysia, Thailand, Maldives and more — with visa support, group pricing, and reserved seats.
            </p>
          </div>
          {packages.length ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} showAgentPrice={showAgentPrice} />)}
            </div>
          ) : (
            <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white/60 p-12 text-center text-slate-600">
              No international group tours published yet.
            </div>
          )}
        </section>

        <section className="relative bg-white py-20">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-coral-300 to-transparent" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-coral-500">How group tours work</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Three steps to <span className="text-gradient-sunset">travel together</span>
              </h2>
              <p className="mt-3 text-slate-600">
                Group departures are easier than planning a solo trip — visa, flights, and itinerary are sorted for the whole group at once.
              </p>
            </div>
            <ol className="mt-10 grid gap-4 md:grid-cols-3">
              {STEPS.map(({ Icon, title, text }, index) => (
                <li
                  key={title}
                  className="group relative rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <span className="absolute right-5 top-5 text-xs font-bold uppercase tracking-[0.18em] text-slate-300">
                    Step {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-coral-500/15 to-coral-600/15 text-coral-600 ring-1 ring-coral-100 transition group-hover:rotate-6">
                    <Icon size={20} />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-slate-950">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="relative overflow-hidden bg-gradient-to-br from-sand-50 to-white py-20">
          <div className="pointer-events-none absolute -left-32 top-1/3 size-72 rounded-full bg-teal-500/10 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">What&apos;s included</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Every group tour <span className="text-gradient-teal">comes with</span>
              </h2>
              <p className="mt-3 max-w-md text-slate-600">
                One transparent price covers the trip end-to-end. Add-ons like travel insurance and optional excursions are quoted separately.
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-teal-700 to-teal-800 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-teal-900/20 hover:-translate-y-0.5"
              >
                Ask about the next departure →
              </Link>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {INCLUDED.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={18} />
                  <span className="text-sm font-medium text-slate-800">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  );
}
