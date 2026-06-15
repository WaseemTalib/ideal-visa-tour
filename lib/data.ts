import { FieldPath, Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import type { Inquiry, Location, SiteSettings, Testimonial, TravelPackage } from "@/types/database.types";

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
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  return String(value ?? new Date().toISOString());
}

function normalizeDoc<T>(id: string, data: FirebaseFirestore.DocumentData): T {
  return {
    id,
    ...data,
    created_at: toIso(data.created_at),
    updated_at: toIso(data.updated_at),
  } as T;
}

async function getLocationMap() {
  const locations = await getLocations(false);
  return new Map(locations.map((location) => [location.id, location]));
}

export async function getLocations(activeOnly = true): Promise<Location[]> {
  const db = adminDb();
  if (!db) return [];
  const snapshot = await db.collection("locations").orderBy("name").get();
  return snapshot.docs
    .map((doc) => normalizeDoc<Location>(doc.id, doc.data()))
    .filter((location) => !activeOnly || location.active);
}

export async function getPackages(filters: PackageSearch = {}, publishedOnly = true): Promise<TravelPackage[]> {
  const db = adminDb();
  if (!db) return [];

  const [snapshot, locations] = await Promise.all([db.collection("packages").orderBy("created_at", "desc").get(), getLocationMap()]);
  let packages = snapshot.docs.map((doc) => {
    const pkg = normalizeDoc<TravelPackage>(doc.id, doc.data());
    return {
      ...pkg,
      from_location: pkg.from_location_id ? locations.get(pkg.from_location_id) ?? null : null,
      to_location: pkg.to_location_id ? locations.get(pkg.to_location_id) ?? null : null,
    };
  });

  if (publishedOnly) packages = packages.filter((pkg) => pkg.published);
  if (filters.type === "normal" || filters.type === "group") packages = packages.filter((pkg) => pkg.type === filters.type);
  if (filters.featured === "true") packages = packages.filter((pkg) => pkg.featured);
  if (filters.minPrice) packages = packages.filter((pkg) => Number(pkg.price) >= Number(filters.minPrice));
  if (filters.maxPrice) packages = packages.filter((pkg) => Number(pkg.price) <= Number(filters.maxPrice));
  if (filters.duration) packages = packages.filter((pkg) => pkg.duration_days === Number(filters.duration));
  if (filters.travelers) packages = packages.filter((pkg) => !pkg.seats_available || pkg.seats_available >= Number(filters.travelers));
  if (filters.startDate) packages = packages.filter((pkg) => !pkg.available_to || pkg.available_to >= filters.startDate!);
  if (filters.endDate) packages = packages.filter((pkg) => !pkg.available_from || pkg.available_from <= filters.endDate!);
  if (filters.from) {
    packages = packages.filter(
      (pkg) => pkg.from_location?.slug === filters.from || pkg.from_location?.name.toLowerCase() === filters.from,
    );
  }
  if (filters.to) {
    packages = packages.filter(
      (pkg) => pkg.to_location?.slug === filters.to || pkg.to_location?.name.toLowerCase() === filters.to,
    );
  }

  return packages;
}

export async function getPackageBySlug(slug: string) {
  const db = adminDb();
  if (!db) return null;
  const snapshot = await db.collection("packages").where("slug", "==", slug).limit(1).get();
  const doc = snapshot.docs[0];
  if (!doc) return null;
  const locations = await getLocationMap();
  const pkg = normalizeDoc<TravelPackage>(doc.id, doc.data());
  if (!pkg.published) return null;
  return {
    ...pkg,
    from_location: pkg.from_location_id ? locations.get(pkg.from_location_id) ?? null : null,
    to_location: pkg.to_location_id ? locations.get(pkg.to_location_id) ?? null : null,
  };
}

export async function getPackageById(id: string) {
  const db = adminDb();
  if (!db) return null;
  const doc = await db.collection("packages").doc(id).get();
  if (!doc.exists) return null;
  const locations = await getLocationMap();
  const pkg = normalizeDoc<TravelPackage>(doc.id, doc.data()!);
  return {
    ...pkg,
    from_location: pkg.from_location_id ? locations.get(pkg.from_location_id) ?? null : null,
    to_location: pkg.to_location_id ? locations.get(pkg.to_location_id) ?? null : null,
  };
}

export async function getTestimonials(activeOnly = true): Promise<Testimonial[]> {
  const db = adminDb();
  if (!db) return [];
  const snapshot = await db.collection("testimonials").orderBy("created_at", "desc").get();
  return snapshot.docs
    .map((doc) => normalizeDoc<Testimonial>(doc.id, doc.data()))
    .filter((testimonial) => !activeOnly || testimonial.active);
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const db = adminDb();
  if (!db) return {};
  const snapshot = await db.collection("siteSettings").get();
  return Object.fromEntries(snapshot.docs.map((doc) => [doc.id, doc.data().value])) as SiteSettings;
}

export async function getInquiries(): Promise<Inquiry[]> {
  const db = adminDb();
  if (!db) return [];
  const snapshot = await db.collection("inquiries").orderBy("created_at", "desc").get();
  const inquiries = snapshot.docs.map((doc) => normalizeDoc<Inquiry>(doc.id, doc.data()));
  const packageIds = [...new Set(inquiries.map((inquiry) => inquiry.package_id).filter(Boolean))] as string[];
  const packages = new Map<string, TravelPackage>();

  for (let i = 0; i < packageIds.length; i += 30) {
    const batch = packageIds.slice(i, i + 30);
    const packageSnapshot = await db.collection("packages").where(FieldPath.documentId(), "in", batch).get();
    packageSnapshot.docs.forEach((doc) => packages.set(doc.id, normalizeDoc<TravelPackage>(doc.id, doc.data())));
  }

  return inquiries.map((inquiry) => ({
    ...inquiry,
    package: inquiry.package_id ? packages.get(inquiry.package_id) ?? null : null,
  }));
}
