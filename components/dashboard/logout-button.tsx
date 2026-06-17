"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";
import { toast } from "@/lib/toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { cn } from "@/lib/utils";

export function LogoutButton({
  className,
  children,
  showIcon = true,
}: {
  className?: string;
  children?: React.ReactNode;
  showIcon?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const doLogout = async () => {
    setOpen(false);
    setPending(true);
    try {
      const response = await fetch("/api/auth/signout", { method: "POST" });
      if (!response.ok) throw new Error("Could not log out");
      toast.success("Logged out");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Logout failed");
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={pending}
        className={cn(
          "inline-flex items-center gap-1.5 transition disabled:cursor-not-allowed disabled:opacity-60",
          className,
        )}
        aria-label="Log out"
      >
        {showIcon ? (
          pending ? <Loader2 size={14} className="animate-spin" /> : <LogOut size={14} />
        ) : null}
        {children}
      </button>
      <ConfirmDialog
        open={open}
        title="Are you sure you want to logout?"
        confirmLabel="Logout"
        confirmVariant="danger"
        onCancel={() => setOpen(false)}
        onConfirm={doLogout}
      />
    </>
  );
}
