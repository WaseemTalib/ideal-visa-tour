"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { requireDb, schema } from "@/lib/db";
import { requireAdmin, SESSION_COOKIE } from "@/lib/auth";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import {
  changePasswordSchema,
  inquirySchema,
  locationSchema,
  packageSchema,
  registerSchema,
  testimonialSchema,
} from "@/lib/validations";
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

export type RegisterFormValues = {
  full_name: string;
  email: string;
};

export type RegisterActionResult = ActionResult & { values?: RegisterFormValues };

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

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export async function signOutAction() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function registerUserAction(
  _prev: RegisterActionResult | null,
  formData: FormData,
): Promise<RegisterActionResult> {
  const submitted: RegisterFormValues = {
    full_name: String(formData.get("full_name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
  };

  const parsed = registerSchema.safeParse({
    ...submitted,
    password: String(formData.get("password") ?? ""),
    confirm_password: String(formData.get("confirm_password") ?? ""),
  });
  if (!parsed.success) return { error: describeZodError(parsed.error), values: submitted };

  try {
    const db = requireDb();
    const existing = await db
      .select({ id: schema.profiles.id })
      .from(schema.profiles)
      .where(eq(schema.profiles.email, parsed.data.email))
      .limit(1);
    if (existing.length) {
      return { error: "An account with this email already exists.", values: submitted };
    }
    await db.insert(schema.profiles).values({
      email: parsed.data.email,
      password_hash: await hashPassword(parsed.data.password),
      full_name: parsed.data.full_name,
      role: "user",
    });
  } catch (error) {
    return { error: errorMessage(error, "Unable to create account."), values: submitted };
  }

  return { success: "Contact Admin for approval" };
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

  try {
    await requireDb()
      .insert(schema.inquiries)
      .values({
        name: parsed.data.name,
        email: parsed.data.email || null,
        phone: parsed.data.phone,
        subject: parsed.data.subject || null,
        message: parsed.data.message,
        package_id: parsed.data.package_id || null,
        type: parsed.data.type,
        status: "new",
      });
  } catch (error) {
    return { error: errorMessage(error, "Unable to send inquiry."), values: submitted };
  }

  revalidatePath("/dashboard/inquiries");
  return { success: "Inquiry sent. Our team will contact you shortly." };
}

export async function savePackageAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();

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
    agent_price: formData.get("agent_price"),
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

  const id = emptyToNull(formData.get("id")) ?? parsed.slug;
  const payload = {
    title: parsed.title,
    slug: parsed.slug,
    short_description: parsed.short_description,
    description: parsed.description,
    main_image_url: parsed.main_image_url || null,
    from_location_id: parsed.from_location_id,
    to_location_id: parsed.to_location_id,
    price: parsed.price,
    agent_price: parsed.agent_price,
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
  };

  const editing = emptyToNull(formData.get("id"));
  try {
    if (editing) {
      await requireDb()
        .update(schema.packages)
        .set({ ...payload, updated_at: new Date() })
        .where(eq(schema.packages.id, editing));
    } else {
      await requireDb().insert(schema.packages).values({ id, ...payload });
    }
  } catch (error) {
    return { error: errorMessage(error, "Unable to save package.") };
  }

  revalidatePath("/");
  revalidatePath("/packages");
  revalidatePath(`/packages/${parsed.slug}`);
  revalidatePath("/group-packages");
  revalidatePath("/dashboard/packages");
  revalidatePath("/dashboard/group-packages");
  return { success: editing ? "Package updated." : "Package created.", redirectTo: "/dashboard/packages" };
}

export async function deletePackageAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  try {
    await requireDb().delete(schema.packages).where(eq(schema.packages.id, id));
  } catch (error) {
    console.error(error);
    return;
  }
  revalidatePath("/packages");
  revalidatePath("/dashboard/packages");
}

export async function saveLocationAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();

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

  const editing = emptyToNull(formData.get("id"));
  const payload = {
    name: parsed.name,
    slug: parsed.slug,
    city: parsed.city || null,
    country: parsed.country || null,
    description: parsed.description || null,
    image_url: parsed.image_url || null,
    active: parsed.active,
  };

  try {
    if (editing) {
      await requireDb()
        .update(schema.locations)
        .set({ ...payload, updated_at: new Date() })
        .where(eq(schema.locations.id, editing));
    } else {
      await requireDb().insert(schema.locations).values({ id: parsed.slug, ...payload });
    }
  } catch (error) {
    return { error: errorMessage(error, "Unable to save location.") };
  }
  revalidatePath("/");
  revalidatePath("/packages");
  revalidatePath("/dashboard/locations");
  return { success: editing ? "Location updated." : "Location added." };
}

export async function deleteLocationAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  try {
    await requireDb().delete(schema.locations).where(eq(schema.locations.id, id));
  } catch (error) {
    console.error(error);
    return;
  }
  revalidatePath("/dashboard/locations");
  revalidatePath("/");
}

export async function updateInquiryStatusAction(formData: FormData) {
  await requireAdmin();
  const status = String(formData.get("status"));
  if (!["new", "contacted", "confirmed", "rejected"].includes(status)) return;
  const id = String(formData.get("id"));
  try {
    await requireDb()
      .update(schema.inquiries)
      .set({ status: status as typeof schema.inquiryStatus.enumValues[number], updated_at: new Date() })
      .where(eq(schema.inquiries.id, id));
  } catch (error) {
    console.error(error);
    return;
  }
  revalidatePath("/dashboard/inquiries");
}

export async function deleteInquiryAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  try {
    await requireDb().delete(schema.inquiries).where(eq(schema.inquiries.id, id));
  } catch (error) {
    console.error(error);
    return;
  }
  revalidatePath("/dashboard/inquiries");
}

export async function saveTestimonialAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const parsedResult = testimonialSchema.safeParse({
    name: formData.get("name"),
    review: formData.get("review"),
    rating: formData.get("rating"),
    image_url: formData.get("image_url"),
    active: formData.get("active") === "on",
  });
  if (!parsedResult.success) return { error: describeZodError(parsedResult.error) };
  const parsed = parsedResult.data;

  const editing = emptyToNull(formData.get("id"));
  const payload = {
    name: parsed.name,
    review: parsed.review,
    rating: parsed.rating,
    image_url: parsed.image_url || null,
    active: parsed.active,
  };

  try {
    if (editing) {
      await requireDb()
        .update(schema.testimonials)
        .set({ ...payload, updated_at: new Date() })
        .where(eq(schema.testimonials.id, editing));
    } else {
      await requireDb().insert(schema.testimonials).values({ id: slugify(parsed.name), ...payload });
    }
  } catch (error) {
    return { error: errorMessage(error, "Unable to save testimonial.") };
  }
  revalidatePath("/");
  revalidatePath("/dashboard/testimonials");
  return { success: editing ? "Testimonial updated." : "Testimonial added." };
}

export async function deleteTestimonialAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  try {
    await requireDb().delete(schema.testimonials).where(eq(schema.testimonials.id, id));
  } catch (error) {
    console.error(error);
    return;
  }
  revalidatePath("/dashboard/testimonials");
  revalidatePath("/");
}

export async function approveUserAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const now = new Date();
  try {
    await requireDb()
      .update(schema.profiles)
      .set({ status: true, approved_at: now, updated_at: now })
      .where(eq(schema.profiles.id, id));
  } catch (error) {
    console.error(error);
    return;
  }
  revalidatePath("/dashboard/users");
}

export async function enableUserAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  try {
    await requireDb()
      .update(schema.profiles)
      .set({ status: true, updated_at: new Date() })
      .where(eq(schema.profiles.id, id));
  } catch (error) {
    console.error(error);
    return;
  }
  revalidatePath("/dashboard/users");
}

export async function disableUserAction(formData: FormData) {
  const { profile } = await requireAdmin();
  const id = String(formData.get("id"));
  if (id === profile.id) {
    console.warn("Refusing to disable the currently signed-in admin.");
    return;
  }
  try {
    await requireDb()
      .update(schema.profiles)
      .set({ status: false, updated_at: new Date() })
      .where(eq(schema.profiles.id, id));
  } catch (error) {
    console.error(error);
    return;
  }
  revalidatePath("/dashboard/users");
}

export async function changePasswordAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const { profile } = await requireAdmin();

  const parsed = changePasswordSchema.safeParse({
    current_password: formData.get("current_password"),
    new_password: formData.get("new_password"),
    confirm_password: formData.get("confirm_password"),
  });
  if (!parsed.success) return { error: describeZodError(parsed.error) };

  try {
    const db = requireDb();
    const [row] = await db
      .select({ password_hash: schema.profiles.password_hash })
      .from(schema.profiles)
      .where(eq(schema.profiles.id, profile.id))
      .limit(1);
    if (!row) return { error: "Account not found." };

    const ok = await verifyPassword(parsed.data.current_password, row.password_hash);
    if (!ok) return { error: "Current password is incorrect." };

    const newHash = await hashPassword(parsed.data.new_password);
    await db
      .update(schema.profiles)
      .set({ password_hash: newHash, updated_at: new Date() })
      .where(eq(schema.profiles.id, profile.id));
  } catch (error) {
    return { error: errorMessage(error, "Unable to change password.") };
  }

  return { success: "Password updated." };
}

export async function deleteUserAction(formData: FormData) {
  const { profile } = await requireAdmin();
  const id = String(formData.get("id"));
  if (id === profile.id) {
    console.warn("Refusing to delete the currently signed-in admin.");
    return;
  }
  try {
    await requireDb().delete(schema.profiles).where(eq(schema.profiles.id, id));
  } catch (error) {
    console.error(error);
    return;
  }
  revalidatePath("/dashboard/users");
}

export async function saveSiteSettingsAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const keys = [
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
    for (const key of keys) {
      const value = String(formData.get(key) ?? "").trim();
      await requireDb()
        .insert(schema.siteSettings)
        .values({ key, value })
        .onConflictDoUpdate({
          target: schema.siteSettings.key,
          set: { value, updated_at: new Date() },
        });
    }
  } catch (error) {
    return { error: errorMessage(error, "Unable to save settings.") };
  }

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/dashboard/content");
  return { success: "Website content updated." };
}
