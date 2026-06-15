import { notFound } from "next/navigation";
import { PackageForm } from "@/components/dashboard/package-form";
import { getLocations, getPackageById } from "@/lib/data";

export default async function EditPackagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [pkg, locations] = await Promise.all([getPackageById(id), getLocations(false)]);
  if (!pkg) notFound();
  return <div><h1 className="mb-6 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Edit package</h1><PackageForm pkg={pkg} locations={locations} /></div>;
}
