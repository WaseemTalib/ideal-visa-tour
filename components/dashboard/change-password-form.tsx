"use client";

import { useActionState, useCallback, useRef } from "react";
import { changePasswordAction, type ActionResult } from "@/app/actions";
import { FormFeedback } from "@/components/dashboard/form-feedback";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { Label } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";

const initialState: ActionResult | null = null;

export function ChangePasswordForm() {
  const [state, formAction] = useActionState(changePasswordAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const handleSuccess = useCallback(() => formRef.current?.reset(), []);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="grid gap-4 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm sm:p-8"
    >
      <FormFeedback state={state} onSuccess={handleSuccess} />
      <div>
        <Label required>Current password</Label>
        <PasswordInput name="current_password" autoComplete="current-password" required />
      </div>
      <div>
        <Label required>New password</Label>
        <PasswordInput name="new_password" autoComplete="new-password" minLength={8} required />
        <p className="mt-1 text-xs text-slate-500">At least 8 characters.</p>
      </div>
      <div>
        <Label required>Confirm new password</Label>
        <PasswordInput name="confirm_password" autoComplete="new-password" minLength={8} required />
      </div>
      <div>
        <SubmitButton pendingLabel="Updating…">Update password</SubmitButton>
      </div>
    </form>
  );
}
