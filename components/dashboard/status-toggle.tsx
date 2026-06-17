"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

type UserAction = (formData: FormData) => Promise<void> | void;

function ToggleSwitch({ enabled }: { enabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      role="switch"
      aria-checked={enabled}
      disabled={pending}
      className={cn(
        "relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        enabled ? "bg-emerald-500" : "bg-slate-300",
      )}
      title={enabled ? "Click to disable" : "Click to enable"}
    >
      <span
        className={cn(
          "inline-flex size-4 transform items-center justify-center rounded-full bg-white shadow transition-transform",
          enabled ? "translate-x-[1.125rem]" : "translate-x-0.5",
        )}
      >
        {pending ? <Loader2 size={10} className="animate-spin text-slate-400" /> : null}
      </span>
    </button>
  );
}

export function StatusToggle({
  id,
  enabled,
  enableAction,
  disableAction,
  disabled,
}: {
  id: string;
  enabled: boolean;
  enableAction: UserAction;
  disableAction: UserAction;
  disabled?: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const skipNextRef = useRef(false);

  if (disabled) {
    return (
      <span
        aria-disabled
        className={cn(
          "relative inline-flex h-5 w-9 items-center rounded-full opacity-50",
          enabled ? "bg-emerald-500" : "bg-slate-300",
        )}
        title="You cannot change your own status"
      >
        <span
          className={cn(
            "inline-flex size-4 rounded-full bg-white shadow",
            enabled ? "translate-x-[1.125rem]" : "translate-x-0.5",
          )}
        />
      </span>
    );
  }

  return (
    <>
      <form
        ref={formRef}
        action={enabled ? disableAction : enableAction}
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
        <ToggleSwitch enabled={enabled} />
      </form>
      <ConfirmDialog
        open={open}
        title={enabled ? "Are you sure you want to disable this user?" : "Are you sure you want to enable this user?"}
        confirmLabel={enabled ? "Disable" : "Enable"}
        confirmVariant={enabled ? "danger" : "default"}
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          skipNextRef.current = true;
          setOpen(false);
          if (enabled) toast.warning("User disabled");
          else toast.success("User enabled");
          queueMicrotask(() => formRef.current?.requestSubmit());
        }}
      />
    </>
  );
}
