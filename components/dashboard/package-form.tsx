"use client";

import { useActionState } from "react";
import { savePackageAction, type ActionResult } from "@/app/actions";
import { FormFeedback } from "@/components/dashboard/form-feedback";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { UploadField } from "@/components/dashboard/upload-field";
import { Checkbox } from "@/components/ui/checkbox";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import type { Location, TravelPackage } from "@/types/database.types";

const initialState: ActionResult | null = null;

export function PackageForm({ pkg, locations }: { pkg?: TravelPackage | null; locations: Location[] }) {
  const [state, formAction] = useActionState(savePackageAction, initialState);
  const itineraryDefault = (pkg?.itinerary ?? [])
    .map((item) => `${item.title}: ${item.detail}`)
    .join("\n");

  return (
    <form action={formAction} className="grid gap-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      {pkg?.id ? <input type="hidden" name="id" value={pkg.id} /> : null}
      <FormFeedback state={state} />

      <section className="grid gap-4">
        <h2 className="text-lg font-bold text-slate-950">Basics</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label required>Title</Label>
            <Input name="title" defaultValue={pkg?.title} minLength={3} required />
          </div>
          <div>
            <Label>URL slug (optional)</Label>
            <Input name="slug" defaultValue={pkg?.slug ?? ""} placeholder="auto-generated from title" />
          </div>
        </div>
        <div>
          <Label required>Short description</Label>
          <Textarea name="short_description" defaultValue={pkg?.short_description ?? ""} minLength={10} required />
        </div>
        <div>
          <Label required>Full description</Label>
          <Textarea
            name="description"
            defaultValue={pkg?.description ?? ""}
            minLength={20}
            required
            className="min-h-40"
          />
        </div>
        <UploadField
          name="main_image_url"
          label="Main image"
          bucket="package-images"
          defaultValue={pkg?.main_image_url}
          required
        />
      </section>

      <section className="grid gap-4">
        <h2 className="text-lg font-bold text-slate-950">Route &amp; pricing</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label required>From location</Label>
            <Select name="from_location_id" defaultValue={pkg?.from_location_id ?? ""} required>
              <option value="">Select</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>{location.name}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label required>Destination</Label>
            <Select name="to_location_id" defaultValue={pkg?.to_location_id ?? ""} required>
              <option value="">Select</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>{location.name}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label required>Category</Label>
            <Select name="type" defaultValue={pkg?.type ?? "international"}>
              <option value="international">International</option>
              <option value="northern">Northern Pakistan</option>
              <option value="umrah">Umrah</option>
            </Select>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label required>Price (PKR)</Label>
            <Input name="price" type="number" min="1" step="1" defaultValue={pkg?.price ?? ""} required />
          </div>
          <div>
            <Label required>Agent price (PKR)</Label>
            <Input
              name="agent_price"
              type="number"
              min="1"
              step="1"
              defaultValue={pkg?.agent_price ?? ""}
              required
            />
          </div>
          <div>
            <Label>Discount price (optional)</Label>
            <Input
              name="discount_price"
              type="number"
              min="0"
              step="1"
              defaultValue={pkg?.discount_price ?? ""}
              placeholder="Leave empty for none"
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4">
        <h2 className="text-lg font-bold text-slate-950">Schedule</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <Label required>Duration days</Label>
            <Input name="duration_days" type="number" min="1" step="1" defaultValue={pkg?.duration_days ?? 3} required />
          </div>
          <div>
            <Label required>Duration nights</Label>
            <Input name="duration_nights" type="number" min="0" step="1" defaultValue={pkg?.duration_nights ?? 2} required />
          </div>
          <div>
            <Label required>Start date</Label>
            <Input name="start_date" type="date" defaultValue={pkg?.start_date ?? ""} required />
          </div>
          <div>
            <Label required>End date</Label>
            <Input name="end_date" type="date" defaultValue={pkg?.end_date ?? ""} required />
          </div>
        </div>
      </section>

      <section className="grid gap-4">
        <h2 className="text-lg font-bold text-slate-950">Group capacity</h2>
        <p className="-mt-1 text-sm text-slate-600">Optional. Use when the package is sold as a fixed-departure group with a seat cap.</p>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label>Group size</Label>
            <Input name="group_size" type="number" min="0" step="1" defaultValue={pkg?.group_size ?? ""} />
          </div>
          <div>
            <Label>Total seats</Label>
            <Input name="total_seats" type="number" min="0" step="1" defaultValue={pkg?.total_seats ?? ""} />
          </div>
          <div>
            <Label>Seats available</Label>
            <Input name="seats_available" type="number" min="0" step="1" defaultValue={pkg?.seats_available ?? ""} />
          </div>
        </div>
      </section>

      <section className="grid gap-4">
        <h2 className="text-lg font-bold text-slate-950">What&apos;s included</h2>
        <div>
          <Label required>Included services (one per line)</Label>
          <Textarea name="included" defaultValue={(pkg?.included ?? []).join("\n")} minLength={3} required />
        </div>
        <div>
          <Label>Excluded services (one per line, optional)</Label>
          <Textarea name="excluded" defaultValue={(pkg?.excluded ?? []).join("\n")} />
        </div>
        <div>
          <Label required>Itinerary (one day per line as &quot;Title: Detail&quot;)</Label>
          <Textarea
            name="itinerary"
            defaultValue={itineraryDefault}
            minLength={10}
            required
            className="min-h-36"
          />
        </div>
      </section>

      <section className="grid gap-4">
        <h2 className="text-lg font-bold text-slate-950">Extra details</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Hotel details</Label>
            <Textarea name="hotel_details" defaultValue={pkg?.hotel_details ?? ""} />
          </div>
          <div>
            <Label>Transport details</Label>
            <Textarea name="transport_details" defaultValue={pkg?.transport_details ?? ""} />
          </div>
        </div>
        <div>
          <Label>Terms &amp; conditions</Label>
          <Textarea name="terms" defaultValue={pkg?.terms ?? ""} />
        </div>
        <div>
          <Label>Gallery image URLs (one per line, optional)</Label>
          <Textarea name="gallery_images" defaultValue={(pkg?.gallery_images ?? []).join("\n")} placeholder="https://..." />
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-x-8 gap-y-4 rounded-xl border border-slate-200/70 bg-slate-50/60 p-4">
        <Checkbox
          name="featured"
          defaultChecked={pkg?.featured ?? false}
          label="Featured on homepage"
          description="Highlights this package in the featured carousel."
        />
        <Checkbox
          name="published"
          defaultChecked={pkg?.published ?? true}
          label="Published"
          description="Visible to visitors on the public site."
        />
      </div>

      <SubmitButton pendingLabel="Saving package…">Save package</SubmitButton>
    </form>
  );
}
