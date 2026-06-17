"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "@/lib/toast";

type Variant = "default" | "secondary" | "outline" | "ghost" | "danger";
type UserAction = (formData: FormData) => Promise<void> | void;

function Pending({
  label,
  pendingLabel,
  variant,
  icon,
}: {
  label: string;
  pendingLabel: string;
  variant: Variant;
  icon?: React.ReactNode;
}) {
  const { pending } = useFormStatus();
  return (
    <Button variant={variant} className="h-9 gap-1.5" disabled={pending}>
      {!pending && icon ? icon : null}
      {pending ? pendingLabel : label}
    </Button>
  );
}

export function UserActionButton({
  id,
  action,
  label,
  pendingLabel,
  variant = "default",
  confirm,
  confirmTitle,
  successMessage,
  icon,
}: {
  id: string;
  action: UserAction;
  label: string;
  pendingLabel: string;
  variant?: Variant;
  confirm?: string;
  confirmTitle?: string;
  successMessage?: string;
  icon?: React.ReactNode;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const skipNextRef = useRef(false);
  const needsConfirm = Boolean(confirm);

  const fireToast = () => {
    if (variant === "danger") toast.error(successMessage ?? `${label} successful`);
    else toast.success(successMessage ?? `${label} successful`);
  };

  return (
    <>
      <form
        ref={formRef}
        action={action}
        onSubmit={(event) => {
          if (!needsConfirm) {
            // Plain click — no confirmation; fire toast on the way out.
            fireToast();
            return;
          }
          if (skipNextRef.current) {
            skipNextRef.current = false;
            return;
          }
          event.preventDefault();
          setOpen(true);
        }}
      >
        <input type="hidden" name="id" value={id} />
        <Pending label={label} pendingLabel={pendingLabel} variant={variant} icon={icon} />
      </form>
      {needsConfirm ? (
        <ConfirmDialog
          open={open}
          title={confirmTitle ?? confirm ?? `${label}?`}
          confirmLabel={label}
          confirmVariant={variant === "danger" ? "danger" : "default"}
          onCancel={() => setOpen(false)}
          onConfirm={() => {
            skipNextRef.current = true;
            setOpen(false);
            fireToast();
            queueMicrotask(() => formRef.current?.requestSubmit());
          }}
        />
      ) : null}
    </>
  );
}
