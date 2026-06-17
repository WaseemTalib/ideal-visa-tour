import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PlaneTakeoff } from "lucide-react";
import { LoginForm } from "@/components/forms/login-form";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const session = await getCurrentUser();
  if (session) {
    redirect(session.role === "admin" ? "/dashboard" : "/");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-slate-100 to-teal-50/60 px-4">
      <div className="pointer-events-none absolute -left-32 top-1/4 size-80 rounded-full bg-teal-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-1/4 size-80 rounded-full bg-coral-500/15 blur-3xl" />
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200/70 bg-white/95 p-8 shadow-[var(--shadow-soft)] backdrop-blur animate-fade-up">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-teal-800 text-white shadow-md shadow-teal-900/20">
            <PlaneTakeoff size={18} />
          </span>
          <span className="text-base font-bold text-slate-950">
            Ideal <span className="text-gradient-teal">Visa Tour</span>
          </span>
        </Link>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Sign in</h1>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
