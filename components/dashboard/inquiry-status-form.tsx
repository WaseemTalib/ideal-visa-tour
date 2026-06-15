"use client";

import { useFormStatus } from "react-dom";
import { updateInquiryStatusAction } from "@/app/actions";
import { Button } from "@/components/ui/button";

const STATUSES = ["new", "contacted", "confirmed", "rejected"] as const;
type Status = (typeof STATUSES)[number];

function PendingUpdate() {
  const { pending } = useFormStatus();
  return (
    <Button className="h-10" disabled={pending}>
      {pending ? "Updating…" : "Update"}
    </Button>
  );
}

export function InquiryStatusForm({ id, status }: { id: string; status: Status }) {
  return (
    <form action={updateInquiryStatusAction} className="flex gap-2">
      <input type="hidden" name="id" value={id} />
      <select
        name="status"
        defaultValue={status}
        className="rounded-md border border-slate-300 px-3 py-2 text-sm"
      >
        {STATUSES.map((value) => (
          <option key={value} value={value}>
            {value[0].toUpperCase() + value.slice(1)}
          </option>
        ))}
      </select>
      <PendingUpdate />
    </form>
  );
}
