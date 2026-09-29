from datetime import datetime
from typing import Any

from sqlalchemy import JSON, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.enums import SignalKind, enum_column
from app.utils.time import utcnow


class Signal(Base):
    __tablename__ = "signals"
    __table_args__ = (
        Index("ix_signals_recipient_cursor", "recipient_id", "id"),
        {"sqlite_autoincrement": True},
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    meeting_id: Mapped[int] = mapped_column(ForeignKey("meetings.id", ondelete="CASCADE"), index=True)
    sender_id: Mapped[int] = mapped_column(ForeignKey("participants.id", ondelete="CASCADE"))
    recipient_id: Mapped[int] = mapped_column(ForeignKey("participants.id", ondelete="CASCADE"))
    kind: Mapped[SignalKind] = mapped_column(enum_column(SignalKind))
    payload: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(default=utcnow)
