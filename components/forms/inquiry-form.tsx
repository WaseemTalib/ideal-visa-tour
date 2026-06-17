"use client";

import { useActionState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { createInquiryAction, type InquiryActionResult, type InquiryFormValues } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { toast } from "@/lib/toast";

const EMPTY: InquiryFormValues = { name: "", email: "", phone: "", subject: "", message: "" };

export function InquiryForm({ packageId, type = "contact" }: { packageId?: string; type?: "contact" | "booking" }) {
  const [state, action, pending] = useActionState<InquiryActionResult | null, FormData>(createInquiryAction, null);
  const lastHandledRef = useRef<InquiryActionResult | null>(null);

  useEffect(() => {
    if (!state || state === lastHandledRef.current) return;
    lastHandledRef.current = state;
    if (state.success) toast.success(state.success);
    else if (state.error) toast.error(state.error);
  }, [state]);

  const defaults = state?.values ?? EMPTY;
  const formKey = state ? (state.success ? "ok" : `err-${state.error ?? ""}`) + Object.values(defaults).join("|") : "fresh";

  return (
    <form key={formKey} action={action} className="grid gap-4">
      <input type="hidden" name="package_id" value={packageId ?? ""} />
      <input type="hidden" name="type" value={type} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label required>Name</Label>
          <Input name="name" defaultValue={defaults.name} placeholder="e.g. Ahmed Khan" required />
        </div>
        <div>
          <Label required>Phone</Label>
          <Input
            name="phone"
            type="tel"
            defaultValue={defaults.phone}
            inputMode="tel"
            pattern="^\+?[0-9\s\-()]{7,}$"
            placeholder="+92 300 0000000"
            required
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Email (optional)</Label>
          <Input name="email" type="email" defaultValue={defaults.email} placeholder="you@example.com" />
        </div>
        <div>
          <Label>Subject</Label>
          <Input
            name="subject"
            defaultValue={defaults.subject}
            placeholder={type === "booking" ? "Package inquiry" : "Trip planning"}
          />
        </div>
      </div>
      <div>
        <Label required>Message</Label>
        <Textarea
          name="message"
          defaultValue={defaults.message}
          required
          placeholder="Tell us your preferred dates, travelers, and requirements."
        />
      </div>
      <Button disabled={pending} className="gap-2" type="submit">
        <Send size={16} />
        {pending ? "Sending…" : "Send inquiry"}
      </Button>
    </form>
  );
}
