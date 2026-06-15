import Link from "next/link";
import { PlaneTakeoff } from "lucide-react";

const links = [
  ["Packages", "/packages"],
  ["Group Tours", "/group-packages"],
  ["About", "/about"],
  ["Contact", "/contact"],
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2.5 text-lg font-bold text-slate-950">
          <span className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-teal-600 to-teal-800 text-white shadow-md shadow-teal-900/20 transition group-hover:rotate-6 group-hover:scale-105">
            <PlaneTakeoff size={18} />
          </span>
          <span>
            Ideal <span className="text-gradient-teal">Visa Tour</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-700 md:flex">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-teal-700 after:transition-all hover:text-teal-700 hover:after:w-full"
            >
              {label}
            </Link>
          ))}
        </nav>
        <Link
          className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-coral-500 to-coral-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-coral-500/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-coral-500/40"
          href="/contact"
        >
          Plan a Trip
        </Link>
      </div>
    </header>
  );
}
