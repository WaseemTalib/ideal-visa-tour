import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: React.ReactNode;
  description?: React.ReactNode;
};

export function Checkbox({ label, description, className, disabled, ...props }: CheckboxProps) {
  return (
    <label
      className={cn(
        "group inline-flex cursor-pointer items-start gap-3 text-sm",
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      <span className="relative mt-0.5 inline-flex size-5 shrink-0 items-center justify-center">
        <input type="checkbox" className="peer sr-only" disabled={disabled} {...props} />
        <span
          aria-hidden
          className={cn(
            "block size-5 rounded-md border-2 border-slate-300 bg-white transition",
            "group-hover:border-slate-400",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-teal-200 peer-focus-visible:ring-offset-2",
            "peer-checked:border-teal-700 peer-checked:bg-gradient-to-br peer-checked:from-teal-600 peer-checked:to-teal-700 peer-checked:shadow-sm peer-checked:shadow-teal-700/20",
            "peer-disabled:bg-slate-100",
          )}
        />
        <Check
          aria-hidden
          size={14}
          strokeWidth={3}
          className="pointer-events-none absolute scale-75 text-white opacity-0 transition peer-checked:scale-100 peer-checked:opacity-100"
        />
      </span>
      {label || description ? (
        <span className="leading-5">
          {label ? <span className="font-semibold text-slate-800">{label}</span> : null}
          {description ? (
            <span className="mt-0.5 block text-xs font-normal text-slate-500">{description}</span>
          ) : null}
        </span>
      ) : null}
    </label>
  );
}
