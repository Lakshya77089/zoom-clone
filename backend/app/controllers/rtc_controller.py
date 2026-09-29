import json
import urllib.request
from typing import Any

from app.core.config import settings

CLOUDFLARE_TURN_ENDPOINT = "https://rtc.live.cloudflare.com/v1/turn/keys/{key_id}/credentials/generate-ice-servers"
CREDENTIAL_TTL_SECONDS = 86400
REQUEST_TIMEOUT_SECONDS = 5


def _split(value: str) -> list[str]:
    return [item.strip() for item in value.split(",") if item.strip()]


class RtcController:
    def ice_config(self) -> dict[str, Any]:
        servers: list[dict[str, Any]] = []
        stun_urls = _split(settings.stun_urls)
        if stun_urls:
            servers.append({"urls": stun_urls})
        turn_urls = _split(settings.turn_urls)
        if turn_urls:
            servers.append(
                {
                    "urls": turn_urls,
                    "username": settings.turn_username or None,
                    "credential": settings.turn_credential or None,
                }
            )
        servers.extend(self._cloudflare_servers())
        return {"ice_servers": servers, "ice_transport_policy": settings.ice_transport_policy}

    def _cloudflare_servers(self) -> list[dict[str, Any]]:
        if not (settings.cloudflare_turn_key_id and settings.cloudflare_turn_api_token):
            return []
        request = urllib.request.Request(
            CLOUDFLARE_TURN_ENDPOINT.format(key_id=settings.cloudflare_turn_key_id),
            data=json.dumps({"ttl": CREDENTIAL_TTL_SECONDS}).encode(),
            headers={
                "Authorization": f"Bearer {settings.cloudflare_turn_api_token}",
                "Content-Type": "application/json",
            },
            method="POST",
        )
        try:
            with urllib.request.urlopen(request, timeout=REQUEST_TIMEOUT_SECONDS) as response:
                payload = json.load(response)
        except (OSError, ValueError):
            return []
        servers = payload.get("iceServers", [])
        return servers if isinstance(servers, list) else [servers]
