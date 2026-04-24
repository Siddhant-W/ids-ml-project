from pydantic_settings import BaseSettings
from pathlib import Path

_env_path = Path(__file__).resolve().parent / ".env"

class Settings(BaseSettings):
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 480
    # Dev servers may run on either hostname; allow both by default.
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    app_env: str = "development"
    
    class Config:
        env_file = str(_env_path)
        extra = "ignore"

settings = Settings()
