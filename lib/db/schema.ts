import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const packageType = pgEnum("package_type", ["normal", "group"]);
export const inquiryType = pgEnum("inquiry_type", ["contact", "booking"]);
export const inquiryStatus = pgEnum("inquiry_status", ["new", "contacted", "confirmed", "rejected"]);
export const profileRole = pgEnum("profile_role", ["user", "admin"]);

const timestamps = {
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
};

export const locations = pgTable("locations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  city: text("city"),
  country: text("country"),
  description: text("description"),
  image_url: text("image_url"),
  active: boolean("active").default(true).notNull(),
  ...timestamps,
});

export const packages = pgTable("packages", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  short_description: text("short_description"),
  description: text("description"),
  main_image_url: text("main_image_url"),
  gallery_images: text("gallery_images").array().notNull().default(sql`'{}'::text[]`),
  from_location_id: text("from_location_id").references(() => locations.id, { onDelete: "set null" }),
  to_location_id: text("to_location_id").references(() => locations.id, { onDelete: "set null" }),
  price: integer("price").notNull(),
  discount_price: integer("discount_price"),
  duration_days: integer("duration_days").notNull(),
  duration_nights: integer("duration_nights").notNull(),
  start_date: date("start_date"),
  end_date: date("end_date"),
  available_from: date("available_from"),
  available_to: date("available_to"),
  type: packageType("type").notNull().default("normal"),
  group_size: integer("group_size"),
  total_seats: integer("total_seats"),
  seats_available: integer("seats_available"),
  included: text("included").array().notNull().default(sql`'{}'::text[]`),
  excluded: text("excluded").array().notNull().default(sql`'{}'::text[]`),
  itinerary: jsonb("itinerary").$type<{ day: string; title: string; detail: string }[]>().notNull().default([]),
  hotel_details: text("hotel_details"),
  transport_details: text("transport_details"),
  terms: text("terms"),
  featured: boolean("featured").default(false).notNull(),
  published: boolean("published").default(true).notNull(),
  seo_title: text("seo_title"),
  seo_description: text("seo_description"),
  ...timestamps,
});

export const inquiries = pgTable("inquiries", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  package_id: text("package_id").references(() => packages.id, { onDelete: "set null" }),
  type: inquiryType("type").notNull().default("contact"),
  status: inquiryStatus("status").notNull().default("new"),
  ...timestamps,
});

export const testimonials = pgTable("testimonials", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  review: text("review").notNull(),
  rating: integer("rating").notNull(),
  image_url: text("image_url"),
  active: boolean("active").default(true).notNull(),
  ...timestamps,
});

export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull().default(""),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  password_hash: text("password_hash").notNull(),
  full_name: text("full_name"),
  role: profileRole("role").notNull().default("user"),
  ...timestamps,
});

export type Package = typeof packages.$inferSelect;
export type NewPackage = typeof packages.$inferInsert;
export type Location = typeof locations.$inferSelect;
export type NewLocation = typeof locations.$inferInsert;
export type Inquiry = typeof inquiries.$inferSelect;
export type NewInquiry = typeof inquiries.$inferInsert;
export type Testimonial = typeof testimonials.$inferSelect;
export type NewTestimonial = typeof testimonials.$inferInsert;
export type SiteSetting = typeof siteSettings.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
