"use client";

import { JoinMeetingForm } from "@/components/join/JoinMeetingForm";
import { Modal } from "@/components/ui/Modal";
import { usePreferences } from "@/hooks/usePreferences";
import type { MeetingSession } from "@/types";

interface JoinMeetingModalProps {
  defaultName: string;
  onClose: () => void;
  onJoined: (session: MeetingSession) => void;
}

export function JoinMeetingModal({ defaultName, onClose, onJoined }: JoinMeetingModalProps) {
  const { preferences } = usePreferences();
  return (
    <Modal title="Join meeting" onClose={onClose} testId="join-meeting-modal">
      <JoinMeetingForm defaultName={defaultName} preferences={preferences} onJoined={onJoined} onCancel={onClose} />
    </Modal>
  );
}
