"""
Application Configuration using Pydantic V2
Loads settings from environment variables
"""

import os
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    Uses Pydantic V2 for validation and type safety.
    """

    # Environment
    environment: Literal["development", "staging", "production"] = Field(
        default="development",
        description="Application environment",
    )

    # Database
    database_url: str = Field(
        default="postgresql+asyncpg://postgres:postgres@localhost:5432/gr8",
        description="Database connection URL (async format required)",
    )

    # Security
    secret_key: str = Field(
        default="dev-secret-key-change-in-production",
        description="Secret key for JWT tokens (change in production!)",
    )

    # API
    api_title: str = Field(default="gr8 API", description="API title")
    api_version: str = Field(default="0.1.0", description="API version")

    # CORS
    cors_origins: list[str] = Field(
        default=["http://localhost:5173", "http://localhost:5174"],
        description="Allowed CORS origins",
    )

    # Model Configuration
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",  # Ignore extra environment variables
    )


# Create global settings instance
settings = Settings()
