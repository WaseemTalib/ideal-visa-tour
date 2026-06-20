import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgeCheck,
  Briefcase,
  CalendarClock,
  CheckCircle2,
  FileCheck2,
  HeartHandshake,
  Hotel,
  Plane,
  ShieldCheck,
  Stamp,
} from "lucide-react";
import { Footer } from "@/components/public/footer";
import { Navbar } from "@/components/public/navbar";
import { getSiteSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Services" };
export const dynamic = "force-dynamic";

type Service = {
  Icon: typeof Stamp;
  title: string;
  summary: string;
  bullets: string[];
  countries?: string;
  badge?: string;
};

const SERVICES: Service[] = [
  {
    Icon: Stamp,
    title: "Visa filing & consultation",
    summary:
      "End-to-end visa support from eligibility check to passport pickup. We prepare your file, book the embassy appointment, and follow up until the decision.",
    bullets: [
      "Tourist, business, work and study visa categories",
      "Document checklist tailored to each consulate's latest rules",
      "Application form filling + cover letter drafting",
      "Embassy appointment booking and biometrics scheduling",
      "Tracking updates and decision follow-up",
    ],
    countries: "Türkiye, UAE, Malaysia, Thailand, Saudi Arabia, Schengen, UK, USA, Canada, Australia, Azerbaijan, Maldives",
    badge: "Most popular",
  },
  {
    Icon: Plane,
    title: "Air ticket bookings",
    summary:
      "Direct issuance on every major airline at IATA-approved rates. We compare fare classes, layovers, and baggage allowances so you don't have to.",
    bullets: [
      "One-way, return, and multi-city tickets",
      "Economy, premium economy, business and first class",
      "Group fares for 10+ travelers (special negotiated rates)",
      "Date-change and refund assistance after issuance",
      "E-ticket delivery via WhatsApp + email within minutes",
    ],
  },
  {
    Icon: CalendarClock,
    title: "Embassy & VFS appointments",
    summary:
      "Save hours of refreshing slow booking portals. We secure embassy, consulate, and VFS appointment slots at the earliest available date.",
    bullets: [
      "Schengen VFS / TLS appointment booking",
      "Saudi Umrah & Hajj appointment coordination",
      "Police character certificate (PCC) appointment booking",
      "Biometrics and photo studio coordination",
      "Same-day rescheduling support when needed",
    ],
  },
  {
    Icon: Hotel,
    title: "Hotels, transfers & insurance",
    summary:
      "We bundle your stay, ground transport, and travel insurance with the package so everything is one quote, one contact, one invoice.",
    bullets: [
      "3 to 5-star hotel reservations worldwide",
      "Airport transfers and intra-city ground transport",
      "Schengen-compliant travel insurance policies",
      "Local SIM cards and forex card sourcing",
      "Sightseeing, balloon rides, desert safaris, etc.",
    ],
  },
  {
    Icon: HeartHandshake,
    title: "Umrah & Hajj packages",
    summary:
      "Hajj and Umrah departures handled by a dedicated coordinator. Visa, transport, hotels close to Haram, and ziyarat included.",
    bullets: [
      "Visa documentation and Saudi e-visa filing",
      "Direct flights and ground transfers (Makkah–Madinah)",
      "Hotels within walking distance of Masjid Al-Haram",
      "Madinah accommodation near Masjid An-Nabawi",
      "Group departures and private family packages",
    ],
  },
  {
    Icon: Briefcase,
    title: "Corporate & agent desk",
    summary:
      "Dedicated B2B desk for travel agencies, corporate clients, and bulk visa filings. Net rates, NDA, and on-call coordinator.",
    bullets: [
      "B2B agent pricing with monthly settlement",
      "Bulk visa filing for tour operators",
      "Corporate travel desk for staff travel",
      "Conference and incentive travel packages",
      "Account manager assigned to every active client",
    ],
  },
];

const PROCESS = [
  { Icon: FileCheck2, title: "Share documents", text: "Send your passport scan and travel dates via WhatsApp. We respond within hours with an eligibility check." },
  { Icon: BadgeCheck, title: "Confirm quote", text: "Pay a small advance to lock in the visa appointment and any hotel/flight reservations." },
  { Icon: ShieldCheck, title: "We handle the rest", text: "Document drafting, form filling, appointment, follow-ups — handled by our team." },
  { Icon: Plane, title: "Travel with support", text: "On-trip WhatsApp support for hotel check-ins, transfers, and any change of plans." },
];

const FAQS = [
  {
    q: "Do you charge separately for consultation?",
    a: "No — the initial eligibility check and document review is free. Service fees only apply once you decide to proceed with filing.",
  },
  {
    q: "Can you guarantee a visa approval?",
    a: "No legitimate travel company can. We can guarantee a complete, properly drafted file and timely submission — but the decision rests with the consulate.",
  },
  {
    q: "Do you only handle outbound travel from Pakistan?",
    a: "Yes — we specialize in Pakistani passport holders travelling internationally. Visa rules, document checklists, and appointment timelines are all built around that.",
  },
  {
    q: "What happens if my visa is rejected?",
    a: "Embassy fees are non-refundable everywhere. Our service fee covers documentation and filing. If the rejection was due to a fixable issue, we re-apply at a reduced fee. Otherwise the tour balance is refunded per contract.",
  },
];

export default async function ServicesPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-white py-20">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
          <div className="pointer-events-none absolute -left-32 top-0 size-72 rounded-full bg-teal-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 bottom-0 size-72 rounded-full bg-coral-500/10 blur-3xl" />
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 animate-fade-up">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">Services</p>
            <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl">
              Everything you need to travel — <span className="text-gradient-teal">handled in one place</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Visa filing, air tickets, embassy appointments, hotels, transfers and on-trip support. One team, one invoice, one consultant on call.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="rounded-md bg-gradient-to-r from-teal-700 to-teal-800 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-teal-900/20 hover:-translate-y-0.5"
              >
                Talk to a consultant
              </Link>
              <Link
                href="/packages"
                className="rounded-md border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:-translate-y-0.5 hover:border-slate-300"
              >
                Browse packages
              </Link>
            </div>
          </div>
        </section>

        {/* Services grid */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {SERVICES.map(({ Icon, title, summary, bullets, countries, badge }) => (
              <article
                key={title}
                className="group relative flex flex-col rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-8"
              >
                {badge ? (
                  <span className="absolute right-5 top-5 rounded-full bg-coral-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-coral-700">
                    {badge}
                  </span>
                ) : null}
                <span className="inline-flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/15 to-teal-700/15 text-teal-700 ring-1 ring-teal-100 transition group-hover:rotate-6">
                  <Icon size={22} />
                </span>
                <h2 className="mt-4 text-xl font-bold tracking-tight text-slate-950">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{summary}</p>
                <ul className="mt-4 grid gap-2">
                  {bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                {countries ? (
                  <p className="mt-5 rounded-md border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                    <span className="font-bold uppercase tracking-wider text-slate-500">Countries: </span>
                    {countries}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        {/* Process */}
        <section className="relative bg-white py-20">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-300 to-transparent" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">How it works</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Four steps from <span className="text-gradient-teal">enquiry to take-off</span>
              </h2>
              <p className="mt-3 text-slate-600">
                Whether it&apos;s a visa, a flight ticket, or a full international tour — the workflow is the same on our end.
              </p>
            </div>
            <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {PROCESS.map(({ Icon, title, text }, index) => (
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
          </div>
        </section>

        {/* FAQ */}
        <section className="relative overflow-hidden bg-gradient-to-br from-sand-50 to-white py-20">
          <div className="pointer-events-none absolute -left-32 top-1/3 size-72 rounded-full bg-teal-500/10 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-coral-500">FAQ</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Frequently <span className="text-gradient-sunset">asked questions</span>
              </h2>
              <p className="mt-4 max-w-md text-slate-600">
                Don&apos;t see your question? Send a quick message on WhatsApp — we usually reply within the hour.
              </p>
            </div>
            <div className="grid gap-3">
              {FAQS.map((faq) => (
                <details
                  key={faq.q}
                  className="group rounded-2xl border border-slate-200/70 bg-white px-5 py-4 shadow-sm transition open:shadow-md"
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-sm font-semibold text-slate-900">
                    <span>{faq.q}</span>
                    <span className="mt-0.5 shrink-0 text-slate-400 transition group-open:rotate-180">▾</span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden bg-gradient-to-r from-teal-700 via-teal-600 to-teal-700 py-16 text-white">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.08]" />
          <div className="relative mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Ready to start your application?</h2>
              <p className="mt-2 text-teal-50/90">Send us a message and we&apos;ll respond with a quote and a document checklist.</p>
            </div>
            <Link
              href="/contact"
              className="rounded-md bg-white px-5 py-3 text-sm font-bold text-teal-800 shadow-lg shadow-teal-900/20 hover:-translate-y-0.5 hover:shadow-xl"
            >
              Send inquiry
            </Link>
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  );
}
