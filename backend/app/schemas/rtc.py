from typing import Literal

from pydantic import BaseModel


class IceServerOut(BaseModel):
    urls: list[str] | str
    username: str | None = None
    credential: str | None = None


class RtcConfigOut(BaseModel):
    ice_servers: list[IceServerOut]
    ice_transport_policy: Literal["all", "relay"]
