from fastapi import APIRouter, status

from app.core.deps import CurrentUser, Meetings, PublicUrl, RequesterId
from app.schemas import (
    JoinMeetingIn,
    MeetingOut,
    MeetingSessionOut,
    RoomStateOut,
    ScheduleMeetingIn,
)

router = APIRouter(prefix="/meetings", tags=["meetings"])


def _session(public_url: str, meeting, participant) -> MeetingSessionOut:
    return MeetingSessionOut(
        meeting=MeetingOut.present(meeting, public_url),
        participant=participant,
    )


@router.get("/upcoming", response_model=list[MeetingOut])
def list_upcoming(user: CurrentUser, meetings: Meetings, public_url: PublicUrl):
    return [MeetingOut.present(m, public_url) for m in meetings.list_upcoming(user)]


@router.get("/recent", response_model=list[MeetingOut])
def list_recent(user: CurrentUser, meetings: Meetings, public_url: PublicUrl):
    return [MeetingOut.present(m, public_url) for m in meetings.list_recent(user)]


@router.post("/instant", response_model=MeetingSessionOut, status_code=status.HTTP_201_CREATED)
def create_instant(user: CurrentUser, meetings: Meetings, public_url: PublicUrl):
    return _session(public_url, *meetings.create_instant(user))


@router.post("", response_model=MeetingOut, status_code=status.HTTP_201_CREATED)
def schedule_meeting(data: ScheduleMeetingIn, user: CurrentUser, meetings: Meetings, public_url: PublicUrl):
    return MeetingOut.present(meetings.schedule(user, data), public_url)


@router.get("/{code}", response_model=MeetingOut)
def get_meeting(code: str, meetings: Meetings, public_url: PublicUrl):
    return MeetingOut.present(meetings.get_joinable(code), public_url)


@router.delete("/{code}", status_code=status.HTTP_204_NO_CONTENT)
def delete_meeting(code: str, user: CurrentUser, meetings: Meetings):
    meetings.delete(code, user)


@router.post("/{code}/start", response_model=MeetingSessionOut)
def start_meeting(code: str, user: CurrentUser, meetings: Meetings, public_url: PublicUrl):
    return _session(public_url, *meetings.start(code, user))


@router.post("/{code}/join", response_model=MeetingSessionOut, status_code=status.HTTP_201_CREATED)
def join_meeting(code: str, data: JoinMeetingIn, meetings: Meetings, public_url: PublicUrl):
    return _session(public_url, *meetings.join(code, data))


@router.post("/{code}/end", response_model=MeetingOut)
def end_meeting(code: str, requester_id: RequesterId, meetings: Meetings, public_url: PublicUrl):
    return MeetingOut.present(meetings.end(code, requester_id), public_url)


@router.get("/{code}/state", response_model=RoomStateOut)
def get_room_state(code: str, requester_id: RequesterId, meetings: Meetings, public_url: PublicUrl):
    meeting, me = meetings.get_room_state(code, requester_id)
    return RoomStateOut(
        meeting=MeetingOut.present(meeting, public_url),
        me=me,
        participants=meeting.active_participants,
    )
