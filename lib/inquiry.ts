export const INQUIRY_CATEGORIES = [
  { value: "international", label: "International tour" },
  { value: "northern", label: "Northern tours" },
  { value: "umrah", label: "Umrah" },
  { value: "study-abroad", label: "Study abroad" },
  { value: "services", label: "Services" },
] as const;

export type InquiryCategory = (typeof INQUIRY_CATEGORIES)[number]["value"];

export function isInquiryCategory(value: unknown): value is InquiryCategory {
  return INQUIRY_CATEGORIES.some((c) => c.value === value);
}

export function inquiryCategoryLabel(value: string) {
  return INQUIRY_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}
