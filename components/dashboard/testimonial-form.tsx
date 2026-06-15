"use client";

import { useActionState, useCallback, useRef } from "react";
import { saveTestimonialAction, type ActionResult } from "@/app/actions";
import { FormFeedback } from "@/components/dashboard/form-feedback";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { UploadField } from "@/components/dashboard/upload-field";
import { Checkbox } from "@/components/ui/checkbox";
import { Input, Label, Textarea } from "@/components/ui/input";

const initialState: ActionResult | null = null;

export function TestimonialForm() {
  const [state, formAction] = useActionState(saveTestimonialAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const handleSuccess = useCallback(() => formRef.current?.reset(), []);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="mt-6 grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
    >
      <FormFeedback state={state} onSuccess={handleSuccess} />
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label required>Client name</Label>
          <Input name="name" minLength={2} required />
        </div>
        <div>
          <Label required>Rating (1-5)</Label>
          <Input name="rating" type="number" min="1" max="5" step="1" defaultValue="5" required />
        </div>
      </div>
      <div>
        <Label required>Review</Label>
        <Textarea name="review" minLength={5} required />
      </div>
      <UploadField name="image_url" label="Photo (optional)" bucket="testimonial-images" />
      <Checkbox
        name="active"
        defaultChecked
        label="Active"
        description="Show this testimonial on the homepage."
      />
      <SubmitButton pendingLabel="Adding…">Add testimonial</SubmitButton>
    </form>
  );
}
