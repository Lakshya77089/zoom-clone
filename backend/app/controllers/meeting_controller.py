from datetime import timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.core.exceptions import ForbiddenError, MeetingEndedError, NotFoundError, ValidationError
from app.models import (
    Meeting,
    MeetingStatus,
    MeetingType,
    Participant,
    ParticipantRole,
    ParticipantStatus,
    User,
)
from app.schemas import JoinMeetingIn, ScheduleMeetingIn
from app.utils.meeting_code import generate_meeting_code, normalize_meeting_code
from app.utils.time import to_naive_utc, utcnow

RECENT_MEETINGS_LIMIT = 10
START_TIME_GRACE = timedelta(minutes=1)


class MeetingController:
    def __init__(self, db: Session):
        self.db = db

    def _base_query(self):
        return select(Meeting).options(
            selectinload(Meeting.host),
            selectinload(Meeting.participants),
        )

    def _unique_code(self) -> str:
        while True:
            code = generate_meeting_code()
            exists = self.db.scalar(select(Meeting.id).where(Meeting.meeting_code == code))
            if exists is None:
                return code

    def get_by_code(self, raw_code: str) -> Meeting:
        code = normalize_meeting_code(raw_code)
        meeting = self.db.scalar(self._base_query().where(Meeting.meeting_code == code))
        if meeting is None:
            raise NotFoundError("Invalid meeting ID. Please check and try again.")
        return meeting

    def get_joinable(self, raw_code: str) -> Meeting:
        meeting = self.get_by_code(raw_code)
        if meeting.status == MeetingStatus.ENDED:
            raise MeetingEndedError("This meeting has ended.")
        return meeting

    def list_upcoming(self, user: User) -> list[Meeting]:
        now = utcnow()
        meetings = self.db.scalars(
            self._base_query()
            .where(
                Meeting.host_id == user.id,
                Meeting.meeting_type == MeetingType.SCHEDULED,
                Meeting.status != MeetingStatus.ENDED,
                Meeting.scheduled_start.is_not(None),
            )
            .order_by(Meeting.scheduled_start)
        ).all()
        return [m for m in meetings if m.scheduled_end and m.scheduled_end > now]

    def list_recent(self, user: User) -> list[Meeting]:
        return list(
            self.db.scalars(
                self._base_query()
                .where(Meeting.host_id == user.id, Meeting.started_at.is_not(None))
                .order_by(Meeting.started_at.desc())
                .limit(RECENT_MEETINGS_LIMIT)
            ).all()
        )

    def create_instant(self, user: User) -> tuple[Meeting, Participant]:
        now = utcnow()
        meeting = Meeting(
            meeting_code=self._unique_code(),
            title=f"{user.name}'s Zoom Meeting",
            meeting_type=MeetingType.INSTANT,
            status=MeetingStatus.LIVE,
            host=user,
            started_at=now,
        )
        host = self._add_participant(meeting, user.name, ParticipantRole.HOST, user)
        self.db.add(meeting)
        self.db.commit()
        return meeting, host

    def schedule(self, user: User, data: ScheduleMeetingIn) -> Meeting:
        start = to_naive_utc(data.start_time)
        if start < utcnow() - START_TIME_GRACE:
            raise ValidationError("Meeting start time must be in the future.")
        meeting = Meeting(
            meeting_code=self._unique_code(),
            title=data.title,
            description=data.description or None,
            meeting_type=MeetingType.SCHEDULED,
            status=MeetingStatus.SCHEDULED,
            host=user,
            scheduled_start=start,
            duration_minutes=data.duration_minutes,
        )
        self.db.add(meeting)
        self.db.commit()
        return meeting

    def start(self, raw_code: str, user: User) -> tuple[Meeting, Participant]:
        meeting = self.get_joinable(raw_code)
        if meeting.host_id != user.id:
            raise ForbiddenError("Only the host can start this meeting.")
        self._mark_live(meeting)
        host = next(
            (p for p in meeting.active_participants if p.user_id == user.id and p.is_host),
            None,
        )
        if host is None:
            host = self._add_participant(meeting, user.name, ParticipantRole.HOST, user)
        self.db.commit()
        return meeting, host

    def join(self, raw_code: str, data: JoinMeetingIn) -> tuple[Meeting, Participant]:
        meeting = self.get_joinable(raw_code)
        self._mark_live(meeting)
        participant = self._add_participant(meeting, data.display_name, ParticipantRole.ATTENDEE)
        participant.is_muted = data.is_muted
        participant.is_video_on = data.is_video_on
        self.db.commit()
        return meeting, participant

    def end(self, raw_code: str, requester_id: int) -> Meeting:
        meeting = self.get_by_code(raw_code)
        self.require_host(meeting, requester_id)
        self.close(meeting)
        self.db.commit()
        return meeting

    def get_room_state(self, raw_code: str, participant_id: int) -> tuple[Meeting, Participant]:
        meeting = self.get_by_code(raw_code)
        return meeting, self.get_participant(meeting, participant_id)

    def get_participant(self, meeting: Meeting, participant_id: int) -> Participant:
        participant = next((p for p in meeting.participants if p.id == participant_id), None)
        if participant is None:
            raise NotFoundError("Participant not found in this meeting.")
        return participant

    def require_active(self, meeting: Meeting, participant_id: int) -> Participant:
        participant = self.get_participant(meeting, participant_id)
        if participant.status != ParticipantStatus.ACTIVE:
            raise ForbiddenError("You are no longer in this meeting.")
        return participant

    def require_host(self, meeting: Meeting, participant_id: int) -> Participant:
        participant = self.require_active(meeting, participant_id)
        if not participant.is_host:
            raise ForbiddenError("Only the host can perform this action.")
        return participant

    def close(self, meeting: Meeting) -> None:
        now = utcnow()
        for participant in meeting.active_participants:
            participant.status = ParticipantStatus.LEFT
            participant.left_at = now
        meeting.status = MeetingStatus.ENDED
        meeting.ended_at = now

    def _mark_live(self, meeting: Meeting) -> None:
        if meeting.status == MeetingStatus.SCHEDULED:
            meeting.status = MeetingStatus.LIVE
            meeting.started_at = utcnow()

    def _add_participant(
        self,
        meeting: Meeting,
        display_name: str,
        role: ParticipantRole,
        user: User | None = None,
    ) -> Participant:
        participant = Participant(display_name=display_name, role=role, user=user, joined_at=utcnow())
        meeting.participants.append(participant)
        return participant
