"use client";

import { useState } from "react";
import { MailIcon } from "@/components/icons";
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
        title="Meeting Scheduled"
        onClose={onClose}
        widthClass="max-w-[560px]"
        testId="schedule-success-modal"
        showClose
        footer={
          <>
            <Button variant="secondary" onClick={() => void copy(buildInvitation(scheduled), "Invitation copied to clipboard")}>
              <MailIcon size={16} />
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
    <Modal title="Schedule Meeting" onClose={onClose} widthClass="max-w-[760px]" testId="schedule-meeting-modal" showClose>
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
