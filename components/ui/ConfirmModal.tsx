"use client";

import { useEffect, useRef, useState } from "react";

interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => Promise<void>;
}

export function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  danger = false,
  onConfirm,
}: ConfirmModalProps) {
  const [pending, setPending] = useState(false);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    confirmRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !pending) {
        onOpenChange(false);
      }
      if (e.key === "Tab") {
        const focusable = [cancelRef.current, confirmRef.current].filter(Boolean) as HTMLElement[];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, pending, onOpenChange]);

  async function handleConfirm() {
    setPending(true);
    try {
      await onConfirm();
    } finally {
      setPending(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => { if (!pending) onOpenChange(false); }}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative z-10 w-full max-w-md mx-4 bg-white rounded-md shadow-lg p-6"
      >
        <h2 id="modal-title" className="text-body-md font-semibold text-ink mb-2">
          {title}
        </h2>
        <p className="text-body-sm text-muted mb-6">{description}</p>

        <div className="flex items-center justify-end gap-3">
          <button
            ref={cancelRef}
            type="button"
            disabled={pending}
            onClick={() => onOpenChange(false)}
            className="h-9 px-4 rounded-sm border border-hairline text-body-sm font-medium text-secondary bg-white hover:bg-surface-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            ref={confirmRef}
            type="button"
            disabled={pending}
            onClick={handleConfirm}
            className={`h-9 px-4 rounded-sm text-body-sm font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              danger
                ? "bg-error hover:bg-red-700"
                : "bg-primary hover:bg-primary-dark"
            }`}
          >
            {pending ? "Processing…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
