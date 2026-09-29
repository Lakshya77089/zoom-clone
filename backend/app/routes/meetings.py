from fastapi import APIRouter, status

from app.core.deps import CurrentUser, Meetings, RequesterId
from app.schemas import (
    JoinMeetingIn,
    MeetingOut,
    MeetingSessionOut,
    RoomStateOut,
    ScheduleMeetingIn,
)

router = APIRouter(prefix="/meetings", tags=["meetings"])


def _session(meeting, participant) -> MeetingSessionOut:
    return MeetingSessionOut(
        meeting=MeetingOut.model_validate(meeting),
        participant=participant,
    )


@router.get("/upcoming", response_model=list[MeetingOut])
def list_upcoming(user: CurrentUser, meetings: Meetings):
    return meetings.list_upcoming(user)


@router.get("/recent", response_model=list[MeetingOut])
def list_recent(user: CurrentUser, meetings: Meetings):
    return meetings.list_recent(user)


@router.post("/instant", response_model=MeetingSessionOut, status_code=status.HTTP_201_CREATED)
def create_instant(user: CurrentUser, meetings: Meetings):
    return _session(*meetings.create_instant(user))


@router.post("", response_model=MeetingOut, status_code=status.HTTP_201_CREATED)
def schedule_meeting(data: ScheduleMeetingIn, user: CurrentUser, meetings: Meetings):
    return meetings.schedule(user, data)


@router.get("/{code}", response_model=MeetingOut)
def get_meeting(code: str, meetings: Meetings):
    return meetings.get_joinable(code)


@router.post("/{code}/start", response_model=MeetingSessionOut)
def start_meeting(code: str, user: CurrentUser, meetings: Meetings):
    return _session(*meetings.start(code, user))


@router.post("/{code}/join", response_model=MeetingSessionOut, status_code=status.HTTP_201_CREATED)
def join_meeting(code: str, data: JoinMeetingIn, meetings: Meetings):
    return _session(*meetings.join(code, data.display_name))


@router.post("/{code}/end", response_model=MeetingOut)
def end_meeting(code: str, requester_id: RequesterId, meetings: Meetings):
    return meetings.end(code, requester_id)


@router.get("/{code}/state", response_model=RoomStateOut)
def get_room_state(code: str, requester_id: RequesterId, meetings: Meetings):
    meeting, me = meetings.get_room_state(code, requester_id)
    return RoomStateOut(
        meeting=MeetingOut.model_validate(meeting),
        me=me,
        participants=meeting.active_participants,
    )
