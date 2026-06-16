import type { Metadata } from "next";
import { Briefcase, ChevronDown, FileCheck2, Globe2, Luggage, MapPin, ShieldCheck, Stamp, Users } from "lucide-react";
import { Footer } from "@/components/public/footer";
import { Navbar } from "@/components/public/navbar";
import { getPackages, getSiteSettings } from "@/lib/data";

export const metadata: Metadata = { title: "About" };

const STEPS = [
  {
    Icon: MapPin,
    title: "Share your destination",
    text: "Tell us where, when, and how many travelers — by inquiry form, phone, or WhatsApp.",
  },
  {
    Icon: Briefcase,
    title: "Get a tailored quote",
    text: "We design hotels, transport, and itinerary around your dates and budget.",
  },
  {
    Icon: FileCheck2,
    title: "Visa filing handled",
    text: "We collect documents, complete the application, and track the appointment.",
  },
  {
    Icon: Luggage,
    title: "Travel with support",
    text: "Coordinator on call, transfers booked, and 24/7 help on the road.",
  },
];

const FAQS = [
  {
    q: "Do you handle visa applications, or just packages?",
    a: "Both. Every international package includes end-to-end visa support — documentation, embassy filing, and follow-up. You can also book visa-only assistance.",
  },
  {
    q: "How far in advance should I book?",
    a: "For visa-on-arrival destinations (UAE, Maldives), 2–3 weeks is enough. For Schengen, Türkiye, or Thailand, plan 4–8 weeks ahead to allow embassy timelines.",
  },
  {
    q: "What's the payment schedule?",
    a: "A 50% advance confirms your booking and starts the visa process. The balance is due 7 days before departure.",
  },
  {
    q: "What if my visa is rejected?",
    a: "Our service fee covers documentation and filing. Embassy fees are non-refundable, but we'll re-apply or refund the tour balance per the contract.",
  },
];

const PILLARS = [
  { Icon: Globe2, title: "Worldwide reach", text: "Türkiye, UAE, Malaysia, Thailand, Maldives, and more.", accent: "from-teal-500/30 to-teal-700/30" },
  { Icon: Stamp, title: "Visa support", text: "Documentation, appointments, and follow-ups handled in-house.", accent: "from-coral-500/30 to-coral-600/30" },
  { Icon: ShieldCheck, title: "Trusted partners", text: "Verified hotels, ground operators, and local guides.", accent: "from-teal-500/30 to-teal-700/30" },
  { Icon: Users, title: "Dedicated team", text: "Travel consultants and coordinators across every trip.", accent: "from-coral-500/30 to-coral-600/30" },
];

export default async function AboutPage() {
  const [packages, settings] = await Promise.all([getPackages(), getSiteSettings()]);
  const stats = [
    { label: "Packages", value: packages.length, tint: "from-teal-50 to-white text-teal-800" },
    { label: "Group tours", value: packages.filter((p) => p.type === "group").length, tint: "from-coral-50 to-white text-coral-600" },
    { label: "Destinations", value: new Set(packages.map((p) => p.to_location_id)).size, tint: "from-teal-50 to-white text-teal-800" },
    { label: "Support", value: "24/7", tint: "from-slate-50 to-white text-slate-900" },
  ];

  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-white py-24">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
          <div className="pointer-events-none absolute -left-32 top-0 size-72 rounded-full bg-teal-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 bottom-0 size-72 rounded-full bg-coral-500/10 blur-3xl" />
          <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8 animate-fade-up">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">About Ideal Visa Tour</p>
            <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl">
              Reliable travel planning for <span className="text-gradient-teal">families, groups, and explorers</span>
            </h1>
            <p className="mt-6 text-base leading-relaxed text-slate-600 sm:text-lg">
              {String(
                settings.about_content ??
                  "We help travelers reach international destinations end-to-end — visa documentation, flights, hotels, transfers, and local guides — so the trip starts the moment you land.",
              )}
            </p>
          </div>
        </section>
        <section className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 md:grid-cols-4 lg:px-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`rounded-2xl border border-slate-200/70 bg-gradient-to-br ${stat.tint} p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md`}
            >
              <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
              <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-slate-500">{stat.label}</p>
            </div>
          ))}
        </section>
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 py-20 text-white">
          <div className="pointer-events-none absolute -top-24 right-0 size-96 rounded-full bg-teal-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-0 size-80 rounded-full bg-coral-500/10 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
            {PILLARS.map(({ Icon, title, text, accent }) => (
              <div key={title} className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-teal-400/30 hover:bg-white/[0.08]">
                <div className={`inline-flex size-11 items-center justify-center rounded-xl bg-gradient-to-br ${accent} text-white ring-1 ring-white/10 transition group-hover:rotate-6`}>
                  <Icon size={22} />
                </div>
                <h2 className="mt-5 font-bold">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="relative bg-white py-20">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-300 to-transparent" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">Our process</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Four steps from <span className="text-gradient-teal">first message to take-off</span>
              </h2>
              <p className="mt-3 text-slate-600">
                We keep the moving parts on our side — paperwork, hotel coordination, transfers — so your only job is to pack.
              </p>
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
          </div>
        </section>

        <section className="relative overflow-hidden bg-gradient-to-br from-sand-50 to-white py-20">
          <div className="pointer-events-none absolute -left-32 top-1/3 size-72 rounded-full bg-teal-500/10 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-coral-500">FAQ</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Common questions, <span className="text-gradient-sunset">straight answers</span>
              </h2>
              <p className="mt-4 max-w-md text-slate-600">
                Still wondering about something? Send a quick message and our consultant will respond within hours.
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
                    <ChevronDown
                      size={18}
                      className="mt-0.5 shrink-0 text-slate-400 transition group-open:rotate-180"
                    />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  );
}
