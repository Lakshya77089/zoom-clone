"use client";

import { useCallback } from "react";
import { useToast } from "@/components/ui/Toast";
import { copyText } from "@/lib/clipboard";

export function useCopyWithToast() {
  const toast = useToast();
  return useCallback(
    async (text: string, successMessage: string) => {
      const ok = await copyText(text);
      toast(ok ? successMessage : "Unable to copy. Please copy it manually.", ok ? "success" : "error");
    },
    [toast],
  );
}
