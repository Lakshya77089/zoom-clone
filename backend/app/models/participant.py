import secrets
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Index, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.enums import ParticipantRole, ParticipantStatus, enum_column
from app.utils.time import utcnow

if TYPE_CHECKING:
    from app.models.meeting import Meeting
    from app.models.user import User


class Participant(Base):
    __tablename__ = "participants"
    __table_args__ = (Index("ix_participants_meeting_status", "meeting_id", "status"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    meeting_id: Mapped[int] = mapped_column(ForeignKey("meetings.id", ondelete="CASCADE"))
    user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"))
    display_name: Mapped[str] = mapped_column(String(100))
    session_token: Mapped[str] = mapped_column(String(64), default=lambda: secrets.token_urlsafe(32))
    role: Mapped[ParticipantRole] = mapped_column(
        enum_column(ParticipantRole),
        default=ParticipantRole.ATTENDEE,
    )
    status: Mapped[ParticipantStatus] = mapped_column(
        enum_column(ParticipantStatus),
        default=ParticipantStatus.ACTIVE,
    )
    is_muted: Mapped[bool] = mapped_column(default=False)
    is_video_on: Mapped[bool] = mapped_column(default=True)
    joined_at: Mapped[datetime] = mapped_column(default=utcnow)
    left_at: Mapped[datetime | None]

    meeting: Mapped["Meeting"] = relationship(back_populates="participants")
    user: Mapped["User | None"] = relationship()

    @property
    def is_host(self) -> bool:
        return self.role == ParticipantRole.HOST
