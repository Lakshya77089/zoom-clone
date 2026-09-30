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
    ("Alex Johnson", settings.default_user_email, "#F26D21"),
    ("Daniel Kim", "daniel.kim@example.com", "#0E71EB"),
    ("Ananya Iyer", "ananya.iyer@example.com", "#23B25E"),
    ("Lucas Moreau", "lucas.moreau@example.com", "#7B61FF"),
    ("Olivia Brooks", "olivia.brooks@example.com", "#E8173D"),
]

UPCOMING = [
    ("Daily Standup", "Quick round of updates and blockers.", timedelta(hours=1), 15),
    ("Q4 Marketing Kickoff", "Campaign goals, owners and the launch timeline.", timedelta(hours=4), 45),
    ("Customer Onboarding Review", "Go through feedback from the latest onboarding cohort.", timedelta(days=1, hours=2), 60),
    ("Hiring Sync - Frontend Engineer", "Shortlist candidates and plan the interview loop.", timedelta(days=2, hours=5), 30),
    ("1:1 with Daniel", None, timedelta(days=3, hours=1), 30),
    ("Monthly All-Hands", "Company updates, wins and open Q&A.", timedelta(days=6), 60),
]

RECENT = [
    ("Release Retrospective", MeetingType.SCHEDULED, timedelta(days=1), 48, ["Daniel Kim", "Ananya Iyer", "Lucas Moreau"]),
    ("Alex Johnson's Zoom Meeting", MeetingType.INSTANT, timedelta(days=2), 22, ["Olivia Brooks"]),
    ("Partner Demo - Northwind Traders", MeetingType.SCHEDULED, timedelta(days=3), 37, ["Lucas Moreau", "Olivia Brooks"]),
    ("API Design Review", MeetingType.SCHEDULED, timedelta(days=4), 70, ["Ananya Iyer", "Daniel Kim"]),
    ("Alex Johnson's Zoom Meeting", MeetingType.INSTANT, timedelta(days=6), 9, ["Daniel Kim"]),
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
