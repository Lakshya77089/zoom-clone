"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { AlertIcon, SuccessIcon } from "@/components/icons";
import { TOAST_DURATION_MS } from "@/constants";

type ToastTone = "success" | "error";

interface ToastState {
  id: number;
  message: string;
  tone: ToastTone;
}

type ShowToast = (message: string, tone?: ToastTone) => void;

const ToastContext = createContext<ShowToast>(() => {});

export function useToast(): ShowToast {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const nextId = useRef(0);

  const show = useCallback<ShowToast>((message, tone = "success") => {
    nextId.current += 1;
    setToast({ id: nextId.current, message, tone });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), TOAST_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const Icon = toast?.tone === "error" ? AlertIcon : SuccessIcon;

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex justify-center px-4 sm:bottom-8" aria-live="polite">
        {toast && (
          <div
            key={toast.id}
            role="status"
            data-testid="toast"
            className="flex max-w-md animate-slide-up items-center gap-2.5 rounded-xl bg-[#2a2b2d] px-4 py-3 text-sm text-white shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
          >
            <Icon size={18} className={toast.tone === "error" ? "shrink-0 text-[#ff6b6b]" : "shrink-0 text-zoom-green"} />
            {toast.message}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}
