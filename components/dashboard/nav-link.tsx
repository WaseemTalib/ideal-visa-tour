"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "outline" | "ghost";
};

const variants = {
  primary: "rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800",
  outline: "rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50",
  ghost: "text-sm font-semibold text-teal-700 hover:underline",
};

export function NavLink({ href, children, className, variant = "outline" }: NavLinkProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Link
      href={href}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
        event.preventDefault();
        startTransition(() => router.push(href));
      }}
      className={cn(
        "inline-flex items-center justify-center gap-2 transition disabled:opacity-50",
        variants[variant],
        pending && "pointer-events-none opacity-60",
        className,
      )}
      aria-busy={pending}
    >
      {pending ? <Loader2 size={16} className="animate-spin" /> : null}
      {pending ? "Loading…" : children}
    </Link>
  );
}
