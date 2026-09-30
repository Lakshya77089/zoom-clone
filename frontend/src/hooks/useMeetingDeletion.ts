"use client";

import { useCallback, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { api } from "@/lib/api";
import type { Meeting } from "@/types";

export function useMeetingDeletion(onDeleted: () => void) {
  const toast = useToast();
  const [pending, setPending] = useState<Meeting | null>(null);
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = useCallback(async () => {
    if (!pending) return;
    setDeleting(true);
    try {
      await api.deleteMeeting(pending.meeting_code);
      toast("Meeting deleted");
      onDeleted();
    } catch (error) {
      toast(error instanceof Error ? error.message : "Unable to delete the meeting.", "error");
    } finally {
      setDeleting(false);
      setPending(null);
    }
  }, [pending, toast, onDeleted]);

  return {
    pending,
    deleting,
    requestDelete: setPending,
    cancelDelete: () => setPending(null),
    confirmDelete,
  };
}
