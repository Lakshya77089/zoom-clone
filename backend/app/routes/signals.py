from typing import Annotated

from fastapi import APIRouter, Query, status

from app.core.deps import RequesterId, Signals
from app.schemas import SignalIn, SignalOut

router = APIRouter(prefix="/meetings/{code}/signals", tags=["signals"])


@router.post("", response_model=SignalOut, status_code=status.HTTP_201_CREATED)
def send_signal(code: str, data: SignalIn, requester_id: RequesterId, signals: Signals):
    return signals.send(code, requester_id, data)


@router.get("", response_model=list[SignalOut])
def receive_signals(
    code: str,
    requester_id: RequesterId,
    signals: Signals,
    after: Annotated[int, Query(ge=0)] = 0,
):
    return signals.receive(code, requester_id, after)
