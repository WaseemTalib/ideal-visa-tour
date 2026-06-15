import Image from "next/image";
import Link from "next/link";
import { Compass, Headphones, Plane, ShieldCheck, Stamp, Star } from "lucide-react";
import { Footer } from "@/components/public/footer";
import { Navbar } from "@/components/public/navbar";
import { PackageCard } from "@/components/public/package-card";
import { SearchForm } from "@/components/public/search-form";
import { getLocations, getPackages, getSiteSettings, getTestimonials } from "@/lib/data";

export default async function HomePage() {
  const [locations, packages, groupPackages, testimonials, settings] = await Promise.all([
    getLocations(),
    getPackages({ featured: "true" }),
    getPackages({ type: "group" }),
    getTestimonials(),
    getSiteSettings(),
  ]);
  const featured = packages.slice(0, 3);
  const groups = groupPackages.slice(0, 3);

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

        <section className="relative z-10 mx-auto -mt-24 max-w-7xl px-4 sm:px-6 lg:px-8 animate-fade-up [animation-delay:360ms]">
          <SearchForm locations={locations} />
        </section>

        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">Featured packages</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Popular trips <span className="text-gradient-teal">ready to book</span>
              </h2>
            </div>
            <Link href="/packages" className="group inline-flex items-center gap-1 font-bold text-teal-700">
              View all packages
              <span aria-hidden className="transition group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
          {featured.length ? (
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {featured.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} />)}
            </div>
          ) : (
            <EmptyState text="No featured packages yet. Add packages from the dashboard." />
          )}
        </section>

        <section className="relative bg-white py-24">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-300 to-transparent" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-coral-500">Group packages</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                  Upcoming <span className="text-gradient-sunset">fixed departures</span>
                </h2>
              </div>
              <Link href="/group-packages" className="group inline-flex items-center gap-1 font-bold text-teal-700">
                View group tours
                <span aria-hidden className="transition group-hover:translate-x-0.5">→</span>
              </Link>
            </div>
            {groups.length ? (
              <div className="mt-10 grid gap-6 md:grid-cols-3">{groups.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} />)}</div>
            ) : (
              <EmptyState text="No group packages are published yet." />
            )}
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-24 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">Popular destinations</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Plan by country, city, or <span className="text-gradient-teal">visa-friendly route</span>
            </h2>
            <p className="mt-4 max-w-md text-slate-600">Browse curated international destinations. Each location links to every published package heading there.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {locations.slice(0, 6).map((location) => (
              <Link
                href={`/packages?to=${location.slug}`}
                key={location.id}
                className="group relative min-h-40 overflow-hidden rounded-2xl border border-slate-200/60 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <Image
                  src={location.image_url || "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80"}
                  alt={location.name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
                <span className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                  <span className="text-lg font-bold tracking-tight drop-shadow">{location.name}</span>
                  <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider backdrop-blur">Explore →</span>
                </span>
              </Link>
            ))}
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
