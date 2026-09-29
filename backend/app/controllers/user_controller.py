from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.exceptions import NotFoundError
from app.models import User


class UserController:
    def __init__(self, db: Session):
        self.db = db

    def get_default_user(self) -> User:
        user = self.db.scalar(select(User).where(User.email == settings.default_user_email))
        if user is None:
            raise NotFoundError("Default user is not seeded")
        return user
