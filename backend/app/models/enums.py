import enum

from sqlalchemy import Enum


class MeetingType(str, enum.Enum):
    INSTANT = "instant"
    SCHEDULED = "scheduled"


class MeetingStatus(str, enum.Enum):
    SCHEDULED = "scheduled"
    LIVE = "live"
    ENDED = "ended"


class ParticipantRole(str, enum.Enum):
    HOST = "host"
    ATTENDEE = "attendee"


class ParticipantStatus(str, enum.Enum):
    ACTIVE = "active"
    LEFT = "left"
    REMOVED = "removed"


class SignalKind(str, enum.Enum):
    HELLO = "hello"
    OFFER = "offer"
    ANSWER = "answer"
    CANDIDATE = "candidate"


def enum_column(enum_cls: type[enum.Enum]) -> Enum:
    return Enum(
        enum_cls,
        native_enum=False,
        length=20,
        values_callable=lambda members: [member.value for member in members],
    )
