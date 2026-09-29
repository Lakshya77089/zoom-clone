import re
import secrets

MEETING_CODE_LENGTH = 11


def generate_meeting_code() -> str:
    first = str(secrets.randbelow(9) + 1)
    rest = "".join(str(secrets.randbelow(10)) for _ in range(MEETING_CODE_LENGTH - 1))
    return first + rest


def normalize_meeting_code(raw: str) -> str:
    return re.sub(r"\D", "", raw)
