from fastapi import APIRouter

from app.routes import meetings, participants, users

api_router = APIRouter(prefix="/api")
api_router.include_router(users.router)
api_router.include_router(meetings.router)
api_router.include_router(participants.router)


@api_router.get("/health", tags=["health"])
def health():
    return {"status": "ok"}
