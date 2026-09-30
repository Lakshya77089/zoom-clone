import json
import threading
import time
import urllib.parse
import urllib.request
import uuid
from typing import Any

from websockets.exceptions import WebSocketException
from websockets.sync.client import connect

from app.core.config import settings
from app.utils.jwt import sign_hs256

CLOUDFLARE_TURN_ENDPOINT = "https://rtc.live.cloudflare.com/v1/turn/keys/{key_id}/credentials/generate-ice-servers"
CREDENTIAL_TTL_SECONDS = 86400
REQUEST_TIMEOUT_SECONDS = 5
METERED_TOKEN_TTL_SECONDS = 600
METERED_CACHE_SECONDS = 300
METERED_RETRY_SECONDS = 60

_metered_lock = threading.Lock()
_metered_cache: dict[str, Any] = {"expires_at": 0.0, "servers": []}


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
        servers.extend(self._metered_servers())
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

    def _metered_servers(self) -> list[dict[str, Any]]:
        if not (settings.metered_key_id and settings.metered_signing_secret):
            return []
        with _metered_lock:
            if _metered_cache["expires_at"] > time.time():
                return _metered_cache["servers"]
            servers = self._fetch_metered_servers()
            ttl = METERED_CACHE_SECONDS if servers else METERED_RETRY_SECONDS
            _metered_cache.update(expires_at=time.time() + ttl, servers=servers)
            return servers

    def _fetch_metered_servers(self) -> list[dict[str, Any]]:
        now = int(time.time())
        token = sign_hs256(
            {"sub": f"zoom-{uuid.uuid4().hex[:12]}", "iat": now, "exp": now + METERED_TOKEN_TTL_SECONDS},
            settings.metered_signing_secret,
            settings.metered_key_id,
        )
        url = f"{settings.metered_ws_url}?{urllib.parse.urlencode({'token': token})}"
        try:
            with connect(url, open_timeout=REQUEST_TIMEOUT_SECONDS, close_timeout=1) as socket:
                welcome = json.loads(socket.recv(timeout=REQUEST_TIMEOUT_SECONDS))
        except (OSError, TimeoutError, ValueError, WebSocketException):
            return []
        if welcome.get("type") != "welcome":
            return []
        servers = (welcome.get("metadata") or {}).get("iceServers") or []
        return [server for server in servers if isinstance(server, dict) and server.get("urls")]
