import { NavLink } from "@/components/dashboard/nav-link";
import { getPackages } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function DashboardGroupPackagesPage() {
  const packages = await getPackages({ type: "group" }, false);
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Manage group packages</h1>
      <p className="mt-2 text-slate-600">Group packages are packages with type set to group. Create or edit them from package management.</p>
      <div className="mt-6 grid gap-4">
        {packages.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">No group packages yet.</p>
        ) : null}
        {packages.map((pkg) => (
          <div key={pkg.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-bold text-slate-950">{pkg.title}</h2>
                <p className="text-sm text-slate-600">
                  {pkg.from_location?.name} to {pkg.to_location?.name} · {formatDate(pkg.start_date)} to {formatDate(pkg.end_date)}
                </p>
              </div>
              <div className="text-sm text-slate-700">
                Seats: {pkg.seats_available ?? 0}/{pkg.total_seats ?? 0} · {formatCurrency(pkg.price)}
              </div>
              <NavLink href={`/dashboard/packages/${pkg.id}/edit`}>Edit</NavLink>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
