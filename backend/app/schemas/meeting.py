from datetime import datetime
from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field, StringConstraints, computed_field

from app.core.config import settings
from app.models.enums import MeetingStatus, MeetingType
from app.schemas.common import UTCDateTime
from app.schemas.participant import ParticipantOut
from app.schemas.user import UserOut

Title = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=200)]
Description = Annotated[str, StringConstraints(strip_whitespace=True, max_length=2000)]


class ScheduleMeetingIn(BaseModel):
    title: Title
    description: Description | None = None
    start_time: datetime
    duration_minutes: int = Field(ge=15, le=1440)


class MeetingOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    meeting_code: str
    title: str
    description: str | None
    meeting_type: MeetingType
    status: MeetingStatus
    scheduled_start: UTCDateTime | None
    scheduled_end: UTCDateTime | None
    duration_minutes: int | None
    started_at: UTCDateTime | None
    ended_at: UTCDateTime | None
    created_at: UTCDateTime
    participant_count: int
    host: UserOut

    @computed_field
    @property
    def invite_link(self) -> str:
        return f"{settings.frontend_url.rstrip('/')}/j/{self.meeting_code}"


class MeetingSessionOut(BaseModel):
    meeting: MeetingOut
    participant: ParticipantOut


class RoomStateOut(BaseModel):
    meeting: MeetingOut
    me: ParticipantOut
    participants: list[ParticipantOut]
