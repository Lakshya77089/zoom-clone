"use client";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  busy?: boolean;
}

export function ConfirmDialog({ title, message, confirmLabel, onConfirm, onCancel, busy }: ConfirmDialogProps) {
  return (
    <Modal
      title={title}
      onClose={onCancel}
      testId="confirm-dialog"
      footer={
        <>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={busy} data-testid="confirm-button" autoFocus>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm text-ink-muted">{message}</p>
    </Modal>
  );
}
