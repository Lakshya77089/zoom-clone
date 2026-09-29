from datetime import datetime, timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models import (
    Meeting,
    MeetingStatus,
    MeetingType,
    Participant,
    ParticipantRole,
    ParticipantStatus,
    User,
)
from app.utils.meeting_code import generate_meeting_code
from app.utils.time import utcnow

USERS = [
    ("Alex Johnson", settings.default_user_email, "#0B5CFF"),
    ("Priya Sharma", "priya.sharma@example.com", "#E8710A"),
    ("Rahul Verma", "rahul.verma@example.com", "#188038"),
    ("Emily Chen", "emily.chen@example.com", "#A142F4"),
    ("Marcus Lee", "marcus.lee@example.com", "#D93025"),
]

UPCOMING = [
    ("Weekly Team Sync", "Status updates and blockers for the sprint.", timedelta(hours=2), 30),
    ("Product Roadmap Review", "Walk through Q4 roadmap priorities with product.", timedelta(days=1), 60),
    ("Design Critique", "Review new onboarding screens.", timedelta(days=2, hours=3), 45),
    ("1:1 with Priya", None, timedelta(days=4), 30),
]

RECENT = [
    ("Sprint Planning", MeetingType.SCHEDULED, timedelta(days=1), 55, ["Priya Sharma", "Rahul Verma", "Emily Chen"]),
    ("Alex Johnson's Zoom Meeting", MeetingType.INSTANT, timedelta(days=2), 18, ["Marcus Lee"]),
    ("Client Demo - Acme Corp", MeetingType.SCHEDULED, timedelta(days=3), 42, ["Emily Chen", "Marcus Lee"]),
    ("Backend Architecture Discussion", MeetingType.SCHEDULED, timedelta(days=5), 65, ["Rahul Verma", "Priya Sharma"]),
    ("Alex Johnson's Zoom Meeting", MeetingType.INSTANT, timedelta(days=7), 12, ["Priya Sharma"]),
]


def _round_to_half_hour(value: datetime) -> datetime:
    minute = 30 if value.minute >= 30 else 0
    return value.replace(minute=minute, second=0, microsecond=0)


def _unique_code(used: set[str]) -> str:
    code = generate_meeting_code()
    while code in used:
        code = generate_meeting_code()
    used.add(code)
    return code


def seed_database(db: Session) -> None:
    if db.scalar(select(User.id).limit(1)) is not None:
        return

    users = [User(name=name, email=email, avatar_color=color) for name, email, color in USERS]
    db.add_all(users)
    host = users[0]
    now = utcnow()
    used_codes: set[str] = set()

    for title, description, offset, duration in UPCOMING:
        db.add(
            Meeting(
                meeting_code=_unique_code(used_codes),
                title=title,
                description=description,
                meeting_type=MeetingType.SCHEDULED,
                status=MeetingStatus.SCHEDULED,
                host=host,
                scheduled_start=_round_to_half_hour(now + offset),
                duration_minutes=duration,
            )
        )

    for title, meeting_type, ago, minutes, attendees in RECENT:
        started_at = _round_to_half_hour(now - ago)
        ended_at = started_at + timedelta(minutes=minutes)
        meeting = Meeting(
            meeting_code=_unique_code(used_codes),
            title=title,
            meeting_type=meeting_type,
            status=MeetingStatus.ENDED,
            host=host,
            scheduled_start=started_at if meeting_type == MeetingType.SCHEDULED else None,
            duration_minutes=60 if meeting_type == MeetingType.SCHEDULED else None,
            started_at=started_at,
            ended_at=ended_at,
            created_at=started_at - timedelta(days=1),
        )
        meeting.participants.append(
            Participant(
                user=host,
                display_name=host.name,
                role=ParticipantRole.HOST,
                status=ParticipantStatus.LEFT,
                joined_at=started_at,
                left_at=ended_at,
            )
        )
        for index, name in enumerate(attendees, start=1):
            meeting.participants.append(
                Participant(
                    display_name=name,
                    role=ParticipantRole.ATTENDEE,
                    status=ParticipantStatus.LEFT,
                    joined_at=started_at + timedelta(minutes=index),
                    left_at=ended_at,
                )
            )
        db.add(meeting)

    db.commit()
