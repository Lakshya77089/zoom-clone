"use client";

import { LinkIcon, MailIcon, MeetingIdIcon, MicOffIcon, MoreIcon } from "@/components/icons";
import { ToolbarButton } from "@/components/room/ToolbarButton";
import { Menu, type MenuItem } from "@/components/ui/Menu";

interface MoreMenuProps {
  isHost: boolean;
  onCopyLink: () => void;
  onCopyInvitation: () => void;
  onCopyMeetingId: () => void;
  onMuteAll: () => void;
}

export function MoreMenu({ isHost, onCopyLink, onCopyInvitation, onCopyMeetingId, onMuteAll }: MoreMenuProps) {
  const items: MenuItem[] = [
    { label: "Copy invite link", icon: LinkIcon, onSelect: onCopyLink, testId: "more-copy-link" },
    { label: "Copy invitation", icon: MailIcon, onSelect: onCopyInvitation },
    { label: "Copy meeting ID", icon: MeetingIdIcon, onSelect: onCopyMeetingId },
    ...(isHost ? [{ label: "Mute all", icon: MicOffIcon, onSelect: onMuteAll, testId: "more-mute-all" }] : []),
  ];

  return (
    <Menu
      label="More options"
      items={items}
      theme="dark"
      placement="top"
      align="center"
      renderTrigger={({ open, toggle }) => (
        <ToolbarButton label="More" icon={MoreIcon} onClick={toggle} active={open} expanded={open} testId="more-button" />
      )}
    />
  );
}
