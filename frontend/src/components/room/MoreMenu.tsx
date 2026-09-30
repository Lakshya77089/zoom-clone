"use client";

import { Hash, Link2, Mail, MicOff, MoreHorizontal } from "lucide-react";
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
    { label: "Copy invite link", icon: Link2, onSelect: onCopyLink, testId: "more-copy-link" },
    { label: "Copy invitation", icon: Mail, onSelect: onCopyInvitation },
    { label: "Copy meeting ID", icon: Hash, onSelect: onCopyMeetingId },
    ...(isHost ? [{ label: "Mute all", icon: MicOff, onSelect: onMuteAll, testId: "more-mute-all" }] : []),
  ];

  return (
    <Menu
      label="More options"
      items={items}
      theme="dark"
      placement="top"
      align="center"
      renderTrigger={({ open, toggle }) => (
        <ToolbarButton label="More" icon={MoreHorizontal} onClick={toggle} active={open} expanded={open} testId="more-button" />
      )}
    />
  );
}
