from typing import Any

from pydantic import BaseModel, ConfigDict

from app.models.enums import SignalKind
from app.schemas.common import UTCDateTime


class SignalIn(BaseModel):
    recipient_id: int
    kind: SignalKind
    payload: dict[str, Any] = {}


class SignalOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    sender_id: int
    kind: SignalKind
    payload: dict[str, Any]
    created_at: UTCDateTime
