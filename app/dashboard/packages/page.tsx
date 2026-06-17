import { deletePackageAction } from "@/app/actions";
import { DeleteButton } from "@/components/dashboard/delete-button";
import { NavLink } from "@/components/dashboard/nav-link";
import { getPackages } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export default async function DashboardPackagesPage() {
  const packages = await getPackages({}, false);
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Manage packages</h1>
        <NavLink href="/dashboard/packages/new" variant="primary">
          Create package
        </NavLink>
      </div>
      <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="p-3">Title</th>
              <th>Type</th>
              <th>Price</th>
              <th>Featured</th>
              <th>Published</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-slate-500">
                  No packages yet. Create your first one.
                </td>
              </tr>
            ) : null}
            {packages.map((pkg) => (
              <tr key={pkg.id} className="border-t border-slate-100">
                <td className="p-3 font-semibold">{pkg.title}</td>
                <td>{pkg.type}</td>
                <td>{formatCurrency(pkg.price)}</td>
                <td>{pkg.featured ? "Yes" : "No"}</td>
                <td>{pkg.published ? "Yes" : "No"}</td>
                <td className="flex gap-2 p-3">
                  <NavLink href={`/dashboard/packages/${pkg.id}/edit`}>Edit</NavLink>
                  <DeleteButton id={pkg.id} action={deletePackageAction} confirm="Are you sure you want to delete this package?" successMessage="Package deleted" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
