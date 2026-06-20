import type { Metadata } from "next";
import Link from "next/link";
import {
  Award,
  BookOpen,
  Briefcase,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  FileCheck2,
  GraduationCap,
  Headphones,
  Plane,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";
import { Footer } from "@/components/public/footer";
import { Navbar } from "@/components/public/navbar";
import { getSiteSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Student Consultancy" };
export const dynamic = "force-dynamic";

type Country = {
  flag: string;
  name: string;
  highlight: string;
  intake: string;
  notes: string;
};

const COUNTRIES: Country[] = [
  {
    flag: "🇬🇧",
    name: "United Kingdom",
    highlight: "1-year Master's, post-study work visa",
    intake: "Jan / Sep intakes",
    notes: "Russell Group + modern universities. CAS, financial proof, ATAS where applicable.",
  },
  {
    flag: "🇨🇦",
    name: "Canada",
    highlight: "Affordable provinces + PR pathway",
    intake: "Sep / Jan / May intakes",
    notes: "DLI-approved colleges and universities. GIC, SDS / non-SDS guidance.",
  },
  {
    flag: "🇺🇸",
    name: "United States",
    highlight: "STEM OPT, top research universities",
    intake: "Fall / Spring intakes",
    notes: "I-20, F-1 visa, SEVIS, DS-160 interview prep included.",
  },
  {
    flag: "🇦🇺",
    name: "Australia",
    highlight: "Post-study work visa, regional bonuses",
    intake: "Feb / Jul intakes",
    notes: "GTE statement, COE issuance, Genuine Student requirement.",
  },
  {
    flag: "🇩🇪",
    name: "Germany",
    highlight: "Low / no tuition, strong scholarships",
    intake: "Winter / Summer intakes",
    notes: "Blocked account, APS, DAAD scholarship guidance.",
  },
  {
    flag: "🇹🇷",
    name: "Türkiye",
    highlight: "English-medium programs, low cost",
    intake: "Multiple intakes",
    notes: "Türkiye Bursları scholarship support and YÖS prep.",
  },
  {
    flag: "🇲🇾",
    name: "Malaysia",
    highlight: "Affordable, English-taught degrees",
    intake: "Multiple intakes",
    notes: "Twinning programs with UK/Australian universities.",
  },
  {
    flag: "🇨🇾",
    name: "Cyprus",
    highlight: "EU pathway with lower tuition",
    intake: "Multiple intakes",
    notes: "Suitable for Bachelor's and Master's at AKDENIZ-region universities.",
  },
];

const SERVICES = [
  {
    Icon: BookOpen,
    title: "Country & university shortlist",
    text: "We map your profile, budget, and timeline to a shortlist of countries and universities you actually have a strong chance at.",
  },
  {
    Icon: FileCheck2,
    title: "Application filing & SOP",
    text: "Personal statement / SOP drafting, document preparation, transcript attestation guidance, and direct portal submission.",
  },
  {
    Icon: Trophy,
    title: "Scholarship guidance",
    text: "Merit-based and need-based scholarship guidance — Chevening, DAAD, Türkiye Bursları, university-specific bursaries.",
  },
  {
    Icon: ShieldCheck,
    title: "Visa filing end-to-end",
    text: "Financial documents, CAS / I-20 / COE handling, embassy appointment, interview prep, and credibility cover letters.",
  },
  {
    Icon: CreditCard,
    title: "Financials & blocked accounts",
    text: "GIC (Canada), blocked account (Germany), bank statements format and amount, declaration letters from sponsors.",
  },
  {
    Icon: Plane,
    title: "Pre-departure briefing",
    text: "Forex, SIM, packing list, housing options, airport transfers in the destination city, and first-week orientation.",
  },
];

const PROCESS = [
  { Icon: Sparkles, title: "Free profile review", text: "Share academics + CV. We respond with country options and likely intakes." },
  { Icon: GraduationCap, title: "University shortlist", text: "Curated shortlist of 5-8 universities matched to your profile and budget." },
  { Icon: BookOpen, title: "Apply & SOP polish", text: "Application filing, SOP drafting, and document review till offers come in." },
  { Icon: ShieldCheck, title: "Visa & departure", text: "Visa file, financials, embassy / VFS appointment, and pre-departure briefing." },
];

const DOCUMENTS = [
  "Passport (valid for at least 6 months past intake)",
  "Academic transcripts and degree certificates",
  "CV / Resume",
  "IELTS / TOEFL / PTE score (where required)",
  "Statement of Purpose (SOP) / Personal statement",
  "Two academic / work reference letters",
  "Financial proof (bank statements, sponsor affidavit)",
  "Police character certificate (for visa)",
];

const FAQS = [
  {
    q: "Do you charge a consultation fee?",
    a: "No. The initial country and program-fit consultation is free. Service fees only apply once you decide to proceed with applications.",
  },
  {
    q: "Do you guarantee admission or visa approval?",
    a: "No legitimate consultancy can. What we guarantee is a strong, complete application file and proper visa documentation — the decision rests with the university and embassy.",
  },
  {
    q: "Can you help with scholarships?",
    a: "Yes. We guide on merit-based and need-based scholarships including Chevening (UK), DAAD (Germany), Türkiye Bursları, Australia Awards, and university-specific bursaries.",
  },
  {
    q: "What if my IELTS isn't ready yet?",
    a: "We can still start with country and program shortlisting based on your projected score. Many universities accept conditional offers and post-IELTS submission.",
  },
  {
    q: "Do you handle dependants (spouse / children)?",
    a: "Yes — for countries that allow dependants on student visas (UK Master's pre-2024 changes, Canada, Australia, some others), we handle their applications too.",
  },
];

export default async function StudentConsultancyPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-white py-20">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
          <div className="pointer-events-none absolute -left-32 top-0 size-72 rounded-full bg-sky-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 bottom-0 size-72 rounded-full bg-teal-500/10 blur-3xl" />
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 animate-fade-up">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">Student consultancy</p>
            <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl">
              Study abroad — <span className="text-gradient-teal">end-to-end guidance</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Pakistani students, from country shortlisting to embassy interview. Universities, scholarships, applications, visa, and pre-departure briefing — handled by people who&apos;ve been doing this for years.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="#book"
                className="rounded-md bg-gradient-to-r from-teal-700 to-teal-800 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-teal-900/20 hover:-translate-y-0.5"
              >
                Free consultation on WhatsApp
              </Link>
              <a
                href="#countries"
                className="rounded-md border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:-translate-y-0.5 hover:border-slate-300"
              >
                See destination countries
              </a>
            </div>
          </div>
        </section>

        {/* Quick stats */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { Icon: Award, label: "Years of experience", value: "10+" },
              { Icon: Briefcase, label: "Universities partnered", value: "200+" },
              { Icon: Trophy, label: "Scholarship recipients", value: "120+" },
              { Icon: Headphones, label: "Response time", value: "Same day" },
            ].map(({ Icon, label, value }) => (
              <div
                key={label}
                className="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-sky-50 to-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <Icon size={20} className="mx-auto text-sky-700" />
                <p className="mt-3 text-2xl font-bold tracking-tight text-slate-950">{value}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Countries */}
        <section id="countries" className="relative bg-white py-20">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-300 to-transparent" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">Where we send students</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Eight countries we file <span className="text-gradient-teal">every month</span>
              </h2>
              <p className="mt-3 text-slate-600">
                Each country has its own rules, intakes, and document checklists. We handle them so you don&apos;t have to.
              </p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {COUNTRIES.map(({ flag, name, highlight, intake, notes }) => (
                <article
                  key={name}
                  className="group flex flex-col rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <span className="text-3xl leading-none" aria-hidden>{flag}</span>
                  <h3 className="mt-3 text-base font-bold text-slate-950">{name}</h3>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{highlight}</p>
                  <p className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-teal-700">
                    <CalendarClock size={14} />
                    {intake}
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-slate-600">{notes}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Services grid */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-coral-500">What we do</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Six services — <span className="text-gradient-sunset">all under one roof</span>
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map(({ Icon, title, text }) => (
              <article
                key={title}
                className="group flex flex-col rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/15 to-sky-500/15 text-teal-700 ring-1 ring-teal-100 transition group-hover:rotate-6">
                  <Icon size={20} />
                </span>
                <h3 className="mt-4 text-base font-bold text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
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
                Four steps from <span className="text-gradient-teal">enquiry to enrolment</span>
              </h2>
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

        {/* Documents */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-sand-50 to-white p-6 shadow-sm sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">Document checklist</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                  Documents you&apos;ll typically need
                </h2>
                <p className="mt-3 max-w-md text-slate-600">
                  Specific lists vary by country, university, and intake — we share a personalised checklist after your free profile review.
                </p>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {DOCUMENTS.map((doc) => (
                  <li
                    key={doc}
                    className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={16} />
                    <span className="text-sm font-medium text-slate-800">{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="relative overflow-hidden bg-gradient-to-br from-sand-50 to-white py-20">
          <div className="pointer-events-none absolute -right-32 bottom-1/3 size-72 rounded-full bg-coral-500/10 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-coral-500">FAQ</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Frequently asked questions
              </h2>
              <p className="mt-3 max-w-md text-slate-600">
                Don&apos;t see your question here? Send a quick WhatsApp message — we usually reply within hours.
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
        <section id="book" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 p-8 text-white shadow-[var(--shadow-soft)] sm:p-12">
            <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-teal-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 size-64 rounded-full bg-coral-500/15 blur-3xl" />
            <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-coral-300">Get started</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                  Free consultation, <span className="text-gradient-sunset">tailored to your profile</span>
                </h2>
                <p className="mt-3 max-w-md text-slate-200">
                  Share your background, preferred countries, and intake. We&apos;ll reply on WhatsApp with a shortlist and a clear next step.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
                    <ShieldCheck size={18} className="text-coral-300" />
                    <p className="mt-2 text-sm font-bold">No upfront fee</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-300">Country and program fit assessment are free.</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
                    <Headphones size={18} className="text-coral-300" />
                    <p className="mt-2 text-sm font-bold">Same-day reply</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-300">We respond on WhatsApp the same day.</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
                    <GraduationCap size={18} className="text-coral-300" />
                    <p className="mt-2 text-sm font-bold">Honest advice</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-300">If a program isn&apos;t a fit, we&apos;ll say so.</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-stretch gap-3 lg:items-end">
                <Link
                  href="/contact?category=study-abroad"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-coral-500 to-coral-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-coral-500/30 transition hover:-translate-y-0.5 hover:shadow-coral-500/50"
                >
                  Go to contact form
                  <span aria-hidden>→</span>
                </Link>
                <p className="text-center text-xs text-slate-300 lg:text-right">
                  &ldquo;Study abroad&rdquo; will be pre-selected as the category.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  );
}
