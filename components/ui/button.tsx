import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "outline" | "ghost" | "danger";
};

export function Button({ className, variant = "default", ...props }: ButtonProps) {
  const variants = {
    default:
      "bg-gradient-to-r from-teal-700 to-teal-800 text-white shadow-md shadow-teal-900/20 hover:from-teal-800 hover:to-teal-900 hover:shadow-lg hover:shadow-teal-900/25 hover:-translate-y-0.5",
    secondary:
      "bg-gradient-to-r from-coral-500 to-coral-600 text-white shadow-md shadow-coral-500/25 hover:from-coral-600 hover:to-coral-700 hover:-translate-y-0.5",
    outline:
      "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 hover:border-slate-400",
    ghost: "text-slate-700 hover:bg-slate-100",
    danger:
      "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md shadow-red-700/20 hover:from-red-700 hover:to-red-800 hover:-translate-y-0.5",
  };
  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-md px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
