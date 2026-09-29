from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "Zoom Clone API"
    database_url: str = "sqlite:///./zoom.db"
    frontend_url: str = "http://localhost:3000"
    cors_origins: str = "http://localhost:3000"
    default_user_email: str = "alex.johnson@example.com"

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()
