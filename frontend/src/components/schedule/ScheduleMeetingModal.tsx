"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { ScheduleMeetingForm } from "@/components/schedule/ScheduleMeetingForm";
import { ScheduledMeetingSummary } from "@/components/schedule/ScheduledMeetingSummary";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useCopyWithToast } from "@/hooks/useCopyWithToast";
import { buildInvitation } from "@/lib/format";
import type { Meeting } from "@/types";

interface ScheduleMeetingModalProps {
  defaultTitle: string;
  onClose: () => void;
  onScheduled: (meeting: Meeting) => void;
}

export function ScheduleMeetingModal({ defaultTitle, onClose, onScheduled }: ScheduleMeetingModalProps) {
  const [scheduled, setScheduled] = useState<Meeting | null>(null);
  const copy = useCopyWithToast();

  if (scheduled) {
    return (
      <Modal
        title="Meeting scheduled"
        onClose={onClose}
        widthClass="sm:max-w-[520px]"
        testId="schedule-success-modal"
        footer={
          <>
            <Button variant="secondary" onClick={() => void copy(buildInvitation(scheduled), "Invitation copied to clipboard")}>
              <Mail size={16} />
              Copy invitation
            </Button>
            <Button onClick={onClose} data-testid="schedule-done" autoFocus>
              Done
            </Button>
          </>
        }
      >
        <ScheduledMeetingSummary meeting={scheduled} />
      </Modal>
    );
  }

  return (
    <Modal title="Schedule meeting" onClose={onClose} widthClass="sm:max-w-[520px]" testId="schedule-meeting-modal">
      <ScheduleMeetingForm
        defaultTitle={defaultTitle}
        onCancel={onClose}
        onScheduled={(meeting) => {
          setScheduled(meeting);
          onScheduled(meeting);
        }}
      />
    </Modal>
  );
}
