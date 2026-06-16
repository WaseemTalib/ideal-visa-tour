"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

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
  icon,
}: {
  id: string;
  action: UserAction;
  label: string;
  pendingLabel: string;
  variant?: Variant;
  confirm?: string;
  icon?: React.ReactNode;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (confirm && !window.confirm(confirm)) event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Pending label={label} pendingLabel={pendingLabel} variant={variant} icon={icon} />
    </form>
  );
}
