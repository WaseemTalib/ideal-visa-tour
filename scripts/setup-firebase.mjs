import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

const root = process.cwd();

function parseEnv(content) {
  const env = {};
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const [key, ...rest] = line.split("=");
    env[key] = rest.join("=").trim().replace(/^['"]|['"]$/g, "");
  }
  return env;
}

async function loadEnv() {
  const env = { ...process.env };
  for (const file of [".env.local", ".env"]) {
    try {
      Object.assign(env, parseEnv(await fs.readFile(path.join(root, file), "utf8")));
    } catch {
      // Optional env file.
    }
  }
  return env;
}

function initFirebase(env) {
  const projectId = env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId || !env.FIREBASE_CLIENT_EMAIL || !env.FIREBASE_PRIVATE_KEY) {
    throw new Error(
      [
        "Missing Firebase Admin credentials.",
        "Set NEXT_PUBLIC_FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in .env.",
      ].join("\n"),
    );
  }

  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
      storageBucket:
        env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
        `${projectId}.appspot.com`,
    });
  }

  return { auth: getAuth(), db: getFirestore() };
}

async function setDoc(collection, id, data) {
  await collection.doc(id).set(
    {
      ...data,
      updated_at: Timestamp.now(),
      created_at: data.created_at || Timestamp.now(),
    },
    { merge: true },
  );
}

async function seedFirestore(db) {
  const locations = {
    lahore: {
      name: "Lahore",
      slug: "lahore",
      city: "Lahore",
      country: "Pakistan",
      description: "Departure city for our international tour packages.",
      image_url: "https://images.unsplash.com/photo-1609947017136-9daf32a5eb16?auto=format&fit=crop&w=1200&q=80",
      active: true,
    },
    istanbul: {
      name: "Istanbul",
      slug: "istanbul",
      city: "Istanbul",
      country: "Türkiye",
      description: "Bosphorus city blending Europe and Asia — visa-friendly for Pakistani passport holders.",
      image_url: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80",
      active: true,
    },
    dubai: {
      name: "Dubai",
      slug: "dubai",
      city: "Dubai",
      country: "United Arab Emirates",
      description: "Skylines, desert safari, and Burj Khalifa with 30/60-day tourist visas.",
      image_url: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80",
      active: true,
    },
    bangkok: {
      name: "Bangkok",
      slug: "bangkok",
      city: "Bangkok",
      country: "Thailand",
      description: "Temples, street food, and easy island connections — straightforward e-visa.",
      image_url: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80",
      active: true,
    },
    "kuala-lumpur": {
      name: "Kuala Lumpur",
      slug: "kuala-lumpur",
      city: "Kuala Lumpur",
      country: "Malaysia",
      description: "Petronas Towers and rainforest day trips — e-visa available for Pakistan.",
      image_url: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80",
      active: true,
    },
    male: {
      name: "Maldives",
      slug: "maldives",
      city: "Malé",
      country: "Maldives",
      description: "Over-water villas and reef snorkelling with visa-on-arrival.",
      image_url: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80",
      active: true,
    },
    baku: {
      name: "Baku",
      slug: "baku",
      city: "Baku",
      country: "Azerbaijan",
      description: "Caspian coast capital with quick e-visa processing and short flights.",
      image_url: "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?auto=format&fit=crop&w=1200&q=80",
      active: true,
    },
  };

  for (const [id, data] of Object.entries(locations)) {
    await setDoc(db.collection("locations"), id, data);
  }

  await setDoc(db.collection("packages"), "turkiye-classic-7-days", {
    title: "Türkiye Classic — 7 Days",
    slug: "turkiye-classic-7-days",
    short_description: "Istanbul + Cappadocia hot-air balloon experience with visa assistance.",
    description:
      "A 7-day private package covering Istanbul's old city, Bosphorus cruise, and a Cappadocia balloon ride — with visa documentation, return flights, hotels, and local transfers all coordinated by our team.",
    main_image_url: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1600&q=80",
    gallery_images: ["https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1200&q=80"],
    from_location_id: "lahore",
    to_location_id: "istanbul",
    price: 425000,
    discount_price: 395000,
    duration_days: 7,
    duration_nights: 6,
    start_date: "2026-09-12",
    end_date: "2026-09-18",
    available_from: "2026-08-01",
    available_to: "2026-11-30",
    type: "normal",
    group_size: null,
    total_seats: null,
    seats_available: null,
    included: [
      "Türkiye e-visa documentation",
      "Return economy flights",
      "4-star hotels (twin sharing)",
      "Daily breakfast",
      "Airport transfers",
      "Cappadocia balloon ride",
    ],
    excluded: ["Personal shopping", "Lunch and dinner", "Travel insurance"],
    itinerary: [
      { day: "Day 1", title: "Arrive Istanbul", detail: "Airport pickup and hotel check-in near Sultanahmet." },
      { day: "Day 2", title: "Old city tour", detail: "Hagia Sophia, Blue Mosque, Grand Bazaar." },
      { day: "Day 3", title: "Bosphorus cruise", detail: "Day cruise with European and Asian shoreline stops." },
      { day: "Day 4", title: "Fly to Cappadocia", detail: "Domestic flight and Goreme valley orientation." },
      { day: "Day 5", title: "Balloon sunrise", detail: "Hot-air balloon ride and underground city tour." },
      { day: "Day 6", title: "Return to Istanbul", detail: "Free evening for shopping at Istinye Park." },
      { day: "Day 7", title: "Depart home", detail: "Airport transfer for return flight." },
    ],
    hotel_details: "4-star city hotels in Istanbul (Sultanahmet) and cave hotel in Cappadocia.",
    transport_details: "Private vehicle in Istanbul, domestic flight to Cappadocia.",
    terms: "Visa support included; final approval rests with the consulate. 50% advance to confirm.",
    featured: true,
    published: true,
    seo_title: "Türkiye 7-Day Tour with Visa Support",
    seo_description: "Istanbul and Cappadocia 7-day package with end-to-end visa documentation from Lahore.",
  });

  await setDoc(db.collection("packages"), "dubai-city-break-4-days", {
    title: "Dubai City Break — 4 Days",
    slug: "dubai-city-break-4-days",
    short_description: "Burj Khalifa, desert safari, and Marina cruise with 30-day tourist visa.",
    description:
      "A short long-weekend escape to Dubai covering the Burj Khalifa observation deck, an evening desert safari with BBQ, and a dhow cruise on the Marina. Tourist visa and return flights bundled.",
    main_image_url: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1600&q=80",
    gallery_images: ["https://images.unsplash.com/photo-1582672060674-bc2bd808a8ce?auto=format&fit=crop&w=1200&q=80"],
    from_location_id: "lahore",
    to_location_id: "dubai",
    price: 215000,
    discount_price: null,
    duration_days: 4,
    duration_nights: 3,
    start_date: "2026-10-23",
    end_date: "2026-10-26",
    available_from: "2026-09-01",
    available_to: "2027-03-31",
    type: "normal",
    group_size: null,
    total_seats: null,
    seats_available: null,
    included: [
      "30-day UAE tourist visa",
      "Return economy flights",
      "4-star hotel (twin sharing)",
      "Daily breakfast",
      "Burj Khalifa Level 124 entry",
      "Desert safari with BBQ dinner",
    ],
    excluded: ["Lunch", "Personal expenses", "Optional theme parks"],
    itinerary: [
      { day: "Day 1", title: "Arrive Dubai", detail: "Hotel check-in and Marina cruise in the evening." },
      { day: "Day 2", title: "City + Burj Khalifa", detail: "Old Dubai, gold souk, then Burj Khalifa at sunset." },
      { day: "Day 3", title: "Desert safari", detail: "Dune bashing, camel ride, and BBQ at the camp." },
      { day: "Day 4", title: "Depart home", detail: "Last-minute mall stop and airport drop." },
    ],
    hotel_details: "4-star hotel in Bur Dubai or Deira.",
    transport_details: "Shared SIC transfers; private upgrade available.",
    terms: "Visa application requires 6-month passport validity and recent photo.",
    featured: true,
    published: true,
    seo_title: "Dubai 4-Day Tour Package with Visa",
    seo_description: "Long-weekend Dubai package with tourist visa, flights, and tours.",
  });

  await setDoc(db.collection("packages"), "thailand-group-departure", {
    title: "Thailand Group Departure — Bangkok + Phuket",
    slug: "thailand-group-departure",
    short_description: "8-day fixed-departure group tour covering Bangkok temples and Phuket islands.",
    description:
      "Join a curated group departure to Thailand covering Bangkok city tour, Pattaya Coral Island, and the Phi Phi islands from Phuket. Group coordinator travels with you throughout.",
    main_image_url: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1600&q=80",
    gallery_images: ["https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=80"],
    from_location_id: "lahore",
    to_location_id: "bangkok",
    price: 285000,
    discount_price: null,
    duration_days: 8,
    duration_nights: 7,
    start_date: "2026-12-20",
    end_date: "2026-12-27",
    available_from: "2026-12-20",
    available_to: "2026-12-20",
    type: "group",
    group_size: 20,
    total_seats: 24,
    seats_available: 11,
    included: [
      "Thailand e-visa support",
      "Return economy flights",
      "3-star hotels (twin sharing)",
      "Daily breakfast",
      "Group coordinator",
      "Phi Phi island day tour",
    ],
    excluded: ["Travel insurance", "Personal shopping", "Optional spa"],
    itinerary: [
      { day: "Day 1", title: "Arrive Bangkok", detail: "Airport pickup and group welcome dinner." },
      { day: "Day 2", title: "Bangkok city tour", detail: "Grand Palace, reclining Buddha, Chao Phraya river." },
      { day: "Day 3", title: "Pattaya transfer", detail: "Drive to Pattaya and free evening on the beach." },
      { day: "Day 4", title: "Coral Island", detail: "Speedboat day trip with watersports options." },
      { day: "Day 5", title: "Fly to Phuket", detail: "Domestic flight and Patong evening walk." },
      { day: "Day 6", title: "Phi Phi islands", detail: "Full-day island-hopping by speedboat." },
      { day: "Day 7", title: "Phuket town", detail: "Old town walk and Karon viewpoint." },
      { day: "Day 8", title: "Depart home", detail: "Airport drop for return flight." },
    ],
    hotel_details: "3-star hotels in Bangkok (Sukhumvit), Pattaya (Beach Road), and Phuket (Patong).",
    transport_details: "Group coach for transfers, domestic flight Bangkok → Phuket.",
    terms: "Seats confirm after 50% advance. Minimum 12 travelers required for departure.",
    featured: true,
    published: true,
    seo_title: "Thailand 8-Day Group Tour with Visa",
    seo_description: "Fixed-departure Bangkok and Phuket group package from Lahore with e-visa support.",
  });

  await setDoc(db.collection("packages"), "maldives-honeymoon-5-days", {
    title: "Maldives Honeymoon — 5 Days",
    slug: "maldives-honeymoon-5-days",
    short_description: "Over-water villa with seaplane transfer and visa-on-arrival.",
    description:
      "A 5-day honeymoon package at a 4-star resort with over-water villa, seaplane transfer, half-board meals, and snorkelling gear. Visa-on-arrival means no embassy paperwork.",
    main_image_url: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1600&q=80",
    gallery_images: [],
    from_location_id: "lahore",
    to_location_id: "maldives",
    price: 595000,
    discount_price: null,
    duration_days: 5,
    duration_nights: 4,
    start_date: null,
    end_date: null,
    available_from: "2026-09-01",
    available_to: "2027-04-30",
    type: "normal",
    group_size: null,
    total_seats: null,
    seats_available: null,
    included: [
      "Return economy flights",
      "Seaplane resort transfer",
      "Over-water villa (4 nights)",
      "Half-board meals",
      "Snorkelling gear",
      "Honeymoon set-up at arrival",
    ],
    excluded: ["Alcohol", "Spa treatments", "Optional excursions"],
    itinerary: [
      { day: "Day 1", title: "Fly to Malé", detail: "Arrive Velana airport, seaplane to resort island." },
      { day: "Day 2", title: "Beach day", detail: "Relax at the villa, sunset cruise included." },
      { day: "Day 3", title: "Snorkelling trip", detail: "Reef snorkelling and sandbank visit." },
      { day: "Day 4", title: "Free day", detail: "Optional spa, water sports, or quiet beach time." },
      { day: "Day 5", title: "Depart home", detail: "Seaplane to Malé and return flight." },
    ],
    hotel_details: "4-star resort, over-water villa with direct lagoon access.",
    transport_details: "Seaplane transfer from Velana International Airport.",
    terms: "Visa-on-arrival for Pakistani passport holders. Resort booking is non-refundable within 30 days.",
    featured: false,
    published: true,
    seo_title: "Maldives 5-Day Honeymoon Package",
    seo_description: "Maldives over-water villa honeymoon with seaplane transfer and visa-on-arrival.",
  });

  await setDoc(db.collection("testimonials"), "ayesha-khan", {
    name: "Ayesha Khan",
    review: "Türkiye visa was approved without any back-and-forth — the team handled every document and the Cappadocia balloon ride was magical.",
    rating: 5,
    image_url: null,
    active: true,
  });
  await setDoc(db.collection("testimonials"), "bilal-ahmed", {
    name: "Bilal Ahmed",
    review: "Booked the Thailand group departure for our family. Hotels were clean, the coordinator was responsive, and the e-visa support saved us hours.",
    rating: 5,
    image_url: null,
    active: true,
  });
  await setDoc(db.collection("testimonials"), "saad-malik", {
    name: "Saad Malik",
    review: "Dubai weekend with the family was seamless — visa came through in 4 days and the desert safari was the highlight.",
    rating: 5,
    image_url: null,
    active: true,
  });

  const settings = {
    hero_title: "International tours with end-to-end visa support",
    hero_subtitle:
      "Curated trips to Türkiye, Dubai, Malaysia, Thailand, Maldives and beyond — documentation, hotels, transfers, and local guides handled for you.",
    hero_image: "https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=2400&q=85",
    about_content:
      "Ideal Visa Tour helps travelers reach international destinations end-to-end — visa documentation, flights, hotels, transfers, and local guides — so the trip starts the moment you land.",
    contact_phone: "+92 300 0000000",
    whatsapp: "+92 300 0000000",
    email: "info@idealvisatour.com",
    address: "Office 12, Main Boulevard, Lahore, Pakistan",
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    tiktok: "",
    google_maps_embed: "",
    homepage_cta: "Ready to plan your next international trip?",
  };

  for (const [key, value] of Object.entries(settings)) {
    await db.collection("siteSettings").doc(key).set({ value, updated_at: Timestamp.now() }, { merge: true });
  }

  console.log("Seeded Firestore international locations, packages, testimonials, and site settings.");
}

async function createAdmin(env, auth, db) {
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
    console.log("Skipping admin creation. Set ADMIN_EMAIL and ADMIN_PASSWORD to create one.");
    return;
  }

  let user;
  try {
    user = await auth.getUserByEmail(env.ADMIN_EMAIL);
    console.log(`Found existing Firebase Auth user: ${env.ADMIN_EMAIL}`);
  } catch {
    user = await auth.createUser({
      email: env.ADMIN_EMAIL,
      password: env.ADMIN_PASSWORD,
      displayName: "Admin User",
      emailVerified: true,
    });
    console.log(`Created Firebase Auth user: ${env.ADMIN_EMAIL}`);
  }

  await db.collection("profiles").doc(user.uid).set(
    {
      full_name: "Admin User",
      role: "admin",
      updated_at: Timestamp.now(),
      created_at: Timestamp.now(),
    },
    { merge: true },
  );
  await auth.setCustomUserClaims(user.uid, { role: "admin" });
  console.log(`Promoted ${env.ADMIN_EMAIL} to admin.`);
}

async function main() {
  const env = await loadEnv();
  const { auth, db } = initFirebase(env);
  await seedFirestore(db);
  await createAdmin(env, auth, db);
  console.log("Firebase setup completed.");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
