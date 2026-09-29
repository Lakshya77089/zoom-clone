from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.utils.time import utcnow

if TYPE_CHECKING:
    from app.models.meeting import Meeting


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    avatar_color: Mapped[str] = mapped_column(String(7), default="#0B5CFF")
    created_at: Mapped[datetime] = mapped_column(default=utcnow)

    hosted_meetings: Mapped[list["Meeting"]] = relationship(back_populates="host")
