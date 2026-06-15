import { Loader2 } from "lucide-react";

export default function PackagesLoading() {
  return (
    <div className="mx-auto flex min-h-[40vh] max-w-7xl items-center justify-center px-4 py-20 text-slate-500">
      <div className="flex items-center gap-3 text-sm font-semibold">
        <Loader2 className="animate-spin text-teal-700" size={20} />
        Loading packages…
      </div>
    </div>
  );
}
