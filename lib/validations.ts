import { z } from "zod";

const optionalText = z.string().trim().optional().default("");
const optionalUrl = z
  .string()
  .trim()
  .optional()
  .default("")
  .refine((value) => !value || /^https?:\/\//i.test(value), "Enter a valid URL");
const optionalPositiveInt = z
  .union([z.string().trim(), z.number(), z.undefined(), z.null()])
  .transform((value) => {
    if (value === "" || value == null) return null;
    const num = Number(value);
    return Number.isFinite(num) ? Math.trunc(num) : null;
  })
  .refine((value) => value == null || value >= 0, "Must be zero or greater");
const optionalPositiveNumber = z
  .union([z.string().trim(), z.number(), z.undefined(), z.null()])
  .transform((value) => {
    if (value === "" || value == null) return null;
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
  })
  .refine((value) => value == null || value >= 0, "Must be zero or greater");

export const inquirySchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z
    .string()
    .trim()
    .optional()
    .default("")
    .refine((value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), "Enter a valid email"),
  phone: z
    .string()
    .trim()
    .min(7, "Phone number is required")
    .refine((value) => /^\+?[0-9\s\-()]{7,}$/.test(value), "Enter a valid phone number"),
  subject: optionalText,
  message: z.string().trim().min(5, "Message must be at least 5 characters"),
  package_id: optionalText,
  type: z.enum(["contact", "booking"]).default("contact"),
});

export const packageSchema = z.object({
  title: z.string().trim().min(3, "Package title must be at least 3 characters"),
  slug: z.string().trim().min(3, "Slug must be at least 3 characters"),
  short_description: z.string().trim().min(10, "Short description must be at least 10 characters"),
  description: z.string().trim().min(20, "Full description must be at least 20 characters"),
  main_image_url: optionalUrl,
  from_location_id: z.string().trim().min(1, "From location is required"),
  to_location_id: z.string().trim().min(1, "Destination is required"),
  price: z.coerce.number().min(1, "Price is required"),
  discount_price: optionalPositiveNumber,
  duration_days: z.coerce.number().int().min(1, "Duration days must be at least 1"),
  duration_nights: z.coerce.number().int().min(0, "Nights cannot be negative"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  type: z.enum(["normal", "group"]),
  group_size: optionalPositiveInt,
  total_seats: optionalPositiveInt,
  seats_available: optionalPositiveInt,
  hotel_details: optionalText,
  transport_details: optionalText,
  terms: optionalText,
});

export const locationSchema = z.object({
  name: z.string().trim().min(2, "Location name is required"),
  slug: z.string().trim().min(2),
  city: optionalText,
  country: optionalText,
  description: optionalText,
  image_url: optionalUrl,
  active: z.coerce.boolean().default(true),
});

export const registerSchema = z
  .object({
    full_name: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: z.string().trim().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export const testimonialSchema = z.object({
  name: z.string().trim().min(2, "Client name is required"),
  review: z.string().trim().min(5, "Review must be at least 5 characters"),
  rating: z.coerce.number().int().min(1, "Rating must be 1-5").max(5, "Rating must be 1-5"),
  image_url: optionalUrl,
  active: z.coerce.boolean().default(true),
});
