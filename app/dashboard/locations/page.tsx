import { deleteLocationAction } from "@/app/actions";
import { DeleteButton } from "@/components/dashboard/delete-button";
import { LocationForm } from "@/components/dashboard/location-form";
import { getLocations } from "@/lib/data";

export default async function LocationsPage() {
  const locations = await getLocations(false);
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Manage locations</h1>
      <p className="mt-2 text-slate-600">Locations power the From / To dropdowns, package routes, and the &ldquo;Popular destinations&rdquo; section on the homepage.</p>
      <LocationForm />
      <div className="mt-6 grid gap-3">
        {locations.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center text-slate-500">No locations yet.</p>
        ) : null}
        {locations.map((location) => (
          <div key={location.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4">
            <div>
              <b>{location.name}</b>
              <p className="text-sm text-slate-600">
                {[location.city, location.country].filter(Boolean).join(", ") || "—"} · {location.active ? "Active" : "Inactive"}
              </p>
            </div>
            <DeleteButton id={location.id} action={deleteLocationAction} confirm="Are you sure you want to delete this location?" successMessage="Location deleted" />
          </div>
        ))}
      </div>
    </div>
  );
}
