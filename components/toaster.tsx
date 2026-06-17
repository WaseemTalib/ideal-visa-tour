"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, Info, TriangleAlert, X, XCircle } from "lucide-react";
import { dismiss, subscribe, type Toast, type ToastVariant } from "@/lib/toast";

// Inspired by react-toastify's "colored" palette but tuned to the brighter,
// more modern Tailwind 500-tier so nothing looks dark/maroon.
const VARIANT_BG: Record<ToastVariant, string> = {
  default: "bg-slate-800 text-white",
  success: "bg-emerald-500 text-white",
  error: "bg-rose-500 text-white",
  info: "bg-sky-500 text-white",
  warning: "bg-amber-400 text-slate-900",
};

const VARIANT_BAR: Record<ToastVariant, string> = {
  default: "bg-white/60",
  success: "bg-white/70",
  error: "bg-white/70",
  info: "bg-white/70",
  warning: "bg-slate-900/40",
};

const VARIANT_ICON: Record<ToastVariant, typeof Info> = {
  default: Info,
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: TriangleAlert,
};

// useSyncExternalStore gives an SSR-safe read of our module-level store with
// no setState-in-effect lint warning.
const EMPTY_TOASTS: Toast[] = [];
function getSnapshot() {
  return moduleSnapshot;
}
function getServerSnapshot() {
  return EMPTY_TOASTS;
}
let moduleSnapshot: Toast[] = EMPTY_TOASTS;
function externalSubscribe(notify: () => void) {
  return subscribe((next) => {
    moduleSnapshot = next;
    notify();
  });
}

export function Toaster() {
  const items = useSyncExternalStore(externalSubscribe, getSnapshot, getServerSnapshot);

  if (typeof window === "undefined") return null;
  if (items.length === 0) return null;

  return createPortal(
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed right-4 top-4 z-[100] flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2"
    >
      {items.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>,
    document.body,
  );
}

function ToastItem({ toast }: { toast: Toast }) {
  const [paused, setPaused] = useState(false);
  const elapsedRef = useRef(0);
  const startedAtRef = useRef(0);
  const Icon = VARIANT_ICON[toast.variant];

  useEffect(() => {
    if (paused) {
      if (startedAtRef.current > 0) {
        elapsedRef.current += Date.now() - startedAtRef.current;
      }
      return;
    }
    startedAtRef.current = Date.now();
    const remaining = Math.max(0, toast.duration - elapsedRef.current);
    const handle = setTimeout(() => dismiss(toast.id), remaining);
    return () => clearTimeout(handle);
  }, [paused, toast.duration, toast.id]);

  return (
    <div
      role="status"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={`pointer-events-auto relative overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5 animate-toast-in ${VARIANT_BG[toast.variant]}`}
    >
      <div className="flex items-start gap-3 px-4 py-3 pr-2">
        <Icon size={18} className="mt-0.5 shrink-0" />
        <p className="flex-1 text-sm font-semibold leading-5">{toast.message}</p>
        <button
          type="button"
          onClick={() => dismiss(toast.id)}
          aria-label="Dismiss"
          className="shrink-0 rounded p-1 opacity-80 transition hover:bg-white/15 hover:opacity-100"
        >
          <X size={14} />
        </button>
      </div>
      <span
        aria-hidden
        className={`absolute bottom-0 left-0 h-1 ${VARIANT_BAR[toast.variant]}`}
        style={{
          width: "100%",
          transformOrigin: "left",
          animation: `toast-shrink ${toast.duration}ms linear forwards`,
          animationPlayState: paused ? "paused" : "running",
        }}
      />
    </div>
  );
}
