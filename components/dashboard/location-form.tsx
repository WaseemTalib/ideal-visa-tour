"use client";

import { useActionState, useCallback, useRef } from "react";
import { saveLocationAction, type ActionResult } from "@/app/actions";
import { FormFeedback } from "@/components/dashboard/form-feedback";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { UploadField } from "@/components/dashboard/upload-field";
import { Checkbox } from "@/components/ui/checkbox";
import { Input, Label, Textarea } from "@/components/ui/input";

const initialState: ActionResult | null = null;

export function LocationForm() {
  const [state, formAction] = useActionState(saveLocationAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const handleSuccess = useCallback(() => formRef.current?.reset(), []);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="mt-6 grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
    >
      <FormFeedback state={state} onSuccess={handleSuccess} />
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <Label required>Name</Label>
          <Input name="name" minLength={2} required placeholder="e.g. Istanbul" />
        </div>
        <div>
          <Label>City (optional)</Label>
          <Input name="city" placeholder="e.g. Istanbul" />
        </div>
        <div>
          <Label>Country (optional)</Label>
          <Input name="country" placeholder="e.g. Türkiye" />
        </div>
      </div>
      <UploadField name="image_url" label="Image (optional)" bucket="location-images" />
      <div>
        <Label>Short description (optional)</Label>
        <Textarea name="description" placeholder="Used on the location page" />
      </div>
      <Checkbox
        name="active"
        defaultChecked
        label="Active"
        description="Show this location on the public site."
      />
      <SubmitButton pendingLabel="Adding…">Add location</SubmitButton>
    </form>
  );
}
