from datetime import datetime, timedelta
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Index, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.enums import MeetingStatus, MeetingType, ParticipantStatus, enum_column
from app.utils.time import utcnow

if TYPE_CHECKING:
    from app.models.participant import Participant
    from app.models.user import User


class Meeting(Base):
    __tablename__ = "meetings"
    __table_args__ = (Index("ix_meetings_host_status", "host_id", "status"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    meeting_code: Mapped[str] = mapped_column(String(11), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(200))
    description: Mapped[str | None] = mapped_column(Text)
    meeting_type: Mapped[MeetingType] = mapped_column(enum_column(MeetingType))
    status: Mapped[MeetingStatus] = mapped_column(
        enum_column(MeetingStatus),
        default=MeetingStatus.SCHEDULED,
    )
    host_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    scheduled_start: Mapped[datetime | None]
    duration_minutes: Mapped[int | None]
    started_at: Mapped[datetime | None]
    ended_at: Mapped[datetime | None]
    created_at: Mapped[datetime] = mapped_column(default=utcnow)

    host: Mapped["User"] = relationship(back_populates="hosted_meetings")
    participants: Mapped[list["Participant"]] = relationship(
        back_populates="meeting",
        cascade="all, delete-orphan",
        order_by="Participant.joined_at",
    )

    @property
    def scheduled_end(self) -> datetime | None:
        if self.scheduled_start is None or self.duration_minutes is None:
            return None
        return self.scheduled_start + timedelta(minutes=self.duration_minutes)

    @property
    def participant_count(self) -> int:
        return len(self.participants)

    @property
    def active_participants(self) -> list["Participant"]:
        return [p for p in self.participants if p.status == ParticipantStatus.ACTIVE]
