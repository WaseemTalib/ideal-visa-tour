import { aliasedTable, and, desc, eq, gte, lte, or, sql } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import type { Inquiry, Location, Profile, SiteSettings, Testimonial, TravelPackage } from "@/types/database.types";

export type PackageSearch = {
  from?: string;
  to?: string;
  startDate?: string;
  endDate?: string;
  type?: string;
  travelers?: string;
  minPrice?: string;
  maxPrice?: string;
  duration?: string;
  featured?: string;
};

function toIso(value: unknown) {
  if (value instanceof Date) return value.toISOString();
  return String(value ?? new Date().toISOString());
}

function mapLocation(row: typeof schema.locations.$inferSelect | null | undefined): Location | null {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    city: row.city,
    country: row.country,
    description: row.description,
    image_url: row.image_url,
    active: row.active,
    created_at: toIso(row.created_at),
    updated_at: toIso(row.updated_at),
  };
}

type PackageRow = typeof schema.packages.$inferSelect;

function mapPackage(row: PackageRow, fromLocation: Location | null, toLocation: Location | null): TravelPackage {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    short_description: row.short_description,
    description: row.description,
    main_image_url: row.main_image_url,
    gallery_images: row.gallery_images ?? [],
    from_location_id: row.from_location_id,
    to_location_id: row.to_location_id,
    price: row.price,
    discount_price: row.discount_price,
    duration_days: row.duration_days,
    duration_nights: row.duration_nights,
    start_date: row.start_date,
    end_date: row.end_date,
    available_from: row.available_from,
    available_to: row.available_to,
    type: row.type,
    group_size: row.group_size,
    total_seats: row.total_seats,
    seats_available: row.seats_available,
    included: row.included ?? [],
    excluded: row.excluded ?? [],
    itinerary: row.itinerary ?? [],
    hotel_details: row.hotel_details,
    transport_details: row.transport_details,
    terms: row.terms,
    featured: row.featured,
    published: row.published,
    seo_title: row.seo_title,
    seo_description: row.seo_description,
    created_at: toIso(row.created_at),
    updated_at: toIso(row.updated_at),
    from_location: fromLocation,
    to_location: toLocation,
  };
}

export async function getLocations(activeOnly = true): Promise<Location[]> {
  const conn = db();
  if (!conn) return [];
  const rows = await conn
    .select()
    .from(schema.locations)
    .where(activeOnly ? eq(schema.locations.active, true) : undefined)
    .orderBy(schema.locations.name);
  return rows.map((row) => mapLocation(row)!).filter(Boolean) as Location[];
}

export async function getPackages(filters: PackageSearch = {}, publishedOnly = true): Promise<TravelPackage[]> {
  const conn = db();
  if (!conn) return [];

  const fromLoc = aliasedTable(schema.locations, "from_loc");
  const toLoc = aliasedTable(schema.locations, "to_loc");

  const conditions = [] as ReturnType<typeof eq>[];
  if (publishedOnly) conditions.push(eq(schema.packages.published, true));
  if (filters.type === "normal" || filters.type === "group") {
    conditions.push(eq(schema.packages.type, filters.type));
  }
  if (filters.featured === "true") conditions.push(eq(schema.packages.featured, true));
  if (filters.minPrice) conditions.push(gte(schema.packages.price, Number(filters.minPrice)));
  if (filters.maxPrice) conditions.push(lte(schema.packages.price, Number(filters.maxPrice)));
  if (filters.duration) conditions.push(eq(schema.packages.duration_days, Number(filters.duration)));
  if (filters.travelers) {
    conditions.push(
      or(
        sql`${schema.packages.seats_available} IS NULL`,
        gte(schema.packages.seats_available, Number(filters.travelers)),
      )!,
    );
  }
  if (filters.startDate) {
    conditions.push(
      or(
        sql`${schema.packages.available_to} IS NULL`,
        gte(schema.packages.available_to, filters.startDate),
      )!,
    );
  }
  if (filters.endDate) {
    conditions.push(
      or(
        sql`${schema.packages.available_from} IS NULL`,
        lte(schema.packages.available_from, filters.endDate),
      )!,
    );
  }
  if (filters.from) {
    conditions.push(or(eq(fromLoc.slug, filters.from), sql`lower(${fromLoc.name}) = ${filters.from}`)!);
  }
  if (filters.to) {
    conditions.push(or(eq(toLoc.slug, filters.to), sql`lower(${toLoc.name}) = ${filters.to}`)!);
  }

  const rows = await conn
    .select({ pkg: schema.packages, from: fromLoc, to: toLoc })
    .from(schema.packages)
    .leftJoin(fromLoc, eq(schema.packages.from_location_id, fromLoc.id))
    .leftJoin(toLoc, eq(schema.packages.to_location_id, toLoc.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(schema.packages.created_at));

  return rows.map((r) => mapPackage(r.pkg, mapLocation(r.from), mapLocation(r.to)));
}

async function getOnePackage(where: ReturnType<typeof eq>) {
  const conn = db();
  if (!conn) return null;
  const fromLoc = aliasedTable(schema.locations, "from_loc");
  const toLoc = aliasedTable(schema.locations, "to_loc");
  const rows = await conn
    .select({ pkg: schema.packages, from: fromLoc, to: toLoc })
    .from(schema.packages)
    .leftJoin(fromLoc, eq(schema.packages.from_location_id, fromLoc.id))
    .leftJoin(toLoc, eq(schema.packages.to_location_id, toLoc.id))
    .where(where)
    .limit(1);
  const row = rows[0];
  if (!row) return null;
  return mapPackage(row.pkg, mapLocation(row.from), mapLocation(row.to));
}

export async function getPackageBySlug(slug: string) {
  const pkg = await getOnePackage(eq(schema.packages.slug, slug));
  if (!pkg || !pkg.published) return null;
  return pkg;
}

export async function getPackageById(id: string) {
  return getOnePackage(eq(schema.packages.id, id));
}

export async function getTestimonials(activeOnly = true): Promise<Testimonial[]> {
  const conn = db();
  if (!conn) return [];
  const rows = await conn
    .select()
    .from(schema.testimonials)
    .where(activeOnly ? eq(schema.testimonials.active, true) : undefined)
    .orderBy(desc(schema.testimonials.created_at));
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    review: row.review,
    rating: row.rating,
    image_url: row.image_url,
    active: row.active,
    created_at: toIso(row.created_at),
    updated_at: toIso(row.updated_at),
  }));
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const conn = db();
  if (!conn) return {};
  const rows = await conn.select().from(schema.siteSettings);
  return Object.fromEntries(rows.map((row) => [row.key, row.value])) as SiteSettings;
}

export async function getProfiles(): Promise<Profile[]> {
  const conn = db();
  if (!conn) return [];
  const rows = await conn
    .select()
    .from(schema.profiles)
    .orderBy(desc(schema.profiles.created_at));
  return rows.map((row) => ({
    id: row.id,
    email: row.email,
    full_name: row.full_name,
    role: row.role,
    created_at: toIso(row.created_at),
    updated_at: toIso(row.updated_at),
  }));
}

export async function getInquiries(): Promise<Inquiry[]> {
  const conn = db();
  if (!conn) return [];
  const rows = await conn
    .select({ inquiry: schema.inquiries, pkg: schema.packages })
    .from(schema.inquiries)
    .leftJoin(schema.packages, eq(schema.inquiries.package_id, schema.packages.id))
    .orderBy(desc(schema.inquiries.created_at));

  return rows.map(({ inquiry, pkg }) => ({
    id: inquiry.id,
    name: inquiry.name,
    email: inquiry.email,
    phone: inquiry.phone,
    subject: inquiry.subject,
    message: inquiry.message,
    package_id: inquiry.package_id,
    type: inquiry.type,
    status: inquiry.status,
    created_at: toIso(inquiry.created_at),
    updated_at: toIso(inquiry.updated_at),
    package: pkg ? mapPackage(pkg, null, null) : null,
  }));
}
