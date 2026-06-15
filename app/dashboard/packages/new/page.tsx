import { PackageForm } from "@/components/dashboard/package-form";
import { getLocations } from "@/lib/data";

export default async function NewPackagePage() {
  const locations = await getLocations(false);
  return <div><h1 className="mb-6 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Create package</h1><PackageForm locations={locations} /></div>;
}
