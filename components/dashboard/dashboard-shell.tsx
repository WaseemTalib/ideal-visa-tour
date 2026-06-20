"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  BarChart3,
  ImageUp,
  KeyRound,
  Loader2,
  MapPinned,
  Package,
  PlaneTakeoff,
  Settings,
  Star,
  UserCheck,
} from "lucide-react";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { cn } from "@/lib/utils";

const links = [
  { label: "Overview", href: "/dashboard", Icon: BarChart3 },
  { label: "Packages", href: "/dashboard/packages", Icon: Package },
  { label: "Locations", href: "/dashboard/locations", Icon: MapPinned },
  { label: "Users", href: "/dashboard/users", Icon: UserCheck },
  { label: "Content", href: "/dashboard/content", Icon: Settings },
  { label: "Testimonials", href: "/dashboard/testimonials", Icon: Star },
  { label: "Account", href: "/dashboard/account", Icon: KeyRound },
];

function SidebarLink({
  label,
  href,
  Icon,
  active,
}: {
  label: string;
  href: string;
  Icon: typeof BarChart3;
  active: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <Link
      href={href}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0 || active) return;
        event.preventDefault();
        startTransition(() => router.push(href));
      }}
      aria-busy={pending}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition",
        active
          ? "bg-gradient-to-r from-teal-50 to-white text-teal-800 shadow-sm ring-1 ring-teal-100"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
        pending && "opacity-70",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-teal-500 to-teal-700 transition-all",
          active ? "opacity-100" : "opacity-0 group-hover:opacity-40",
        )}
      />
      <span
        className={cn(
          "inline-flex size-7 items-center justify-center rounded-md transition",
          active ? "bg-teal-700 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200",
        )}
      >
        {pending ? <Loader2 size={14} className="animate-spin" /> : <Icon size={14} />}
      </span>
      {label}
    </Link>
  );
}

function NewPackageLink() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <Link
      href="/dashboard/packages/new"
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
        event.preventDefault();
        startTransition(() => router.push("/dashboard/packages/new"));
      }}
      aria-busy={pending}
      className={cn(
        "mt-5 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-coral-500 to-coral-600 px-3 py-2.5 text-sm font-semibold text-white shadow-md shadow-coral-500/30 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-coral-500/40",
        pending && "opacity-70",
      )}
    >
      {pending ? <Loader2 size={16} className="animate-spin" /> : <ImageUp size={16} />}
      {pending ? "Loading…" : "New package"}
    </Link>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-teal-50/40">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200/70 bg-white/95 p-5 backdrop-blur lg:block">
        <Link href="/dashboard" className="group flex items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-teal-800 text-white shadow-md shadow-teal-900/20 transition group-hover:rotate-6">
            <PlaneTakeoff size={18} />
          </span>
          <span className="text-base font-bold tracking-tight text-slate-950">
            Ideal <span className="text-gradient-teal">Admin</span>
          </span>
        </Link>
        <div className="mt-2 ml-12 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Control center</div>
        <nav className="mt-7 grid gap-0.5">
          {links.map((link) => (
            <SidebarLink
              key={link.href}
              label={link.label}
              href={link.href}
              Icon={link.Icon}
              active={pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href))}
            />
          ))}
          <NewPackageLink />
        </nav>
        <div className="absolute bottom-5 left-5 right-5">
          <LogoutButton className="h-11 w-full justify-center rounded-md border border-slate-300 bg-white text-sm font-semibold text-slate-900 hover:bg-slate-50">
            Sign out
          </LogoutButton>
        </div>
      </aside>
      <main className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">{children}</div>
      </main>
    </div>
  );
}
