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
  from_location: string | null;
  to_location: string | null;
  price: number;
  agent_price: number | null;
  discount_price: number | null;
  duration_days: number;
  duration_nights: number;
  start_date: string | null;
  end_date: string | null;
  type: "international" | "northern" | "umrah";
  group_size: number | null;
  total_seats: number | null;
  seats_available: number | null;
  included: string[];
  excluded: string[];
  itinerary: { day: string; title: string; detail: string }[];
  hotel_details: string | null;
  transport_details: string | null;
  terms: string | null;
  published: boolean;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
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
  status: boolean;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
};
