import { ContentForm } from "@/components/dashboard/content-form";
import { getSiteSettings } from "@/lib/data";

export default async function ContentPage() {
  const settings = await getSiteSettings();
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Manage website content</h1>
      <p className="mt-2 text-slate-600">Update the homepage hero, contact details, and footer links shown across the public site.</p>
      <ContentForm settings={settings} />
    </div>
  );
}
