"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  widthClass?: string;
  testId?: string;
  showClose?: boolean;
}

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({ title, onClose, children, footer, widthClass = "max-w-[448px]", testId, showClose = false }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    if (dialog && !dialog.contains(document.activeElement)) dialog.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      const items = [...dialog.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex animate-fade-in items-center justify-center bg-black/20 p-6" onMouseDown={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        data-testid={testId}
        className={`flex max-h-[calc(100dvh-48px)] w-full animate-slide-up flex-col rounded-[32px] bg-white shadow-[0_6px_12px_rgba(0,0,0,0.08),0_16px_40px_rgba(0,0,0,0.12)] outline-none ${widthClass}`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 px-8 pt-8">
          <h2 id="modal-title" className="text-xl font-bold leading-6 text-ink">
            {title}
          </h2>
          {showClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mr-2 -mt-1 flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-canvas hover:text-ink"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <div className={`overflow-y-auto px-8 pt-6 ${footer ? "pb-6" : "pb-8"}`}>{children}</div>
        {footer && <div className="flex justify-end gap-4 px-8 pb-8">{footer}</div>}
      </div>
    </div>
  );
}
