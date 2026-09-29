import re
from typing import Annotated

from fastapi import Depends, Header
from sqlalchemy.orm import Session

from app.controllers import (
    MeetingController,
    ParticipantController,
    RtcController,
    SignalController,
    UserController,
)
from app.core.config import settings
from app.core.database import get_db
from app.models import User

DbSession = Annotated[Session, Depends(get_db)]

ORIGIN_PATTERN = re.compile(r"https?://[A-Za-z0-9.\-]+(:\d+)?")


def get_user_controller(db: DbSession) -> UserController:
    return UserController(db)


def get_meeting_controller(db: DbSession) -> MeetingController:
    return MeetingController(db)


def get_participant_controller(db: DbSession) -> ParticipantController:
    return ParticipantController(db)


def get_signal_controller(db: DbSession) -> SignalController:
    return SignalController(db)


def get_rtc_controller() -> RtcController:
    return RtcController()


def get_current_user(
    controller: Annotated[UserController, Depends(get_user_controller)],
) -> User:
    return controller.get_default_user()


def get_public_url(origin: Annotated[str | None, Header(alias="X-Public-Origin")] = None) -> str:
    if origin and ORIGIN_PATTERN.fullmatch(origin):
        return origin
    return settings.frontend_url


CurrentUser = Annotated[User, Depends(get_current_user)]
Meetings = Annotated[MeetingController, Depends(get_meeting_controller)]
Participants = Annotated[ParticipantController, Depends(get_participant_controller)]
Signals = Annotated[SignalController, Depends(get_signal_controller)]
Rtc = Annotated[RtcController, Depends(get_rtc_controller)]
RequesterId = Annotated[int, Header(alias="X-Participant-Id")]
PublicUrl = Annotated[str, Depends(get_public_url)]
