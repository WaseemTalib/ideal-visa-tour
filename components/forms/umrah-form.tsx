"use client";

import { FormEvent, useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { toast } from "@/lib/toast";

const HOTEL_PREFS = ["3★", "4★", "4★ Plus", "5★"];
const HARAM_DISTANCES = ["Walking distance (< 500 m)", "Within 1 km", "Up to 3 km (shuttle ok)"];

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function buildMessage(data: Record<string, string>) {
  const lines: string[] = [
    "Hello! I'd like to book a customized Umrah package.",
    "",
  ];
  if (data.hotel) lines.push(`Hotel preference: ${data.hotel}`);
  if (data.distance) lines.push(`Distance from Haram: ${data.distance}`);
  if (data.duration_days) lines.push(`Makkah nights: ${data.duration_days}`);
  if (data.madinah) lines.push(`Madinah nights: ${data.madinah}`);
  if (data.transport) lines.push(`Transport: ${data.transport}`);

  lines.push("");
  lines.push("---");
  lines.push(`Name: ${data.name}`);
  lines.push(`Phone: ${data.phone}`);
  if (data.email) lines.push(`Email: ${data.email}`);
  lines.push(`Travellers: ${data.travelers}`);
  if (data.travel_month) lines.push(`Travel month: ${data.travel_month}`);
  if (data.notes) {
    lines.push("");
    lines.push(`Notes: ${data.notes}`);
  }

  return lines.join("\n");
}

export function UmrahForm({ whatsapp }: { whatsapp: string }) {
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
    <form onSubmit={onSubmit} className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label required>Hotel preference</Label>
          <Select name="hotel" defaultValue="4★" required>
            {HOTEL_PREFS.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label required>Distance from Haram</Label>
          <Select name="distance" defaultValue={HARAM_DISTANCES[0]} required>
            {HARAM_DISTANCES.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Makkah nights</Label>
          <Input name="duration_days" type="number" min="1" placeholder="e.g. 7" />
        </div>
        <div>
          <Label>Madinah nights</Label>
          <Input name="madinah" type="number" min="0" placeholder="e.g. 4" />
        </div>
        <div className="sm:col-span-2">
          <Label>Transport</Label>
          <Input name="transport" placeholder="e.g. Private vehicle, Ziyarat included" />
        </div>
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
        <div>
          <Label>Email (optional)</Label>
          <Input name="email" type="email" placeholder="you@example.com" />
        </div>
        <div>
          <Label required>Number of travellers</Label>
          <Input name="travelers" type="number" min="1" defaultValue={2} required />
        </div>
        <div className="sm:col-span-2">
          <Label>Preferred travel month</Label>
          <Input name="travel_month" type="month" />
        </div>
      </div>

      <div>
        <Label>Notes (any special requests)</Label>
        <Textarea
          name="notes"
          placeholder="e.g. wheelchair access, vegetarian meals, family with infants"
        />
      </div>

      <Button disabled={pending} type="submit" className="gap-2">
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
