from fastapi import APIRouter

from app.core.deps import Participants, RequesterId
from app.schemas import ParticipantOut, ParticipantUpdateIn

router = APIRouter(prefix="/meetings/{code}/participants", tags=["participants"])


@router.get("", response_model=list[ParticipantOut])
def list_participants(code: str, participants: Participants):
    return participants.list_active(code)


@router.post("/mute-all", response_model=list[ParticipantOut])
def mute_all(code: str, requester_id: RequesterId, participants: Participants):
    return participants.mute_all(code, requester_id)


@router.patch("/{participant_id}", response_model=ParticipantOut)
def update_participant(
    code: str,
    participant_id: int,
    data: ParticipantUpdateIn,
    requester_id: RequesterId,
    participants: Participants,
):
    return participants.update_self(code, participant_id, requester_id, data)


@router.post("/{participant_id}/leave", response_model=ParticipantOut)
def leave_meeting(code: str, participant_id: int, requester_id: RequesterId, participants: Participants):
    return participants.leave(code, participant_id, requester_id)


@router.delete("/{participant_id}", response_model=ParticipantOut)
def remove_participant(code: str, participant_id: int, requester_id: RequesterId, participants: Participants):
    return participants.remove(code, participant_id, requester_id)
