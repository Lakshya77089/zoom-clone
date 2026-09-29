const STUN_SERVERS = ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"];

function turnServers(): RTCIceServer[] {
  const urls = process.env.NEXT_PUBLIC_TURN_URLS;
  if (!urls) return [];
  return [
    {
      urls: urls.split(",").map((url) => url.trim()),
      username: process.env.NEXT_PUBLIC_TURN_USERNAME,
      credential: process.env.NEXT_PUBLIC_TURN_CREDENTIAL,
    },
  ];
}

export const rtcConfiguration: RTCConfiguration = {
  iceServers: [{ urls: STUN_SERVERS }, ...turnServers()],
};
