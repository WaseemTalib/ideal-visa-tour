"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ActionResult } from "@/app/actions";

export function FormFeedback({ state, onSuccess }: { state: ActionResult | null; onSuccess?: () => void }) {
  const router = useRouter();
  const lastHandled = useRef<ActionResult | null>(null);

  useEffect(() => {
    if (!state || state === lastHandled.current) return;
    lastHandled.current = state;
    if (state.error) {
      toast.error(state.error);
      return;
    }
    if (state.success) {
      toast.success(state.success);
      onSuccess?.();
      if (state.redirectTo) router.push(state.redirectTo);
      else router.refresh();
    }
  }, [state, router, onSuccess]);

  return null;
}
