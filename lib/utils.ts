import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function formatCurrency(value?: number | null) {
  if (value == null) return "On request";
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value?: string | null) {
  if (!value) return "Flexible";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

export function listFromText(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function itineraryFromText(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split("\n")
    .map((line, index) => {
      const [title, ...detail] = line.split(":");
      return {
        day: `Day ${index + 1}`,
        title: title?.trim() || `Day ${index + 1}`,
        detail: detail.join(":").trim() || line.trim(),
      };
    })
    .filter((item) => item.detail);
}

export function extractMapSrc(value: unknown) {
  const text = String(value ?? "").trim();
  if (!text) return null;
  const match = text.match(/src=["']([^"']+)["']/i);
  const candidate = (match?.[1] ?? text).trim();
  if (!/^https:\/\/www\.google\.com\/maps\//i.test(candidate)) return null;
  return candidate;
}
