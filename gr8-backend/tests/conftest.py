"""
Pytest Configuration and Fixtures
Provides async database session fixtures for testing
"""

import asyncio
from typing import AsyncGenerator, Generator

import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker

from app.core.database import Base, get_db
from main import app
from app.models.user import User  # Import User model to ensure it's included in Base.metadata


# Test database URL (use SQLite for faster testing)
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"


# Create async engine for testing
test_engine = create_async_engine(
    TEST_DATABASE_URL,
    echo=False,
)

# Create async session factory for testing
TestAsyncSessionLocal = async_sessionmaker(
    bind=test_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


@pytest.fixture(scope="function")
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Create a test database session.

    Yields:
        AsyncSession: Test database session
    """
    # Create tables
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Create session
    async with TestAsyncSessionLocal() as session:
        yield session

    # Cleanup: drop all tables
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture(scope="function")
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """
    Create a test HTTP client with async database session override.

    Args:
        db_session: Test database session

    Yields:
        AsyncClient: Test HTTP client
    """

    async def override_get_db():
        """Override get_db dependency for testing"""
        yield db_session

    # Override dependency
    app.dependency_overrides[get_db] = override_get_db

    # Create test client
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        yield ac

    # Clear overrides
    app.dependency_overrides.clear()


# Alias for async_client
async_client = client


@pytest.fixture(scope="function")
async def admin_user(db_session: AsyncSession) -> User:
    """
    Create an admin user for testing.

    Args:
        db_session: Test database session

    Returns:
        User: Admin user
    """
    admin = User(
        wallet_address="0x1234567890abcdef1234567890abcdef12345678",
        role="admin",
        status="active",
        total_purchases=0,
        total_sales=0,
        strategy_count=0
    )
    db_session.add(admin)
    await db_session.commit()
    await db_session.refresh(admin)
    return admin


@pytest.fixture(scope="function")
async def normal_user(db_session: AsyncSession) -> User:
    """
    Create a normal user for testing.

    Args:
        db_session: Test database session

    Returns:
        User: Normal user
    """
    user = User(
        wallet_address="0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
        role="user",
        status="active",
        total_purchases=0,
        total_sales=0,
        strategy_count=0
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    return user


@pytest.fixture(scope="function")
async def admin_client(
    client: AsyncClient,
    admin_user: User
) -> AsyncGenerator[AsyncClient, None]:
    """
    Create a test client with admin authentication pre-configured.

    Args:
        client: Base test client
        admin_user: Admin user fixture

    Yields:
        AsyncClient: Authenticated admin client
    """
    from app.middleware.admin_auth import verify_admin_token

    async def mock_verify_admin():
        """Mock verify_admin_token to return admin_user"""
        return admin_user

    # Override dependency
    original = app.dependency_overrides.get(verify_admin_token)
    app.dependency_overrides[verify_admin_token] = mock_verify_admin

    yield client

    # Restore original override
    if original:
        app.dependency_overrides[verify_admin_token] = original
    else:
        app.dependency_overrides.pop(verify_admin_token, None)


# Test database URL (use SQLite for faster testing)
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"


# Create async engine for testing
test_engine = create_async_engine(
    TEST_DATABASE_URL,
    echo=False,
)

# Create async session factory for testing
TestAsyncSessionLocal = async_sessionmaker(
    bind=test_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


@pytest.fixture(scope="function")
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Create a test database session.

    Yields:
        AsyncSession: Test database session
    """
    # Create tables
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Create session
    async with TestAsyncSessionLocal() as session:
        yield session

    # Cleanup: drop all tables
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture(scope="function")
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """
    Create a test HTTP client with async database session override.

    Args:
        db_session: Test database session

    Yields:
        AsyncClient: Test HTTP client
    """

    async def override_get_db():
        """Override get_db dependency for testing"""
        yield db_session

    # Override dependency
    app.dependency_overrides[get_db] = override_get_db

    # Create test client
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        yield ac

    # Clear overrides
    app.dependency_overrides.clear()


@pytest.fixture(scope="session")
def event_loop() -> Generator:
    """
    Create an instance of the default event loop for the test session.
    """
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


def pytest_configure(config):
    """Configure pytest markers"""
    config.addinivalue_line(
        "markers", "postgresql: mark test as requiring PostgreSQL (skips on SQLite)"
    )


def pytest_collection_modifyitems(config, items):
    """Automatically skip PostgreSQL tests when using SQLite"""
    for item in items:
        if "postgresql" in item.keywords and "sqlite" in TEST_DATABASE_URL.lower():
            item.add_marker(pytest.mark.skip(reason="Test requires PostgreSQL, using SQLite"))
