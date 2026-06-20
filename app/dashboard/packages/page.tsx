import Link from "next/link";
import { deletePackageAction } from "@/app/actions";
import { DeleteButton } from "@/components/dashboard/delete-button";
import { NavLink } from "@/components/dashboard/nav-link";
import { getPackages } from "@/lib/data";
import { formatCurrency, PACKAGE_CATEGORY_LABEL, type PackageCategory } from "@/lib/utils";

type Filter = "all" | PackageCategory;

const FILTERS: Array<{ value: Filter; label: string }> = [
  { value: "all", label: "All" },
  { value: "international", label: PACKAGE_CATEGORY_LABEL.international },
  { value: "northern", label: PACKAGE_CATEGORY_LABEL.northern },
  { value: "umrah", label: PACKAGE_CATEGORY_LABEL.umrah },
];

function parseFilter(value: string | undefined): Filter {
  if (value === "international" || value === "northern" || value === "umrah") return value;
  return "all";
}

export default async function DashboardPackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const filter = parseFilter(category);

  const packages = await getPackages({}, false);

  const counts: Record<Filter, number> = {
    all: packages.length,
    international: 0,
    northern: 0,
    umrah: 0,
  };
  for (const pkg of packages) counts[pkg.type] += 1;

  const visible = filter === "all" ? packages : packages.filter((pkg) => pkg.type === filter);

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Manage packages</h1>
        <NavLink href="/dashboard/packages/new" variant="primary">
          Create package
        </NavLink>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Category</span>
        {FILTERS.map(({ value, label }) => {
          const active = filter === value;
          const count = counts[value];
          const href = value === "all" ? "/dashboard/packages" : `/dashboard/packages?category=${value}`;
          return (
            <Link
              key={value}
              href={href}
              aria-current={active ? "page" : undefined}
              className={
                active
                  ? "inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-700 to-teal-800 px-4 py-1.5 text-sm font-semibold text-white shadow-md shadow-teal-900/20"
                  : "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-teal-200 hover:text-teal-700 hover:shadow-sm"
              }
            >
              {label}
              <span
                className={
                  active
                    ? "rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-bold"
                    : "rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600"
                }
              >
                {count}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="p-3">Title</th>
              <th>Category</th>
              <th>Price</th>
              <th>Published</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-500">
                  {filter === "all"
                    ? "No packages yet. Create your first one."
                    : `No ${PACKAGE_CATEGORY_LABEL[filter]} packages yet.`}
                </td>
              </tr>
            ) : null}
            {visible.map((pkg) => (
              <tr key={pkg.id} className="border-t border-slate-100">
                <td className="p-3 font-semibold">{pkg.title}</td>
                <td>{PACKAGE_CATEGORY_LABEL[pkg.type]}</td>
                <td>{formatCurrency(pkg.price)}</td>
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
