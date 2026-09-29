from fastapi import APIRouter

from app.core.deps import Rtc
from app.schemas import RtcConfigOut

router = APIRouter(prefix="/rtc", tags=["rtc"])


@router.get("/ice-servers", response_model=RtcConfigOut)
def get_ice_servers(rtc: Rtc):
    return rtc.ice_config()
