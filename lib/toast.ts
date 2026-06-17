export type ToastVariant = "default" | "success" | "error" | "info" | "warning";

export type Toast = {
  id: string;
  message: string;
  variant: ToastVariant;
  duration: number;
};

type Listener = (toasts: Toast[]) => void;

let toasts: Toast[] = [];
const listeners = new Set<Listener>();

function emit() {
  for (const listener of listeners) listener(toasts);
}

function add(message: string, variant: ToastVariant, duration = 5000): string {
  const id = `t_${Math.random().toString(36).slice(2)}_${Date.now()}`;
  toasts = [...toasts, { id, message, variant, duration }];
  emit();
  return id;
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  listener(toasts);
  return () => {
    listeners.delete(listener);
  };
}

export function dismiss(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

export function dismissAll() {
  toasts = [];
  emit();
}

type Options = { duration?: number };

export const toast = {
  default: (message: string, options?: Options) => add(message, "default", options?.duration),
  success: (message: string, options?: Options) => add(message, "success", options?.duration),
  error: (message: string, options?: Options) => add(message, "error", options?.duration),
  info: (message: string, options?: Options) => add(message, "info", options?.duration),
  warning: (message: string, options?: Options) => add(message, "warning", options?.duration),
  dismiss,
  dismissAll,
};
