"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(formData.get("email") ?? "").toLowerCase(),
          password: String(formData.get("password") ?? ""),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed.");
      router.push("/dashboard");
      router.refresh();
      toast.success("Signed in. Redirecting…");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-4">
      <div>
        <Label required>Email</Label>
        <Input name="email" type="email" autoComplete="email" required />
      </div>
      <div>
        <Label required>Password</Label>
        <Input name="password" type="password" autoComplete="current-password" required />
      </div>
      <Button disabled={pending}>{pending ? "Signing in…" : "Sign in"}</Button>
    </form>
  );
}
