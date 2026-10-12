
import type { ReactNode } from "react";
import { toast as toastManager } from "@/components/ui/toast";

type ToastVariant = "default" | "destructive" | "success" | "info" | "warning" | "loading";

type ToastOptions = {
  title?: ReactNode;
  description?: ReactNode;
  variant?: ToastVariant;
  type?: string;
  duration?: number;
};

type ToastUpdateOptions = Partial<ToastOptions>;

function getToastType(options: ToastOptions): string {
  if (options.type) {
    return options.type;
  }

  switch (options.variant) {
    case "destructive":
      return "error";
    case "success":
      return "success";
    case "info":
      return "info";
    case "warning":
      return "warning";
    case "loading":
      return "loading";
    default:
      return "default";
  }
}

function toast(options: ToastOptions) {
  const id = toastManager.add({
    title: options.title,
    description: options.description,
    type: getToastType(options),
    timeout: options.duration,
  });

  return {
    id,
    dismiss: () => toastManager.close(id),

    update: (updates: ToastUpdateOptions) => {
      toastManager.update(id, {
        ...(updates.title !== undefined && {
          title: updates.title,
        }),
        ...(updates.description !== undefined && {
          description: updates.description,
        }),
        ...(updates.variant !== undefined || updates.type !== undefined
          ? { type: getToastType({ ...options, ...updates }) }
          : {}),
        ...(updates.duration !== undefined && {
          timeout: updates.duration,
        }),
      });
    },
  };
}

function useToast() {
  return {
    toast,
    dismiss: (toastId?: string) => {
      toastManager.close(toastId);
    },
  };
}

export { useToast, toast };
