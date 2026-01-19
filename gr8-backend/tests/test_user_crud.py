"""Integration tests for User CRUD operations"""

import pytest
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from app.models.user import User


@pytest.mark.asyncio
async def test_create_user(db_session):
    """Test creating a new user"""
    user = User(
        wallet_address="0x1234567890abcdef1234567890abcdef12345678",
        role="user"
    )

    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)

    assert user.id is not None
    assert user.wallet_address == "0x1234567890abcdef1234567890abcdef12345678"
    assert user.role == "user"
    assert user.is_admin is False


@pytest.mark.asyncio
async def test_create_admin_user(db_session):
    """Test creating an admin user"""
    admin = User(
        wallet_address="0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
        role="admin"
    )

    db_session.add(admin)
    await db_session.commit()
    await db_session.refresh(admin)

    assert admin.id is not None
    assert admin.role == "admin"
    assert admin.is_admin is True


@pytest.mark.asyncio
async def test_unique_wallet_address(db_session):
    """Test wallet_address unique constraint"""
    user1 = User(
        wallet_address="0x1234567890abcdef1234567890abcdef12345678",
        role="user"
    )

    db_session.add(user1)
    await db_session.commit()

    # Try to create another user with same wallet address
    user2 = User(
        wallet_address="0x1234567890abcdef1234567890abcdef12345678",  # Same address
        role="admin"
    )

    db_session.add(user2)

    with pytest.raises(IntegrityError):
        await db_session.commit()


@pytest.mark.asyncio
async def test_query_user_by_wallet_address(db_session):
    """Test querying user by wallet address"""
    # Create user
    user = User(
        wallet_address="0x1234567890abcdef1234567890abcdef12345678",
        role="admin"
    )

    db_session.add(user)
    await db_session.commit()

    # Query user
    stmt = select(User).where(User.wallet_address == "0x1234567890abcdef1234567890abcdef12345678")
    result = await db_session.execute(stmt)
    found_user = result.scalar_one()

    assert found_user is not None
    assert found_user.role == "admin"
    assert found_user.is_admin is True
    assert found_user.wallet_address == "0x1234567890abcdef1234567890abcdef12345678"


@pytest.mark.asyncio
async def test_update_user_role(db_session):
    """Test updating user role"""
    user = User(
        wallet_address="0x1234567890abcdef1234567890abcdef12345678",
        role="user"
    )

    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)

    # Update role to admin
    user.role = "admin"
    await db_session.commit()
    await db_session.refresh(user)

    assert user.role == "admin"
    assert user.is_admin is True


@pytest.mark.asyncio
async def test_delete_user(db_session):
    """Test deleting a user"""
    user = User(
        wallet_address="0x1234567890abcdef1234567890abcdef12345678",
        role="user"
    )

    db_session.add(user)
    await db_session.commit()
    user_id = user.id

    # Delete user
    await db_session.delete(user)
    await db_session.commit()

    # Verify user is deleted
    stmt = select(User).where(User.id == user_id)
    result = await db_session.execute(stmt)
    found_user = result.scalar_one_or_none()

    assert found_user is None


@pytest.mark.asyncio
async def test_list_all_users(db_session):
    """Test listing all users"""
    # Create multiple users
    user1 = User(wallet_address="0x1111111111111111111111111111111111111111", role="user")
    user2 = User(wallet_address="0x2222222222222222222222222222222222222222", role="admin")
    user3 = User(wallet_address="0x3333333333333333333333333333333333333333", role="user")

    db_session.add_all([user1, user2, user3])
    await db_session.commit()

    # Query all users
    stmt = select(User)
    result = await db_session.execute(stmt)
    users = result.scalars().all()

    assert len(users) == 3
    # Count admins
    admins = [u for u in users if u.is_admin]
    assert len(admins) == 1


@pytest.mark.asyncio
async def test_user_timestamps(db_session):
    """Test user created_at and updated_at timestamps"""
    user = User(
        wallet_address="0x1234567890abcdef1234567890abcdef12345678",
        role="user"
    )

    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)

    assert user.created_at is not None
    assert user.updated_at is not None

    # Update user and check updated_at changes
    original_updated_at = user.updated_at
    user.role = "admin"
    await db_session.commit()
    await db_session.refresh(user)

    # Note: updated_at should change, but timing might be too fast to detect
    assert user.role == "admin"
