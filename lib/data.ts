import { and, desc, eq, gte, lte, or, sql } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import type { Location, Profile, SiteSettings, Testimonial, TravelPackage } from "@/types/database.types";

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

function mapPackage(row: PackageRow): TravelPackage {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    short_description: row.short_description,
    description: row.description,
    main_image_url: row.main_image_url,
    gallery_images: row.gallery_images ?? [],
    from_location: row.from_location,
    to_location: row.to_location,
    price: row.price,
    agent_price: row.agent_price,
    discount_price: row.discount_price,
    duration_days: row.duration_days,
    duration_nights: row.duration_nights,
    start_date: row.start_date,
    end_date: row.end_date,
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
    published: row.published,
    seo_title: row.seo_title,
    seo_description: row.seo_description,
    created_at: toIso(row.created_at),
    updated_at: toIso(row.updated_at),
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

  const conditions = [] as ReturnType<typeof eq>[];
  if (publishedOnly) conditions.push(eq(schema.packages.published, true));
  if (filters.type === "international" || filters.type === "northern" || filters.type === "umrah") {
    conditions.push(eq(schema.packages.type, filters.type));
  }
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
        sql`${schema.packages.start_date} IS NULL`,
        gte(schema.packages.start_date, filters.startDate),
      )!,
    );
  }
  if (filters.endDate) {
    conditions.push(
      or(
        sql`${schema.packages.end_date} IS NULL`,
        lte(schema.packages.end_date, filters.endDate),
      )!,
    );
  }
  if (filters.from) {
    conditions.push(sql`lower(${schema.packages.from_location}) = ${filters.from.toLowerCase()}`);
  }
  if (filters.to) {
    conditions.push(sql`lower(${schema.packages.to_location}) = ${filters.to.toLowerCase()}`);
  }

  const rows = await conn
    .select()
    .from(schema.packages)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(schema.packages.created_at));

  return rows.map(mapPackage);
}

async function getOnePackage(where: ReturnType<typeof eq>) {
  const conn = db();
  if (!conn) return null;
  const rows = await conn
    .select()
    .from(schema.packages)
    .where(where)
    .limit(1);
  const row = rows[0];
  if (!row) return null;
  return mapPackage(row);
}

export async function getDistinctDestinations(): Promise<string[]> {
  const conn = db();
  if (!conn) return [];
  const rows = await conn
    .selectDistinct({ to_location: schema.packages.to_location })
    .from(schema.packages)
    .where(and(eq(schema.packages.published, true), sql`${schema.packages.to_location} IS NOT NULL`))
    .orderBy(schema.packages.to_location);
  return rows.map((r) => r.to_location!).filter(Boolean);
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

function mapProfile(row: typeof schema.profiles.$inferSelect): Profile {
  return {
    id: row.id,
    email: row.email,
    full_name: row.full_name,
    role: row.role,
    status: row.status,
    approved_at: row.approved_at ? toIso(row.approved_at) : null,
    created_at: toIso(row.created_at),
    updated_at: toIso(row.updated_at),
  };
}

function searchFilter(search?: string) {
  if (!search || !search.trim()) return undefined;
  const term = `%${search.trim()}%`;
  return sql`(${schema.profiles.email} ILIKE ${term} OR coalesce(${schema.profiles.full_name}, '') ILIKE ${term})`;
}

export async function getProfiles(): Promise<Profile[]> {
  const conn = db();
  if (!conn) return [];
  const rows = await conn
    .select()
    .from(schema.profiles)
    .orderBy(desc(schema.profiles.created_at));
  return rows.map(mapProfile);
}

export async function getPendingProfiles(search?: string): Promise<Profile[]> {
  const conn = db();
  if (!conn) return [];
  const conditions = [
    eq(schema.profiles.role, "user"),
    sql`${schema.profiles.approved_at} IS NULL`,
  ];
  const s = searchFilter(search);
  if (s) conditions.push(s);

  const rows = await conn
    .select()
    .from(schema.profiles)
    .where(and(...conditions))
    .orderBy(desc(schema.profiles.created_at));
  return rows.map(mapProfile);
}

export async function getApprovedProfiles(
  page: number,
  perPage: number,
  search?: string,
): Promise<{ rows: Profile[]; total: number }> {
  const conn = db();
  if (!conn) return { rows: [], total: 0 };
  const safePage = Math.max(1, Math.trunc(page));
  const offset = (safePage - 1) * perPage;

  const conditions = [
    eq(schema.profiles.role, "user"),
    sql`${schema.profiles.approved_at} IS NOT NULL`,
  ];
  const s = searchFilter(search);
  if (s) conditions.push(s);
  const whereClause = and(...conditions);

  const [rows, totals] = await Promise.all([
    conn
      .select()
      .from(schema.profiles)
      .where(whereClause)
      .orderBy(desc(schema.profiles.approved_at))
      .limit(perPage)
      .offset(offset),
    conn
      .select({ count: sql<string>`count(*)::int` })
      .from(schema.profiles)
      .where(whereClause),
  ]);

  return { rows: rows.map(mapProfile), total: Number(totals[0]?.count ?? 0) };
}

