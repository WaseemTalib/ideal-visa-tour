import type { Metadata } from "next";
import {
  BadgeCheck,
  Bus,
  CalendarClock,
  CheckCircle2,
  HeartHandshake,
  Hotel,
  MoonStar,
  Plane,
  ShieldCheck,
} from "lucide-react";
import { Footer } from "@/components/public/footer";
import { Navbar } from "@/components/public/navbar";
import { PackageCard } from "@/components/public/package-card";
import { UmrahForm } from "@/components/forms/umrah-form";
import { getCurrentUser } from "@/lib/auth";
import { getPackages, getSiteSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Umrah Packages" };
export const dynamic = "force-dynamic";

const STEPS = [
  { Icon: BadgeCheck, title: "Share your preferences", text: "Tell us hotel category, Haram distance, and the dates that suit you." },
  { Icon: ShieldCheck, title: "We file the visa", text: "Saudi e-visa filing handled in-house with all documentation." },
  { Icon: Plane, title: "Travel hassle-free", text: "Airport meet, hotel check-in, ziyarat — all coordinated for you." },
  { Icon: MoonStar, title: "On-trip support", text: "WhatsApp coordinator with you in Makkah and Madinah." },
];

const INCLUDED = [
  "Saudi Umrah e-visa filing",
  "Return economy flights",
  "Hotels per tier (Makkah + Madinah)",
  "Airport meet & greet",
  "Makkah ↔ Madinah road transfer",
  "Ziyarat transport in both cities",
  "Breakfast (premium tiers add dinner)",
  "On-trip WhatsApp coordinator",
];

const EXCLUDED = [
  "Lunch (unless mentioned)",
  "Personal shopping and laundry",
  "Optional extended ziyarat tours",
  "Anything not listed in 'Included'",
];

export default async function UmrahPage() {
  const [packages, settings, session] = await Promise.all([
    getPackages({ type: "umrah" }),
    getSiteSettings(),
    getCurrentUser(),
  ]);
  const showAgentPrice = !!session;
  const whatsapp = String(settings.whatsapp ?? "").trim();

  return (
    <>
      <Navbar />
      <main>
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="animate-fade-up">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-coral-500">Umrah packages</p>
            <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl">
              Umrah, <span className="text-gradient-sunset">made effortless</span>
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-600">
              Saudi e-visa, return flights, hotels near Haram and Masjid An-Nabawi, and ziyarat transport — tell us what you need and we&apos;ll build a tailored quote.
            </p>
            <div className="mt-6">
              <a
                href="#book"
                className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-coral-500 to-coral-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-coral-500/30 transition hover:-translate-y-0.5 hover:shadow-coral-500/50"
              >
                Get a quote
                <span aria-hidden>↓</span>
              </a>
            </div>
          </div>
        </section>

        {/* Available Umrah packages */}
        <section id="packages" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">Available Umrah packages</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Bookable <span className="text-gradient-teal">Umrah departures</span>
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
              No Umrah packages published yet — drop us a WhatsApp message and we&apos;ll share the latest schedule directly.
            </div>
          )}
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-coral-500">How it works</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Four steps from <span className="text-gradient-sunset">enquiry to ihram</span>
            </h2>
          </div>
          <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ Icon, title, text }, index) => (
              <li
                key={title}
                className="group relative rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
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
        </section>

        {/* Included / not included */}
        <section className="relative overflow-hidden bg-gradient-to-br from-sand-50 to-white py-20">
          <div className="pointer-events-none absolute -left-32 top-1/3 size-72 rounded-full bg-teal-500/10 blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Included</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Every Umrah package includes</h2>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {INCLUDED.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-coral-500">Quoted separately</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Optional add-ons</h2>
                <ul className="mt-6 grid gap-3">
                  {EXCLUDED.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                      <HeartHandshake className="mt-0.5 shrink-0 text-coral-500" size={16} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 rounded-md border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
                  <span className="font-bold uppercase tracking-wider text-slate-500">Group rates: </span>
                  10+ travellers get negotiated flight blocks and discounted hotel rates. Mention group size in the form below.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Book form */}
        <section id="book" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">Get a quote</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Send your <span className="text-gradient-teal">Umrah enquiry</span>
              </h2>
              <p className="mt-3 max-w-md text-slate-600">
                Tell us your hotel category, Haram distance, dates and travellers. Hit <b>Send on WhatsApp</b> and the message is pre-filled with your details — you just send it.
              </p>
              <div className="mt-6 grid gap-3 text-sm text-slate-700">
                <div className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
                  <Hotel size={18} className="mt-0.5 shrink-0 text-teal-700" />
                  <div>
                    <p className="font-bold text-slate-950">Hand-picked hotels</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-600">Same chains we book every month — Pullman, Hilton, Anjum, Swissôtel, Concorde.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
                  <Bus size={18} className="mt-0.5 shrink-0 text-teal-700" />
                  <div>
                    <p className="font-bold text-slate-950">Transport included</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-600">Airport transfers, Makkah ↔ Madinah road journey, and city ziyarat are part of every package.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
                  <CalendarClock size={18} className="mt-0.5 shrink-0 text-teal-700" />
                  <div>
                    <p className="font-bold text-slate-950">Reply within hours</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-600">Our team responds to WhatsApp enquiries the same day, every day.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute -inset-2 -z-10 rounded-3xl bg-gradient-to-br from-teal-500/10 via-transparent to-emerald-500/10 blur-2xl" />
              <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[var(--shadow-soft)] sm:p-8">
                <UmrahForm whatsapp={whatsapp} />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  );
}
