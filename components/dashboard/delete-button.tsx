"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "@/lib/toast";

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
  confirm = "Are you sure you want to delete this item?",
  successMessage = "Deleted",
}: {
  id: string;
  action: DeleteFormAction;
  label?: string;
  confirm?: string;
  successMessage?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const skipNextRef = useRef(false);

  return (
    <>
      <form
        ref={formRef}
        action={action}
        onSubmit={(event) => {
          if (skipNextRef.current) {
            skipNextRef.current = false;
            return;
          }
          event.preventDefault();
          setOpen(true);
        }}
      >
        <input type="hidden" name="id" value={id} />
        <PendingDelete label={label} />
      </form>
      <ConfirmDialog
        open={open}
        title={confirm}
        confirmLabel="Delete"
        confirmVariant="danger"
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          skipNextRef.current = true;
          setOpen(false);
          toast.success(successMessage);
          queueMicrotask(() => formRef.current?.requestSubmit());
        }}
      />
    </>
  );
}
