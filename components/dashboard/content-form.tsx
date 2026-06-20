"use client";

import { useActionState } from "react";
import { saveSiteSettingsAction, type ActionResult } from "@/app/actions";
import { FormFeedback } from "@/components/dashboard/form-feedback";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { UploadField } from "@/components/dashboard/upload-field";
import { Input, Label, Textarea } from "@/components/ui/input";
import type { SiteSettings } from "@/types/database.types";

const initialState: ActionResult | null = null;

const TEXT_FIELDS: Array<{ key: string; label: string; placeholder?: string }> = [
  { key: "hero_title", label: "Hero title" },
  { key: "hero_subtitle", label: "Hero subtitle" },
  { key: "homepage_cta", label: "Homepage CTA heading" },
  { key: "contact_phone", label: "Contact phone" },
  { key: "whatsapp", label: "WhatsApp number" },
  { key: "email", label: "Contact email", placeholder: "hello@example.com" },
  { key: "address", label: "Office address" },
  { key: "facebook", label: "Facebook URL", placeholder: "https://facebook.com/..." },
  { key: "youtube", label: "YouTube URL", placeholder: "https://youtube.com/@yourchannel" },
  { key: "tiktok", label: "TikTok URL", placeholder: "https://tiktok.com/@yourhandle" },
];

export function ContentForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction] = useActionState(saveSiteSettingsAction, initialState);

  return (
    <form action={formAction} className="mt-6 grid gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <FormFeedback state={state} />
      <div className="grid gap-4 md:grid-cols-2">
        {TEXT_FIELDS.map((field) => (
          <div key={field.key} className={field.key === "hero_subtitle" || field.key === "homepage_cta" ? "md:col-span-2" : undefined}>
            <Label>{field.label}</Label>
            <Input name={field.key} defaultValue={String(settings[field.key] ?? "")} placeholder={field.placeholder} />
          </div>
        ))}
      </div>
      <UploadField
        name="hero_image"
        label="Hero background image"
        bucket="site-content"
        defaultValue={typeof settings.hero_image === "string" ? settings.hero_image : ""}
      />
      <div>
        <Label>About page content</Label>
        <Textarea name="about_content" defaultValue={String(settings.about_content ?? "")} className="min-h-40" />
      </div>
      <div>
        <Label>Google Maps embed code</Label>
        <Textarea
          name="google_maps_embed"
          defaultValue={String(settings.google_maps_embed ?? "")}
          className="min-h-32 font-mono text-xs"
          placeholder='Paste the full <iframe src="https://www.google.com/maps/embed?..."></iframe> from Google Maps → Share → Embed a map.'
        />
        <p className="mt-1 text-xs text-slate-500">Shown on the contact page. Paste the iframe HTML Google Maps gives you.</p>
      </div>
      <SubmitButton pendingLabel="Saving…">Save content</SubmitButton>
    </form>
  );
}
