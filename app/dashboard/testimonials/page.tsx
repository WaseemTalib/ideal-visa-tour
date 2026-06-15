import { deleteTestimonialAction } from "@/app/actions";
import { DeleteButton } from "@/components/dashboard/delete-button";
import { TestimonialForm } from "@/components/dashboard/testimonial-form";
import { getTestimonials } from "@/lib/data";

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials(false);
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Testimonials</h1>
      <p className="mt-2 text-slate-600">Active testimonials appear on the homepage reviews section.</p>
      <TestimonialForm />
      <div className="mt-6 grid gap-3">
        {testimonials.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center text-slate-500">No testimonials yet.</p>
        ) : null}
        {testimonials.map((item) => (
          <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex-1">
              <b>{item.name}</b>
              <p className="text-sm text-slate-600">{item.rating}/5 · {item.active ? "Active" : "Inactive"}</p>
              <p className="mt-1 text-slate-700">{item.review}</p>
            </div>
            <DeleteButton id={item.id} action={deleteTestimonialAction} confirm={`Delete review by ${item.name}?`} />
          </div>
        ))}
      </div>
    </div>
  );
}
