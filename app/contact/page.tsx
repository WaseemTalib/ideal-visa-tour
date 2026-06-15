import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { Footer } from "@/components/public/footer";
import { Navbar } from "@/components/public/navbar";
import { getSiteSettings } from "@/lib/data";
import { extractMapSrc } from "@/lib/utils";

export const metadata: Metadata = { title: "Contact" };

type CardKey = "contact_phone" | "whatsapp" | "email" | "address";

const CARDS: Array<{
  Icon: typeof Phone;
  label: string;
  key: CardKey;
  fallback: string;
  tint: string;
  href?: (value: string) => string;
}> = [
  {
    Icon: Phone,
    label: "Phone",
    key: "contact_phone",
    fallback: "+92 300 0000000",
    tint: "from-teal-500/15 to-teal-600/10 text-teal-700",
    href: (v) => `tel:${v.replace(/\s+/g, "")}`,
  },
  {
    Icon: MessageCircle,
    label: "WhatsApp",
    key: "whatsapp",
    fallback: "+92 300 0000000",
    tint: "from-emerald-500/15 to-emerald-600/10 text-emerald-700",
    href: (v) => `https://wa.me/${v.replace(/[^0-9]/g, "")}`,
  },
  {
    Icon: Mail,
    label: "Email",
    key: "email",
    fallback: "info@example.com",
    tint: "from-coral-500/15 to-coral-600/10 text-coral-600",
    href: (v) => `mailto:${v}`,
  },
  {
    Icon: MapPin,
    label: "Address",
    key: "address",
    fallback: "Lahore, Pakistan",
    tint: "from-slate-500/15 to-slate-600/10 text-slate-700",
  },
];

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const mapSrc = extractMapSrc(settings.google_maps_embed);
  return (
    <>
      <Navbar />
      <main className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
        <section className="animate-fade-up">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">Contact</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl">
            Talk to a <span className="text-gradient-teal">travel consultant</span>
          </h1>
          <p className="mt-3 max-w-md text-base leading-relaxed text-slate-600">
            Send us a message and we&apos;ll reply within hours, every day of the week.
          </p>

          <ul className="mt-8 divide-y divide-slate-200/70 overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
            {CARDS.map(({ Icon, label, key, fallback, tint, href }) => {
              const value = String(settings[key] ?? fallback).trim();
              const inner = (
                <>
                  <span
                    className={`inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${tint} ring-1 ring-slate-200/60`}
                  >
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
                    <p className="mt-0.5 break-words text-sm font-medium text-slate-900 sm:text-base">{value}</p>
                  </div>
                </>
              );
              return (
                <li key={label}>
                  {href ? (
                    <a
                      href={href(value)}
                      target={label === "WhatsApp" ? "_blank" : undefined}
                      rel={label === "WhatsApp" ? "noreferrer" : undefined}
                      className="flex items-start gap-4 px-4 py-4 transition hover:bg-slate-50 sm:px-5"
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className="flex items-start gap-4 px-4 py-4 sm:px-5">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-6 aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
            {mapSrc ? (
              <iframe
                src={mapSrc}
                title="Office location on Google Maps"
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center px-6 text-center text-sm text-slate-500">
                Add a Google Maps embed in Dashboard → Content to show the office location here.
              </div>
            )}
          </div>
        </section>

        <section className="relative animate-fade-up [animation-delay:120ms]">
          <div className="pointer-events-none absolute -inset-2 -z-10 rounded-3xl bg-gradient-to-br from-teal-500/10 via-transparent to-coral-500/10 blur-2xl" />
          <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[var(--shadow-soft)] sm:p-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-950">Send inquiry</h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              Share your dates, travelers, and preferences. We&apos;ll respond with options.
            </p>
            <div className="mt-6">
              <InquiryForm />
            </div>
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  );
}
