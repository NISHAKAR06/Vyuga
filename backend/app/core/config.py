from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "AgriProcure API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    API_V1_STR: str = "/api/v1"

    DATABASE_URL: str = "sqlite+aiosqlite:///./agriprocure.db"
    REDIS_URL: str = "redis://localhost:6379/0"

    JWT_SECRET: str = "agriprocure_super_secret_jwt_key_2026_change_in_prod"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_EXPIRE_MINUTES: int = 120
    JWT_REFRESH_EXPIRE_DAYS: int = 7

    FRONTEND_URL: str = "http://localhost:5173"
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"]

    S3_ENDPOINT: Optional[str] = None
    S3_BUCKET: Optional[str] = "agriprocure-assets"
    S3_ACCESS_KEY: Optional[str] = None
    S3_SECRET_KEY: Optional[str] = None

    SMS_PROVIDER: str = "APP"
    WHATSAPP_PROVIDER: str = "APP"

    # Twilio WhatsApp (optional — falls back to mock when not set)
    TWILIO_ACCOUNT_SID: Optional[str] = None
    TWILIO_AUTH_TOKEN: Optional[str] = None
    TWILIO_WHATSAPP_FROM: str = "whatsapp:+14155238886"

    # Queue Intelligence Worker
    QUEUE_MONITOR_INTERVAL_SECONDS: float = 2.0
    ANOMALY_SCORE_THRESHOLD: float = 0.65
    LSTM_WINDOW_SIZE: int = 20
    NORMAL_THROUGHPUT_PER_HOUR: int = 15  # farmers/hour baseline

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
