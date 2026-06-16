"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { registerUserAction, type RegisterActionResult, type RegisterFormValues } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

const EMPTY: RegisterFormValues = { full_name: "", email: "" };

export function RegisterForm() {
  const [state, action, pending] = useActionState<RegisterActionResult | null, FormData>(
    registerUserAction,
    null,
  );

  useEffect(() => {
    if (!state) return;
    if (state.success) toast.success(state.success);
    else if (state.error) toast.error(state.error);
  }, [state]);

  const defaults = state?.values ?? EMPTY;
  const formKey = state ? (state.success ? "ok" : `err-${state.error ?? ""}`) + Object.values(defaults).join("|") : "fresh";

  return (
    <form key={formKey} action={action} className="mt-6 grid gap-4">
      <div>
        <Label required>Full name</Label>
        <Input name="full_name" defaultValue={defaults.full_name} autoComplete="name" minLength={2} required />
      </div>
      <div>
        <Label required>Email</Label>
        <Input name="email" type="email" defaultValue={defaults.email} autoComplete="email" required />
      </div>
      <div>
        <Label required>Password</Label>
        <Input name="password" type="password" autoComplete="new-password" minLength={8} required />
        <p className="mt-1 text-xs text-slate-500">At least 8 characters.</p>
      </div>
      <div>
        <Label required>Confirm password</Label>
        <Input name="confirm_password" type="password" autoComplete="new-password" minLength={8} required />
      </div>
      <Button disabled={pending} className="gap-2" type="submit">
        <UserPlus size={16} />
        {pending ? "Creating account…" : "Create account"}
      </Button>
      <p className="mt-1 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-teal-700 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
