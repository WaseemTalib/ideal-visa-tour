"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "sonner";
import { firebaseAuth } from "@/lib/firebase/client";
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
      const credential = await signInWithEmailAndPassword(
        firebaseAuth(),
        String(formData.get("email") ?? ""),
        String(formData.get("password") ?? ""),
      );
      const idToken = await credential.user.getIdToken();
      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to create admin session.");
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
      <div><Label required>Email</Label><Input name="email" type="email" required /></div>
      <div><Label required>Password</Label><Input name="password" type="password" required /></div>
      <Button disabled={pending}>{pending ? "Signing in…" : "Sign in"}</Button>
    </form>
  );
}
