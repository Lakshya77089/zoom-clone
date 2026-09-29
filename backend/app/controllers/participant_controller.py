from sqlalchemy.orm import Session

from app.controllers.meeting_controller import MeetingController
from app.core.exceptions import ForbiddenError, ValidationError
from app.models import Meeting, Participant, ParticipantRole, ParticipantStatus
from app.schemas import ParticipantUpdateIn
from app.utils.time import utcnow


class ParticipantController:
    def __init__(self, db: Session):
        self.db = db
        self.meetings = MeetingController(db)

    def list_active(self, raw_code: str) -> list[Participant]:
        return self.meetings.get_by_code(raw_code).active_participants

    def update_self(
        self,
        raw_code: str,
        participant_id: int,
        requester_id: int,
        data: ParticipantUpdateIn,
    ) -> Participant:
        if participant_id != requester_id:
            raise ForbiddenError("You can only update your own audio and video.")
        meeting = self.meetings.get_joinable(raw_code)
        participant = self.meetings.require_active(meeting, participant_id)
        if data.is_muted is not None:
            participant.is_muted = data.is_muted
        if data.is_video_on is not None:
            participant.is_video_on = data.is_video_on
        self.db.commit()
        return participant

    def leave(self, raw_code: str, participant_id: int, requester_id: int) -> Participant:
        if participant_id != requester_id:
            raise ForbiddenError("You can only leave the meeting for yourself.")
        meeting = self.meetings.get_by_code(raw_code)
        participant = self.meetings.get_participant(meeting, participant_id)
        if participant.status == ParticipantStatus.ACTIVE:
            participant.status = ParticipantStatus.LEFT
            participant.left_at = utcnow()
            self._after_departure(meeting, participant)
            self.db.commit()
        return participant

    def mute_all(self, raw_code: str, requester_id: int) -> list[Participant]:
        meeting = self.meetings.get_joinable(raw_code)
        self.meetings.require_host(meeting, requester_id)
        for participant in meeting.active_participants:
            if not participant.is_host:
                participant.is_muted = True
        self.db.commit()
        return meeting.active_participants

    def remove(self, raw_code: str, participant_id: int, requester_id: int) -> Participant:
        meeting = self.meetings.get_joinable(raw_code)
        self.meetings.require_host(meeting, requester_id)
        if participant_id == requester_id:
            raise ValidationError("The host cannot remove themselves.")
        participant = self.meetings.require_active(meeting, participant_id)
        participant.status = ParticipantStatus.REMOVED
        participant.left_at = utcnow()
        self.db.commit()
        return participant

    def _after_departure(self, meeting: Meeting, departed: Participant) -> None:
        remaining = meeting.active_participants
        if not remaining:
            self.meetings.close(meeting)
            return
        if departed.is_host and not any(p.is_host for p in remaining):
            remaining[0].role = ParticipantRole.HOST
