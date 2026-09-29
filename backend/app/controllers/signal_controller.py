from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.controllers.meeting_controller import MeetingController
from app.core.exceptions import NotFoundError, ValidationError
from app.models import ParticipantStatus, Signal
from app.schemas import SignalIn

INBOX_LIMIT = 200


class SignalController:
    def __init__(self, db: Session):
        self.db = db
        self.meetings = MeetingController(db)

    def send(self, raw_code: str, requester_id: int, data: SignalIn) -> Signal:
        meeting = self.meetings.get_joinable(raw_code)
        self.meetings.require_active(meeting, requester_id)
        if data.recipient_id == requester_id:
            raise ValidationError("You cannot send a signal to yourself.")
        recipient = self.meetings.get_participant(meeting, data.recipient_id)
        if recipient.status != ParticipantStatus.ACTIVE:
            raise NotFoundError("That participant is no longer in the meeting.")
        signal = Signal(
            meeting_id=meeting.id,
            sender_id=requester_id,
            recipient_id=recipient.id,
            kind=data.kind,
            payload=data.payload,
        )
        self.db.add(signal)
        self.db.commit()
        return signal

    def receive(self, raw_code: str, requester_id: int, after: int) -> list[Signal]:
        meeting = self.meetings.get_by_code(raw_code)
        self.meetings.get_participant(meeting, requester_id)
        if after > 0:
            self.db.execute(delete(Signal).where(Signal.recipient_id == requester_id, Signal.id <= after))
            self.db.commit()
        return list(
            self.db.scalars(
                select(Signal)
                .where(Signal.recipient_id == requester_id, Signal.id > after)
                .order_by(Signal.id)
                .limit(INBOX_LIMIT)
            ).all()
        )
