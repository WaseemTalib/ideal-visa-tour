import type { Metadata } from "next";
import { Globe2, ShieldCheck, Stamp, Users } from "lucide-react";
import { Footer } from "@/components/public/footer";
import { Navbar } from "@/components/public/navbar";
import { getPackages, getSiteSettings } from "@/lib/data";

export const metadata: Metadata = { title: "About" };

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
      </main>
      <Footer settings={settings} />
    </>
  );
}
