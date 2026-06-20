"use client";

import { FormEvent, useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { INQUIRY_CATEGORIES, type InquiryCategory, inquiryCategoryLabel } from "@/lib/inquiry";
import { toast } from "@/lib/toast";

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function buildMessage(data: Record<string, string>) {
  const lines: string[] = ["Hello! I'd like to send an enquiry.", ""];
  lines.push(`Category: ${inquiryCategoryLabel(data.category)}`);
  lines.push("");
  lines.push("---");
  lines.push(`Name: ${data.name}`);
  lines.push(`Phone: ${data.phone}`);
  if (data.email) lines.push(`Email: ${data.email}`);
  if (data.message) {
    lines.push("");
    lines.push(`Message: ${data.message}`);
  }
  return lines.join("\n");
}

export function InquiryForm({
  whatsapp,
  defaultCategory,
}: {
  whatsapp: string;
  defaultCategory?: InquiryCategory;
}) {
  const [pending, setPending] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const phoneDigits = digitsOnly(whatsapp);
    if (!phoneDigits) {
      toast.error("Office WhatsApp number is not configured yet.");
      return;
    }

    setPending(true);
    const fd = new FormData(event.currentTarget);
    const data: Record<string, string> = {};
    for (const [key, value] of fd.entries()) data[key] = String(value).trim();

    const message = buildMessage(data);
    const url = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(message)}`;

    toast.success("Opening WhatsApp…");
    const opened = window.open(url, "_blank", "noopener,noreferrer");
    if (!opened) window.location.href = url;
    setPending(false);
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div>
        <Label required>Category</Label>
        <Select name="category" defaultValue={defaultCategory ?? ""} required>
          <option value="" disabled>Select a category</option>
          {INQUIRY_CATEGORIES.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </Select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label required>Name</Label>
          <Input name="name" placeholder="e.g. Ahmed Khan" required />
        </div>
        <div>
          <Label required>Phone</Label>
          <Input
            name="phone"
            type="tel"
            inputMode="tel"
            pattern="^\+?[0-9\s\-()]{7,}$"
            placeholder="+92 300 0000000"
            required
          />
        </div>
      </div>
      <div>
        <Label>Email (optional)</Label>
        <Input name="email" type="email" placeholder="you@example.com" />
      </div>
      <div>
        <Label required>Message</Label>
        <Textarea
          name="message"
          required
          placeholder="Tell us your preferred dates, travelers, and requirements."
        />
      </div>
      <Button disabled={pending} className="gap-2" type="submit">
        <MessageCircle size={16} />
        {pending ? "Opening…" : "Send on WhatsApp"}
        <Send size={14} />
      </Button>
      <p className="-mt-2 text-xs text-slate-500">
        Tapping the button opens WhatsApp with your details pre-filled. You can review and send the message from there.
      </p>
    </form>
  );
}
