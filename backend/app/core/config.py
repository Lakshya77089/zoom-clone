from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "Zoom Clone API"
    database_url: str = "sqlite:///./zoom.db"
    frontend_url: str = "http://localhost:3000"
    cors_origins: str = "http://localhost:3000"
    default_user_email: str = "alex.johnson@example.com"
    stun_urls: str = "stun:stun.l.google.com:19302,stun:stun1.l.google.com:19302"
    turn_urls: str = ""
    turn_username: str = ""
    turn_credential: str = ""
    cloudflare_turn_key_id: str = ""
    cloudflare_turn_api_token: str = ""
    ice_transport_policy: Literal["all", "relay"] = "all"

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()
