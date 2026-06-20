import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import { Footer } from "@/components/public/footer";
import { Navbar } from "@/components/public/navbar";
import { PackageCard } from "@/components/public/package-card";
import { formatCurrency, formatDate, PACKAGE_CATEGORY_LABEL } from "@/lib/utils";
import { getPackageBySlug, getPackages, getSiteSettings } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  return { title: pkg?.seo_title || pkg?.title || "Package", description: pkg?.seo_description || pkg?.short_description || undefined };
}

export default async function PackageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) notFound();
  const [related, settings, session] = await Promise.all([
    getPackages({ to: pkg.to_location ?? undefined }).then((items) => items.filter((item) => item.id !== pkg.id).slice(0, 3)),
    getSiteSettings(),
    getCurrentUser(),
  ]);
  const showAgentPrice = !!session;
  const gallery = [pkg.main_image_url, ...(pkg.gallery_images ?? [])].filter(Boolean) as string[];

  return (
    <>
      <Navbar />
      <main>
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Link href="/packages" className="text-sm font-bold text-teal-700">Back to packages</Link>
          <div className="mt-5 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl">{pkg.title}</h1>
              <p className="mt-4 text-lg leading-8 text-slate-600">{pkg.short_description}</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Stat label="Route" value={`${pkg.from_location ?? "Flexible"} to ${pkg.to_location ?? "Destination"}`} />
                <Stat label="Duration" value={`${pkg.duration_days} days / ${pkg.duration_nights} nights`} />
                <Stat label="Departure window" value={`${formatDate(pkg.start_date)} - ${formatDate(pkg.end_date)}`} />
                <Stat label="Price" value={formatCurrency(pkg.discount_price ?? pkg.price)} />
                {showAgentPrice && pkg.agent_price != null ? (
                  <Stat label="Agent price" value={formatCurrency(pkg.agent_price)} />
                ) : null}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-white to-sand-50 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-coral-500">Ready to book?</p>
              <h2 className="mt-2 text-xl font-bold text-slate-950">Send a booking enquiry</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Tell us your dates, travellers, and any preferences — the team will confirm availability and walk you through the next steps.
              </p>
              <Link
                href={`/contact?category=${pkg.type}`}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-coral-500 to-coral-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-coral-500/30 transition hover:-translate-y-0.5 hover:shadow-coral-500/50"
              >
                Go to contact form
                <span aria-hidden>→</span>
              </Link>
              <p className="mt-3 text-xs text-slate-500">
                The category will be pre-selected for you.
              </p>
            </div>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {gallery.slice(0, 6).map((image, index) => (
              <div key={image} className={index === 0 ? "relative aspect-[16/10] overflow-hidden rounded-lg md:col-span-2 md:row-span-2" : "relative aspect-[16/10] overflow-hidden rounded-lg"}>
                <Image src={image} alt={pkg.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white py-14">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
            <div className="grid gap-8">
              <Block title="Description"><p className="leading-8 text-slate-700">{pkg.description}</p></Block>
              <Block title="Day-wise itinerary">
                <div className="grid gap-4">{(pkg.itinerary ?? []).map((item) => <div key={`${item.day}-${item.title}`} className="rounded-lg bg-slate-50 p-4"><p className="font-bold text-teal-800">{item.day}: {item.title}</p><p className="mt-1 text-slate-700">{item.detail}</p></div>)}</div>
              </Block>
              <div className="grid gap-8 md:grid-cols-2">
                <Block title="Included">{(pkg.included ?? []).map((item) => <p key={item} className="flex gap-2 text-slate-700"><CheckCircle2 className="text-teal-700" size={18} />{item}</p>)}</Block>
                <Block title="Excluded">{(pkg.excluded ?? []).map((item) => <p key={item} className="flex gap-2 text-slate-700"><XCircle className="text-coral-500" size={18} />{item}</p>)}</Block>
              </div>
              <Block title="Hotel and transport"><p className="text-slate-700">{pkg.hotel_details || "Hotel details available on request."}</p><p className="mt-2 text-slate-700">{pkg.transport_details || "Transport details available on request."}</p></Block>
              <Block title="Terms and conditions"><p className="leading-8 text-slate-700">{pkg.terms}</p></Block>
            </div>
            <aside className="h-fit rounded-lg border border-slate-200 bg-slate-50 p-5">
              <h3 className="font-bold text-slate-950">Quick facts</h3>
              <div className="mt-4 grid gap-3 text-sm text-slate-700">
                <p>Category: {PACKAGE_CATEGORY_LABEL[pkg.type]}</p>
                <p>Group size: {pkg.group_size ?? "Private or custom"}</p>
                <p>Seats available: {pkg.seats_available ?? "On request"}</p>
                <p>Departure: {formatDate(pkg.start_date)}</p>
                <p>Return: {formatDate(pkg.end_date)}</p>
              </div>
            </aside>
          </div>
        </section>
        {related.length ? <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"><h2 className="text-xl font-bold tracking-tight sm:text-2xl">Related packages</h2><div className="mt-6 grid gap-6 md:grid-cols-3">{related.map((item) => <PackageCard key={item.id} pkg={item} showAgentPrice={showAgentPrice} />)}</div></section> : null}
      </main>
      <Footer settings={settings} />
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-slate-200 bg-white p-4"><p className="text-xs font-bold uppercase text-slate-500">{label}</p><p className="mt-1 font-bold text-slate-950">{value}</p></div>;
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return <section><h2 className="text-xl font-bold tracking-tight sm:text-2xl text-slate-950">{title}</h2><div className="mt-4">{children}</div></section>;
}
