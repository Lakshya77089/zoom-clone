import secrets

from sqlalchemy import Engine, inspect, text


def add_participant_session_tokens(engine: Engine) -> None:
    columns = {column["name"] for column in inspect(engine).get_columns("participants")}
    if "session_token" in columns:
        return
    with engine.begin() as connection:
        connection.execute(text("ALTER TABLE participants ADD COLUMN session_token VARCHAR(64)"))
        ids = connection.execute(text("SELECT id FROM participants")).scalars().all()
        for participant_id in ids:
            connection.execute(
                text("UPDATE participants SET session_token = :token WHERE id = :id"),
                {"token": secrets.token_urlsafe(32), "id": participant_id},
            )


def run_migrations(engine: Engine) -> None:
    add_participant_session_tokens(engine)
