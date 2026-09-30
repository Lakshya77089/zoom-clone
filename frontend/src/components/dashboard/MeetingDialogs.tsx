"use client";

import { JoinMeetingModal } from "@/components/join/JoinMeetingModal";
import { ScheduleMeetingModal } from "@/components/schedule/ScheduleMeetingModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useEnterMeeting } from "@/hooks/useEnterMeeting";
import type { useMeetingDeletion } from "@/hooks/useMeetingDeletion";
import type { User } from "@/types";

export type ActiveDialog = "join" | "schedule" | null;

interface MeetingDialogsProps {
  active: ActiveDialog;
  user: User | null;
  onClose: () => void;
  onScheduled: () => void;
  deletion: ReturnType<typeof useMeetingDeletion>;
}

export function MeetingDialogs({ active, user, onClose, onScheduled, deletion }: MeetingDialogsProps) {
  const enterMeeting = useEnterMeeting();

  return (
    <>
      {active === "join" && <JoinMeetingModal defaultName={user?.name ?? ""} onClose={onClose} onJoined={enterMeeting} />}
      {active === "schedule" && (
        <ScheduleMeetingModal
          defaultTitle={user ? `${user.name}'s Zoom Meeting` : "My Meeting"}
          onClose={onClose}
          onScheduled={onScheduled}
        />
      )}
      {deletion.pending && (
        <ConfirmDialog
          title="Delete meeting?"
          message={`"${deletion.pending.title}" will be removed from your upcoming meetings. Anyone with the invite link will no longer be able to join.`}
          confirmLabel="Delete"
          busy={deletion.deleting}
          onConfirm={() => void deletion.confirmDelete()}
          onCancel={deletion.cancelDelete}
        />
      )}
    </>
  );
}
