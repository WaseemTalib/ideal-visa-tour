export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

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
  gallery_images: string[] | null;
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
  included: string[] | null;
  excluded: string[] | null;
  itinerary: { day: string; title: string; detail: string }[] | null;
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
  email: string;
  phone: string | null;
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

export type SiteSettings = Record<string, Json>;

export type Profile = {
  id: string;
  full_name: string | null;
  role: "user" | "admin";
  created_at: string;
  updated_at: string;
};

type LocationInsert = Omit<Partial<Location>, "id" | "created_at" | "updated_at"> & { id?: string; name: string; slug: string };
type PackageInsert = Omit<Partial<TravelPackage>, "id" | "created_at" | "updated_at" | "from_location" | "to_location"> & {
  id?: string;
  title: string;
  slug: string;
};
type InquiryInsert = Omit<Partial<Inquiry>, "id" | "created_at" | "updated_at" | "package"> & {
  id?: string;
  name: string;
  email: string;
  message: string;
};
type TestimonialInsert = Omit<Partial<Testimonial>, "id" | "created_at" | "updated_at"> & {
  id?: string;
  name: string;
  review: string;
};
type ProfileInsert = Omit<Partial<Profile>, "created_at" | "updated_at"> & { id: string };

export type Database = {
  public: {
    Tables: {
      locations: { Row: Location; Insert: LocationInsert; Update: Partial<LocationInsert>; Relationships: [] };
      packages: { Row: TravelPackage; Insert: PackageInsert; Update: Partial<PackageInsert>; Relationships: [] };
      inquiries: { Row: Inquiry; Insert: InquiryInsert; Update: Partial<InquiryInsert>; Relationships: [] };
      testimonials: { Row: Testimonial; Insert: TestimonialInsert; Update: Partial<TestimonialInsert>; Relationships: [] };
      profiles: { Row: Profile; Insert: ProfileInsert; Update: Partial<ProfileInsert>; Relationships: [] };
      site_settings: {
        Row: { id: string; key: string; value: Json; created_at: string; updated_at: string };
        Insert: { key: string; value: Json; id?: string };
        Update: { key?: string; value?: Json };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
