import Image from "next/image";
import Link from "next/link";
import { Compass, CreditCard, FileCheck2, Headphones, Luggage, Plane, Search, ShieldCheck, Stamp, Star } from "lucide-react";
import { Footer } from "@/components/public/footer";
import { Navbar } from "@/components/public/navbar";
import { PackageCard } from "@/components/public/package-card";
import { getPackages, getSiteSettings, getTestimonials } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [packages, testimonials, settings, session] = await Promise.all([
    getPackages(),
    getTestimonials(),
    getSiteSettings(),
    getCurrentUser(),
  ]);
  const showAgentPrice = !!session;
  const oneOfEach = (["international", "northern", "umrah"] as const)
    .map((cat) => packages.find((pkg) => pkg.type === cat))
    .filter((pkg): pkg is NonNullable<typeof pkg> => Boolean(pkg));

  return (
    <>
      <Navbar />
      <main>
        <section className="relative min-h-[640px] overflow-hidden">
          <Image
            src={String(settings.hero_image ?? "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2400&q=85")}
            alt="Mountain travel background"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-slate-950/55 to-teal-900/60" />
          <div className="absolute inset-0 bg-grid opacity-[0.08]" />
          <div className="relative mx-auto flex min-h-[640px] max-w-7xl flex-col justify-center px-4 pb-32 pt-24 sm:px-6 lg:px-8">
            <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur animate-fade-in">
              <span className="size-1.5 rounded-full bg-coral-500 shadow-[0_0_12px] shadow-coral-500" />
              Visa support · Hotels · Flights · Fixed group departures
            </p>
            <h1 className="max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.25rem] animate-fade-up">
              {String(settings.hero_title ?? "International tours with end-to-end visa support")}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg animate-fade-up [animation-delay:120ms]">
              {String(
                settings.hero_subtitle ??
                  "Curated trips to Türkiye, Dubai, Malaysia, Thailand, Maldives and beyond — documentation, hotels, transfers, and local guides handled for you.",
              )}
            </p>
            <div className="mt-8 flex flex-wrap gap-3 animate-fade-up [animation-delay:240ms]">
              <Link href="/packages" className="rounded-md bg-gradient-to-r from-coral-500 to-coral-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-coral-500/30 hover:-translate-y-0.5 hover:shadow-coral-500/50">
                Browse packages
              </Link>
              <Link href="/contact" className="rounded-md border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur hover:bg-white/20">
                Contact consultant
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-coral-500">Browse by category</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                One pick from each of our <span className="text-gradient-sunset">tour categories</span>
              </h2>
              <p className="mt-3 max-w-xl text-slate-600">
                International tours, northern Pakistan departures, and Umrah packages — sample one from each, then explore the rest.
              </p>
            </div>
          </div>
          {oneOfEach.length ? (
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {oneOfEach.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} showAgentPrice={showAgentPrice} />)}
            </div>
          ) : (
            <EmptyState text="No packages published yet. Add some from the dashboard." />
          )}
          <div className="mt-10 flex justify-center">
            <Link
              href="/packages"
              className="group inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-coral-500 to-coral-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-coral-500/30 hover:-translate-y-0.5 hover:shadow-coral-500/50"
            >
              Explore all packages
              <span aria-hidden className="transition group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
        </section>

        <section className="relative bg-white py-24">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-300 to-transparent" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">How it works</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                From idea to <span className="text-gradient-teal">boarding pass</span> in four steps
              </h2>
              <p className="mt-3 text-slate-600">Tell us where you want to go and we&apos;ll handle the rest — visa paperwork, flights, hotels, and ground transfers.</p>
            </div>
            <ol className="mt-10 grid gap-4 md:grid-cols-4">
              {[
                { Icon: Search, title: "1. Pick a destination", text: "Browse packages or share a custom route with our consultant." },
                { Icon: FileCheck2, title: "2. Get a visa plan", text: "We confirm your eligibility and prepare the document checklist." },
                { Icon: CreditCard, title: "3. Book with a deposit", text: "Pay a 50% deposit to confirm seats, hotels, and visa filing." },
                { Icon: Luggage, title: "4. Travel with support", text: "Hotels, transfers, and a coordinator on call throughout your trip." },
              ].map(({ Icon, title, text }) => (
                <li key={title} className="group relative rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
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

        <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 py-20 text-white">
          <div className="pointer-events-none absolute -top-32 left-1/2 size-96 -translate-x-1/2 rounded-full bg-teal-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-10 size-80 rounded-full bg-coral-500/15 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
            {[
              [Stamp, "Visa support", "Documentation, appointments, and guidance handled end-to-end."],
              [Plane, "Hotels & flights", "Hand-picked stays, transfers, and air tickets bundled in."],
              [ShieldCheck, "Verified partners", "Trusted ground operators, transport, and local guides."],
              [Headphones, "Fast replies", "Phone, WhatsApp, and inquiry response within hours."],
            ].map(([Icon, title, text]) => (
              <div key={title as string} className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-teal-400/30 hover:bg-white/[0.08]">
                <div className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/30 to-teal-700/30 text-coral-400 ring-1 ring-white/10 transition group-hover:rotate-6">
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 text-base font-bold">{title as string}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{text as string}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden bg-gradient-to-br from-sand-50 to-white py-20">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-coral-500">Visa-friendly destinations</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                  Countries we file visas for, <span className="text-gradient-sunset">every week</span>
                </h2>
                <p className="mt-3 text-slate-600">All of these accept Pakistani passport holders with straightforward documentation timelines.</p>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {[
                { flag: "🇹🇷", name: "Türkiye", label: "e-Visa · 3-5 days" },
                { flag: "🇦🇪", name: "United Arab Emirates", label: "Tourist visa · 4-7 days" },
                { flag: "🇲🇾", name: "Malaysia", label: "e-Visa · 2-4 days" },
                { flag: "🇹🇭", name: "Thailand", label: "e-Visa · 5-10 days" },
                { flag: "🇲🇻", name: "Maldives", label: "Visa-on-arrival" },
                { flag: "🇦🇿", name: "Azerbaijan", label: "e-Visa · 3 days" },
                { flag: "🇸🇦", name: "Saudi Arabia", label: "Umrah & tourist visas" },
                { flag: "🇪🇬", name: "Egypt", label: "Visa-on-arrival" },
              ].map((country) => (
                <span
                  key={country.name}
                  className="inline-flex items-center gap-3 rounded-full border border-slate-200/70 bg-white px-4 py-2 text-sm shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md"
                >
                  <span aria-hidden className="text-lg leading-none">{country.flag}</span>
                  <span>
                    <span className="block font-semibold text-slate-900">{country.name}</span>
                    <span className="block text-[11px] font-medium uppercase tracking-wider text-slate-500">{country.label}</span>
                  </span>
                </span>
              ))}
            </div>
            <p className="mt-6 text-sm text-slate-600">
              Need a destination not listed?{" "}
              <Link href="/contact" className="font-semibold text-teal-700 hover:underline">
                Ask our visa consultant →
              </Link>
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">Testimonials</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Travelers who <span className="text-gradient-teal">trusted the plan</span>
              </h2>
              <div className="mt-8 grid gap-4">
                {testimonials.length === 0 ? (
                  <EmptyState text="Reviews from happy travelers will appear here." />
                ) : null}
                {testimonials.slice(0, 3).map((item) => (
                  <div key={item.id} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md">
                    <div className="flex gap-1 text-coral-500">
                      {Array.from({ length: item.rating }).map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                    </div>
                    <p className="mt-3 text-slate-700">&ldquo;{item.review}&rdquo;</p>
                    <p className="mt-3 font-bold text-slate-950">{item.name}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-coral-500">Gallery</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                A glimpse of <span className="text-gradient-sunset">memorable routes</span>
              </h2>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {["photo-1469854523086-cc02fe5d8800","photo-1500534314209-a25ddb2bd429","photo-1516483638261-f4dbaf036963","photo-1491553895911-0055eca6402d"].map((id) => (
                  <div key={id} className="group relative aspect-square overflow-hidden rounded-2xl shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <Image src={`https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`} alt="Travel gallery" fill className="object-cover transition duration-700 group-hover:scale-110" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-gradient-to-r from-teal-700 via-teal-600 to-teal-700 py-16 text-white">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.08]" />
          <div className="pointer-events-none absolute -left-10 top-1/2 size-60 -translate-y-1/2 rounded-full bg-coral-500/20 blur-3xl" />
          <div className="relative mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
            <div>
              <Compass size={36} className="animate-float" />
              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{String(settings.homepage_cta ?? "Ready to design your next trip?")}</h2>
              <p className="mt-2 text-teal-50/90">Our consultants reply within hours, every day of the week.</p>
            </div>
            <Link href="/contact" className="rounded-md bg-white px-5 py-3 text-sm font-bold text-teal-800 shadow-lg shadow-teal-900/20 hover:-translate-y-0.5 hover:shadow-xl">
              Send inquiry
            </Link>
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white/60 p-10 text-center text-slate-600">
      {text}
    </div>
  );
}
