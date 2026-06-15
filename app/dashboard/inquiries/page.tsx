import { deleteInquiryAction } from "@/app/actions";
import { DeleteButton } from "@/components/dashboard/delete-button";
import { InquiryStatusForm } from "@/components/dashboard/inquiry-status-form";
import { getInquiries } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export default async function InquiriesPage() {
  const inquiries = await getInquiries();
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Manage inquiries</h1>
      {inquiries.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">No inquiries yet.</p>
      ) : null}
      <div className="mt-6 grid gap-4">
        {inquiries.map((inquiry) => (
          <article key={inquiry.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <h2 className="font-bold">{inquiry.name}</h2>
                <p className="text-sm text-slate-600">
                  {inquiry.email}
                  {inquiry.phone ? ` · ${inquiry.phone}` : ""}
                </p>
              </div>
              <p className="text-sm text-slate-500">{formatDate(inquiry.created_at.slice(0, 10))}</p>
            </div>
            <p className="mt-3 font-semibold">{inquiry.subject || inquiry.type}</p>
            <p className="mt-2 text-slate-700">{inquiry.message}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <InquiryStatusForm id={inquiry.id} status={inquiry.status} />
              <DeleteButton id={inquiry.id} action={deleteInquiryAction} confirm={`Delete inquiry from ${inquiry.name}?`} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
