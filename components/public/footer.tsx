import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import type { SiteSettings } from "@/types/database.types";

type IconProps = { size?: number };

function FacebookIcon({ size = 16 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" fill="currentColor">
      <path d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.3-1.5 1.6-1.5h1.7V4.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.4V14h2.7v8h3.4Z" />
    </svg>
  );
}

function InstagramIcon({ size = 16 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TiktokIcon({ size = 16 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" fill="currentColor">
      <path d="M16.5 3a5.4 5.4 0 0 0 4.6 4.6v3.2a8.6 8.6 0 0 1-4.6-1.4v6.6a6.4 6.4 0 1 1-6.4-6.4c.3 0 .6 0 .9.1v3.3a3.2 3.2 0 1 0 2.3 3.1V3h3.2Z" />
    </svg>
  );
}

export function Footer({ settings }: { settings: SiteSettings }) {
  const facebook = String(settings.facebook ?? "").trim();
  const instagram = String(settings.instagram ?? "").trim();
  const tiktok = String(settings.tiktok ?? "").trim();

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-500/60 to-transparent" />
      <div className="pointer-events-none absolute -left-32 top-1/2 size-72 -translate-y-1/2 rounded-full bg-teal-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 size-72 rounded-full bg-coral-500/10 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-xl font-bold">
            Ideal <span className="text-gradient-teal">Visa Tour</span>
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-300">
            Curated international tour packages with visa support, group departures, and end-to-end trip planning.
          </p>
          {(facebook || instagram || tiktok) ? (
            <div className="mt-5 flex gap-2">
              {[{ href: facebook, label: "Facebook", Icon: FacebookIcon }, { href: instagram, label: "Instagram", Icon: InstagramIcon }, { href: tiktok, label: "TikTok", Icon: TiktokIcon }]
                .filter((item) => item.href)
                .map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="inline-flex size-9 items-center justify-center rounded-md border border-white/10 bg-white/5 text-slate-200 transition hover:-translate-y-0.5 hover:border-teal-400/40 hover:bg-white/10 hover:text-white"
                  >
                    <Icon size={16} />
                  </a>
                ))}
            </div>
          ) : null}
        </div>
        <div>
          <h3 className="font-semibold">Quick links</h3>
          <div className="mt-4 grid gap-2 text-sm text-slate-300">
            <Link href="/packages">Packages</Link>
            <Link href="/group-packages">Group packages</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/login">Admin login</Link>
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Contact</h3>
          <div className="mt-4 grid gap-3 text-sm text-slate-300">
            <span className="flex gap-2"><Phone size={16} />{String(settings.contact_phone ?? "+92 300 0000000")}</span>
            <span className="flex gap-2"><Mail size={16} />{String(settings.email ?? "info@example.com")}</span>
            <span className="flex gap-2"><MapPin size={16} />{String(settings.address ?? "Lahore, Pakistan")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
