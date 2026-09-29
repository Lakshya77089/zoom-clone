from typing import Annotated

from pydantic import BaseModel, ConfigDict, StringConstraints

from app.models.enums import ParticipantRole, ParticipantStatus
from app.schemas.common import UTCDateTime

DisplayName = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=100)]


class JoinMeetingIn(BaseModel):
    display_name: DisplayName


class ParticipantUpdateIn(BaseModel):
    is_muted: bool | None = None
    is_video_on: bool | None = None


class ParticipantOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    meeting_id: int
    display_name: str
    role: ParticipantRole
    status: ParticipantStatus
    is_muted: bool
    is_video_on: bool
    joined_at: UTCDateTime
    left_at: UTCDateTime | None
