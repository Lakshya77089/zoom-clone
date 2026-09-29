import type { RtcConfig } from "@/types";

export const FALLBACK_RTC_CONFIGURATION: RTCConfiguration = {
  iceServers: [{ urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] }],
};

export function toRtcConfiguration(config: RtcConfig): RTCConfiguration {
  return {
    iceServers: config.ice_servers.map(({ urls, username, credential }) => ({
      urls,
      ...(username ? { username } : {}),
      ...(credential ? { credential } : {}),
    })),
    iceTransportPolicy: config.ice_transport_policy,
  };
}
