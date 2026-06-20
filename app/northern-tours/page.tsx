import type { Metadata } from "next";
import Link from "next/link";
import {
  Bus,
  CalendarCheck,
  CheckCircle2,
  Compass,
  Hotel,
  Mountain,
  Sparkles,
  Tent,
  Users,
} from "lucide-react";
import { Footer } from "@/components/public/footer";
import { Navbar } from "@/components/public/navbar";
import { PackageCard } from "@/components/public/package-card";
import { getCurrentUser } from "@/lib/auth";
import { getPackages, getSiteSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Northern Group Tours" };
export const dynamic = "force-dynamic";

type Destination = {
  name: string;
  region: string;
  highlights: string;
  best: string;
};

const DESTINATIONS: Destination[] = [
  {
    name: "Hunza Valley",
    region: "Gilgit-Baltistan",
    highlights: "Karimabad, Baltit Fort, Attabad Lake, Passu Cones, Hopper Glacier",
    best: "April – November",
  },
  {
    name: "Skardu",
    region: "Gilgit-Baltistan",
    highlights: "Shangrila, Upper Kachura, Shigar, Deosai Plains, Khaplu Palace",
    best: "May – September",
  },
  {
    name: "Naran & Kaghan",
    region: "Khyber Pakhtunkhwa",
    highlights: "Saif-ul-Mulook Lake, Lalazar, Babusar Pass, Lulusar Lake",
    best: "June – September",
  },
  {
    name: "Swat Valley",
    region: "Khyber Pakhtunkhwa",
    highlights: "Malam Jabba, Kalam, Mahodand Lake, Ushu Forest",
    best: "April – October",
  },
  {
    name: "Fairy Meadows & Nanga Parbat",
    region: "Diamer District",
    highlights: "Trek from Tatu village, view of Nanga Parbat base camp",
    best: "June – September",
  },
  {
    name: "Neelum Valley (Kashmir)",
    region: "Azad Kashmir",
    highlights: "Keran, Sharda, Arang Kel, Ratti Gali Lake",
    best: "May – October",
  },
];

const HOW_IT_WORKS = [
  {
    Icon: Users,
    title: "Reserve your seat",
    text: "Pick a departure date and pay a small advance to lock in your seat on the coach.",
  },
  {
    Icon: Bus,
    title: "Travel together",
    text: "Coaster or 4x4 transport, group coordinator, hand-picked hotels — all booked in advance.",
  },
  {
    Icon: Sparkles,
    title: "Enjoy the route",
    text: "Daily breakfast, photo stops, sightseeing per itinerary, and 24/7 WhatsApp support.",
  },
];

const INCLUDED = [
  "Transport (Coaster / Hiace / 4x4 as per route)",
  "Hotels on twin or triple sharing",
  "Daily breakfast",
  "Group coordinator",
  "All sightseeing per itinerary",
  "Entry tickets per itinerary",
  "Toll / parking charges",
  "24/7 WhatsApp support",
];

const NOT_INCLUDED = [
  "Lunch and dinner (unless mentioned)",
  "Optional jeep / chairlift / boating",
  "Personal shopping and tipping",
  "Anything not listed in 'Included'",
];

export default async function NorthernGroupToursPage() {
  const [packages, settings, session] = await Promise.all([
    getPackages({ type: "northern" }),
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
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-coral-500">Northern Pakistan</p>
            <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl">
              Group tours to <span className="text-gradient-sunset">Pakistan&apos;s northern beauty</span>
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-600">
              Confirmed coach departures to Hunza, Skardu, Kaghan, Swat, Kashmir and Fairy Meadows — hotels, transport, breakfast, and a coordinator all included in one fixed price.
            </p>
          </div>
        </section>

        {/* Packages list */}
        <section id="packages" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">Available departures</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Upcoming <span className="text-gradient-teal">group tours</span>
              </h2>
            </div>
          </div>
          {packages.length ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} showAgentPrice={showAgentPrice} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white/60 p-12 text-center text-slate-600">
              No northern group tours published yet — drop us a message and we&apos;ll share the latest schedule directly.
            </div>
          )}
        </section>

        {/* Destinations grid */}
        <section className="relative bg-white py-20">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-300 to-transparent" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-coral-500">Where we go</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Six routes across <span className="text-gradient-sunset">the north</span>
              </h2>
              <p className="mt-3 text-slate-600">
                We run group tours across the most photographed regions of northern Pakistan. Each route comes with a hand-picked hotel list and a clear day-wise itinerary.
              </p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {DESTINATIONS.map(({ name, region, highlights, best }) => (
                <article
                  key={name}
                  className="group flex flex-col rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/15 to-emerald-500/15 text-teal-700 ring-1 ring-teal-100 transition group-hover:rotate-6">
                    <Mountain size={20} />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-slate-950">{name}</h3>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{region}</p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{highlights}</p>
                  <p className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-700">
                    <CalendarCheck size={14} />
                    Best: {best}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="relative overflow-hidden bg-gradient-to-br from-sand-50 to-white py-20">
          <div className="pointer-events-none absolute -left-32 top-1/3 size-72 rounded-full bg-teal-500/10 blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">How group tours work</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Three steps to <span className="text-gradient-teal">hit the road</span>
              </h2>
            </div>
            <ol className="mt-10 grid gap-4 md:grid-cols-3">
              {HOW_IT_WORKS.map(({ Icon, title, text }, index) => (
                <li
                  key={title}
                  className="group relative rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <span className="absolute right-5 top-5 text-xs font-bold uppercase tracking-[0.18em] text-slate-300">
                    Step {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/15 to-teal-700/15 text-teal-700 ring-1 ring-teal-100 transition group-hover:rotate-6">
                    <Icon size={20} />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-slate-950">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Included / not included */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Included</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                What every northern tour includes
              </h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {INCLUDED.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={16} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-coral-500">Not included</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Quoted separately on request
              </h2>
              <ul className="mt-6 grid gap-3">
                {NOT_INCLUDED.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                    <Tent className="mt-0.5 shrink-0 text-coral-500" size={16} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-md border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
                <span className="font-bold uppercase tracking-wider text-slate-500">Custom routes: </span>
                We also run private family/family-and-friends tours on any of these routes — message us for a tailored quote.
              </div>
            </div>
          </div>
        </section>

        {/* Family/Honeymoon CTA strip */}
        <section className="relative overflow-hidden bg-gradient-to-r from-teal-700 via-teal-600 to-teal-700 py-16 text-white">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.08]" />
          <div className="pointer-events-none absolute -left-10 top-1/2 size-60 -translate-y-1/2 rounded-full bg-coral-500/20 blur-3xl" />
          <div className="relative mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
            <div>
              <Compass size={36} className="animate-float" />
              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                Prefer a private trip?
              </h2>
              <p className="mt-2 text-teal-50/90 sm:max-w-lg">
                Same routes, but for your family or office group only. Custom dates, private vehicle, choice of hotels — we&apos;ll quote within hours.
              </p>
            </div>
            <Link
              href="/contact"
              className="rounded-md bg-white px-5 py-3 text-sm font-bold text-teal-800 shadow-lg shadow-teal-900/20 hover:-translate-y-0.5 hover:shadow-xl"
            >
              Request a custom quote
            </Link>
          </div>
        </section>

        {/* Hotels short blurb */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-6 rounded-2xl border border-slate-200/70 bg-gradient-to-br from-sand-50 to-white p-6 shadow-sm sm:p-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">Where you&apos;ll stay</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Hand-picked hotels along every route
              </h2>
              <p className="mt-3 text-slate-600">
                We pre-book 3-star and 4-star properties in Hunza, Skardu, Naran, Kalam and Sharda — places that handle the route&apos;s climate, road access, and food preferences for groups travelling from Karachi, Lahore or Islamabad.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { title: "Hunza", text: "Karimabad-based hotels with views of Rakaposhi and Ultar Sar." },
                { title: "Skardu", text: "Shangrila resort area and city hotels close to Polo Ground." },
                { title: "Naran", text: "Riverside hotels on Kaghan road with breakfast included." },
                { title: "Kashmir", text: "Family hotels in Keran, Sharda and Kel within the Neelum Valley." },
              ].map(({ title, text }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <p className="flex items-center gap-2 text-sm font-bold text-slate-950">
                    <Hotel size={14} className="text-teal-700" />
                    {title}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  );
}
