export type Location = {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  country: string | null;
  description: string | null;
  image_url: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type TravelPackage = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  main_image_url: string | null;
  gallery_images: string[];
  from_location_id: string | null;
  to_location_id: string | null;
  price: number;
  discount_price: number | null;
  duration_days: number;
  duration_nights: number;
  start_date: string | null;
  end_date: string | null;
  available_from: string | null;
  available_to: string | null;
  type: "normal" | "group";
  group_size: number | null;
  total_seats: number | null;
  seats_available: number | null;
  included: string[];
  excluded: string[];
  itinerary: { day: string; title: string; detail: string }[];
  hotel_details: string | null;
  transport_details: string | null;
  terms: string | null;
  featured: boolean;
  published: boolean;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
  from_location?: Location | null;
  to_location?: Location | null;
};

export type Inquiry = {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  subject: string | null;
  message: string;
  package_id: string | null;
  type: "contact" | "booking";
  status: "new" | "contacted" | "confirmed" | "rejected";
  created_at: string;
  updated_at: string;
  package?: TravelPackage | null;
};

export type Testimonial = {
  id: string;
  name: string;
  review: string;
  rating: number;
  image_url: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type SiteSettings = Record<string, string>;

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: "user" | "admin";
  created_at: string;
  updated_at: string;
};
