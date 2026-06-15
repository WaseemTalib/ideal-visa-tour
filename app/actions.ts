"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminDb, nowTimestamp } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/auth";
import { inquirySchema, locationSchema, packageSchema, testimonialSchema } from "@/lib/validations";
import { itineraryFromText, listFromText, slugify } from "@/lib/utils";

export type ActionResult = { error?: string; success?: string; redirectTo?: string };

export type InquiryFormValues = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export type InquiryActionResult = ActionResult & { values?: InquiryFormValues };

function emptyToNull(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text || null;
}

function describeZodError(error: { issues: Array<{ message: string; path: PropertyKey[] }> }) {
  const first = error.issues[0];
  if (!first) return "Please check the form fields.";
  const label = first.path.map((segment) => String(segment)).join(".") || "field";
  return `${label}: ${first.message}`;
}

export async function signOutAction() {
  (await cookies()).delete("firebase_session");
  redirect("/login");
}

export async function createInquiryAction(
  _prev: InquiryActionResult | null,
  formData: FormData,
): Promise<InquiryActionResult> {
  const submitted: InquiryFormValues = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    subject: String(formData.get("subject") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
  };

  const parsed = inquirySchema.safeParse({
    ...submitted,
    package_id: formData.get("package_id"),
    type: formData.get("type") || "contact",
  });
  if (!parsed.success) return { error: describeZodError(parsed.error), values: submitted };

  const db = adminDb();
  if (!db) return { error: "Firebase Admin is not configured.", values: submitted };

  try {
    await db.collection("inquiries").add({
      ...parsed.data,
      email: parsed.data.email || null,
      subject: parsed.data.subject || null,
      package_id: parsed.data.package_id || null,
      status: "new",
      created_at: nowTimestamp(),
      updated_at: nowTimestamp(),
    });
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to send inquiry.",
      values: submitted,
    };
  }

  revalidatePath("/dashboard/inquiries");
  return { success: "Inquiry sent. Our team will contact you shortly." };
}

export async function savePackageAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const db = adminDb();
  if (!db) return { error: "Firebase Admin is not configured." };

  const title = String(formData.get("title") ?? "").trim();
  const parsedResult = packageSchema.safeParse({
    title,
    slug: emptyToNull(formData.get("slug")) ?? slugify(title),
    short_description: formData.get("short_description"),
    description: formData.get("description"),
    main_image_url: formData.get("main_image_url"),
    from_location_id: formData.get("from_location_id"),
    to_location_id: formData.get("to_location_id"),
    price: formData.get("price"),
    discount_price: formData.get("discount_price"),
    duration_days: formData.get("duration_days"),
    duration_nights: formData.get("duration_nights"),
    start_date: formData.get("start_date"),
    end_date: formData.get("end_date"),
    type: formData.get("type"),
    group_size: formData.get("group_size"),
    total_seats: formData.get("total_seats"),
    seats_available: formData.get("seats_available"),
    hotel_details: formData.get("hotel_details"),
    transport_details: formData.get("transport_details"),
    terms: formData.get("terms"),
  });
  if (!parsedResult.success) return { error: describeZodError(parsedResult.error) };

  const parsed = parsedResult.data;
  if (parsed.start_date > parsed.end_date) {
    return { error: "End date must be on or after the start date." };
  }

  const id = emptyToNull(formData.get("id"));
  const payload = {
    title: parsed.title,
    slug: parsed.slug,
    short_description: parsed.short_description,
    description: parsed.description,
    main_image_url: parsed.main_image_url || null,
    from_location_id: parsed.from_location_id,
    to_location_id: parsed.to_location_id,
    price: parsed.price,
    discount_price: parsed.discount_price,
    duration_days: parsed.duration_days,
    duration_nights: parsed.duration_nights,
    start_date: parsed.start_date,
    end_date: parsed.end_date,
    available_from: parsed.start_date,
    available_to: parsed.end_date,
    type: parsed.type,
    group_size: parsed.group_size,
    total_seats: parsed.total_seats,
    seats_available: parsed.seats_available,
    hotel_details: parsed.hotel_details || null,
    transport_details: parsed.transport_details || null,
    terms: parsed.terms || null,
    gallery_images: listFromText(formData.get("gallery_images")),
    included: listFromText(formData.get("included")),
    excluded: listFromText(formData.get("excluded")),
    itinerary: itineraryFromText(formData.get("itinerary")),
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    seo_title: null,
    seo_description: null,
    updated_at: nowTimestamp(),
  };

  try {
    if (id) {
      await db.collection("packages").doc(id).set(payload, { merge: true });
    } else {
      await db.collection("packages").add({ ...payload, created_at: nowTimestamp() });
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to save package." };
  }

  revalidatePath("/");
  revalidatePath("/packages");
  revalidatePath(`/packages/${parsed.slug}`);
  revalidatePath("/group-packages");
  revalidatePath("/dashboard/packages");
  revalidatePath("/dashboard/group-packages");
  return { success: id ? "Package updated." : "Package created.", redirectTo: "/dashboard/packages" };
}

export async function deletePackageAction(formData: FormData) {
  await requireAdmin();
  const db = adminDb();
  if (!db) return;
  try {
    await db.collection("packages").doc(String(formData.get("id"))).delete();
  } catch (error) {
    console.error(error);
    return;
  }
  revalidatePath("/packages");
  revalidatePath("/dashboard/packages");
}

export async function saveLocationAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const db = adminDb();
  if (!db) return { error: "Firebase Admin is not configured." };

  const name = String(formData.get("name") ?? "").trim();
  const parsedResult = locationSchema.safeParse({
    name,
    slug: emptyToNull(formData.get("slug")) ?? slugify(name),
    city: formData.get("city"),
    country: formData.get("country"),
    description: formData.get("description"),
    image_url: formData.get("image_url"),
    active: formData.get("active") === "on",
  });
  if (!parsedResult.success) return { error: describeZodError(parsedResult.error) };
  const parsed = parsedResult.data;

  const id = emptyToNull(formData.get("id"));
  const payload = {
    name: parsed.name,
    slug: parsed.slug,
    city: parsed.city || null,
    country: parsed.country || null,
    description: parsed.description || null,
    image_url: parsed.image_url || null,
    active: parsed.active,
    updated_at: nowTimestamp(),
  };

  try {
    if (id) await db.collection("locations").doc(id).set(payload, { merge: true });
    else await db.collection("locations").add({ ...payload, created_at: nowTimestamp() });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to save location." };
  }
  revalidatePath("/");
  revalidatePath("/packages");
  revalidatePath("/dashboard/locations");
  return { success: id ? "Location updated." : "Location added." };
}

export async function deleteLocationAction(formData: FormData) {
  await requireAdmin();
  const db = adminDb();
  if (!db) return;
  try {
    await db.collection("locations").doc(String(formData.get("id"))).delete();
  } catch (error) {
    console.error(error);
    return;
  }
  revalidatePath("/dashboard/locations");
  revalidatePath("/");
}

export async function updateInquiryStatusAction(formData: FormData) {
  await requireAdmin();
  const db = adminDb();
  if (!db) return;
  const status = String(formData.get("status"));
  if (!["new", "contacted", "confirmed", "rejected"].includes(status)) return;
  try {
    await db
      .collection("inquiries")
      .doc(String(formData.get("id")))
      .set({ status, updated_at: nowTimestamp() }, { merge: true });
  } catch (error) {
    console.error(error);
    return;
  }
  revalidatePath("/dashboard/inquiries");
}

export async function deleteInquiryAction(formData: FormData) {
  await requireAdmin();
  const db = adminDb();
  if (!db) return;
  try {
    await db.collection("inquiries").doc(String(formData.get("id"))).delete();
  } catch (error) {
    console.error(error);
    return;
  }
  revalidatePath("/dashboard/inquiries");
}

export async function saveTestimonialAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const db = adminDb();
  if (!db) return { error: "Firebase Admin is not configured." };

  const parsedResult = testimonialSchema.safeParse({
    name: formData.get("name"),
    review: formData.get("review"),
    rating: formData.get("rating"),
    image_url: formData.get("image_url"),
    active: formData.get("active") === "on",
  });
  if (!parsedResult.success) return { error: describeZodError(parsedResult.error) };
  const parsed = parsedResult.data;

  const id = emptyToNull(formData.get("id"));
  const payload = {
    name: parsed.name,
    review: parsed.review,
    rating: parsed.rating,
    image_url: parsed.image_url || null,
    active: parsed.active,
    updated_at: nowTimestamp(),
  };

  try {
    if (id) await db.collection("testimonials").doc(id).set(payload, { merge: true });
    else await db.collection("testimonials").add({ ...payload, created_at: nowTimestamp() });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to save testimonial." };
  }
  revalidatePath("/");
  revalidatePath("/dashboard/testimonials");
  return { success: id ? "Testimonial updated." : "Testimonial added." };
}

export async function deleteTestimonialAction(formData: FormData) {
  await requireAdmin();
  const db = adminDb();
  if (!db) return;
  try {
    await db.collection("testimonials").doc(String(formData.get("id"))).delete();
  } catch (error) {
    console.error(error);
    return;
  }
  revalidatePath("/dashboard/testimonials");
  revalidatePath("/");
}

export async function saveSiteSettingsAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const db = adminDb();
  if (!db) return { error: "Firebase Admin is not configured." };

  const settings = [
    "hero_title",
    "hero_subtitle",
    "hero_image",
    "about_content",
    "contact_phone",
    "whatsapp",
    "email",
    "address",
    "facebook",
    "instagram",
    "tiktok",
    "google_maps_embed",
    "homepage_cta",
  ];

  try {
    const batch = db.batch();
    for (const key of settings) {
      batch.set(
        db.collection("siteSettings").doc(key),
        { value: String(formData.get(key) ?? "").trim(), updated_at: nowTimestamp() },
        { merge: true },
      );
    }
    await batch.commit();
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to save settings." };
  }

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/dashboard/content");
  return { success: "Website content updated." };
}
