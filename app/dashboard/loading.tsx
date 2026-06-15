import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center text-slate-500">
      <div className="flex items-center gap-3 text-sm font-semibold">
        <Loader2 className="animate-spin text-teal-700" size={20} />
        Loading…
      </div>
    </div>
  );
}
