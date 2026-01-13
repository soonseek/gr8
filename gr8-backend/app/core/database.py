"""
Database configuration and session management
Uses SQLAlchemy 2.0 with async PostgreSQL
"""

from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings

# Database URL from settings
# Format: postgresql+asyncpg://user:password@host:port/database
DATABASE_URL = settings.database_url

# Create async engine with connection pooling
engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,  # Verify connections before using
)

# Create async session factory
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


# Base class for models
class Base(DeclarativeBase):
    """Base class for all SQLAlchemy models"""
    pass


# Dependency function to get DB session
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency function to yield async database sessions.

    Usage:
        @app.get("/users/")
        async def read_users(db: AsyncSession = Depends(get_db)):
            ...
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
