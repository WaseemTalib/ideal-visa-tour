"use client";

import { useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export function UploadField({
  name,
  label,
  bucket,
  defaultValue,
  required = false,
}: {
  name: string;
  label: string;
  bucket: string;
  defaultValue?: string | null;
  required?: boolean;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);

  async function upload(file?: File) {
    if (!file) return;
    setBusy(true);
    try {
      const body = new FormData();
      body.set("bucket", bucket);
      body.set("file", file);
      const response = await fetch("/api/upload", { method: "POST", body });
      const data = await response.json();
      if (!response.ok || !data.url) throw new Error(data.error || "Upload failed");
      setUrl(data.url);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-2">
      <Label required={required}>{label}</Label>
      <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
        <Input
          name={name}
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://..."
          required={required}
        />
        <label className="inline-flex cursor-pointer items-center justify-center">
          <input
            className="sr-only"
            type="file"
            accept="image/*"
            onChange={(event) => upload(event.target.files?.[0])}
            disabled={busy}
          />
          <Button type="button" variant="outline" disabled={busy} className="gap-2">
            {busy ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {busy ? "Uploading…" : "Upload"}
          </Button>
        </label>
      </div>
    </div>
  );
}
