"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

type DeleteFormAction = (formData: FormData) => Promise<void> | void;

function PendingDelete({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button variant="danger" className="h-9" disabled={pending}>
      {pending ? "Deleting…" : label}
    </Button>
  );
}

export function DeleteButton({
  id,
  action,
  label = "Delete",
  confirm = "Delete this entry? This cannot be undone.",
}: {
  id: string;
  action: DeleteFormAction;
  label?: string;
  confirm?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(confirm)) event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <PendingDelete label={label} />
    </form>
  );
}
