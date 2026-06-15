"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import type { Location } from "@/types/database.types";

export function SearchForm({ locations }: { locations: Location[] }) {
  const router = useRouter();

  function onSubmit(formData: FormData) {
    const params = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
      const text = String(value);
      if (text) params.set(key, text);
    }
    router.push(`/packages?${params.toString()}`);
  }

  return (
    <form
      action={onSubmit}
      className="grid gap-4 rounded-2xl border border-white/60 bg-white/95 p-5 shadow-[var(--shadow-soft)] ring-1 ring-slate-200/60 backdrop-blur md:grid-cols-5"
    >
      <div>
        <Label>From</Label>
        <Select name="from" aria-label="From location">
          <option value="">Any</option>
          {locations.map((location) => (
            <option key={location.id} value={location.slug}>{location.name}</option>
          ))}
        </Select>
      </div>
      <div>
        <Label>To</Label>
        <Select name="to" aria-label="Destination">
          <option value="">Any</option>
          {locations.map((location) => (
            <option key={location.id} value={location.slug}>{location.name}</option>
          ))}
        </Select>
      </div>
      <div>
        <Label>Travel date</Label>
        <Input name="startDate" type="date" />
      </div>
      <div>
        <Label>Type</Label>
        <Select name="type">
          <option value="">Any</option>
          <option value="normal">Normal</option>
          <option value="group">Group</option>
        </Select>
      </div>
      <Button className="mt-6 gap-2 bg-gradient-to-r from-teal-700 to-teal-800 shadow-md shadow-teal-900/20 hover:from-teal-800 hover:to-teal-900" type="submit">
        <Search size={16} /> Search
      </Button>
    </form>
  );
}
