"""Tests for database migration"""

import pytest
from sqlalchemy import text
from app.models.user import User


@pytest.mark.asyncio
@pytest.mark.postgresql
async def test_users_table_exists(db_session):
    """Test that users table exists"""
    # Check if table exists
    query = text("""
        SELECT EXISTS (
            SELECT FROM information_schema.tables
            WHERE table_name = 'users'
        )
    """)

    result = await db_session.execute(query)
    exists = result.scalar()

    assert exists is True, "users table does not exist"


@pytest.mark.asyncio
@pytest.mark.postgresql
async def test_users_table_columns(db_session):
    """Test that users table has all required columns"""
    # Get column information
    query = text("""
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = 'users'
        ORDER BY ordinal_position
    """)

    result = await db_session.execute(query)
    columns = result.fetchall()

    # Extract column names
    column_names = [col[0] for col in columns]
    column_dict = {col[0]: col for col in columns}

    # Check required columns exist
    required_columns = ['id', 'wallet_address', 'role', 'created_at', 'updated_at']
    for required_col in required_columns:
        assert required_col in column_names, f"Required column {required_col} is missing"

    # Check wallet_address is unique and not null
    assert column_dict['wallet_address'][2] == 'NO', "wallet_address should be NOT NULL"

    # Check role has default value
    assert column_dict['role'][3] is not None, "role should have a default value"


@pytest.mark.asyncio
async def test_role_check_constraint(db_session):
    """Test that role CHECK constraint works"""
    # Valid role should work
    user_valid = User(
        wallet_address="0x1234567890abcdef1234567890abcdef12345678",
        role="user"
    )

    db_session.add(user_valid)
    await db_session.commit()
    await db_session.refresh(user_valid)

    assert user_valid.role == "user"

    # Invalid role should fail during object creation due to @validates decorator
    with pytest.raises(ValueError, match="role must be either 'user' or 'admin'"):
        user_invalid = User(
            wallet_address="0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
            role="superadmin"  # Invalid role
        )


@pytest.mark.asyncio
async def test_wallet_address_unique_constraint(db_session):
    """Test that wallet_address unique constraint works"""
    user1 = User(
        wallet_address="0x1234567890abcdef1234567890abcdef12345678",
        role="user"
    )

    db_session.add(user1)
    await db_session.commit()

    # Try to create duplicate
    user2 = User(
        wallet_address="0x1234567890abcdef1234567890abcdef12345678",  # Same
        role="admin"
    )

    db_session.add(user2)

    with pytest.raises(Exception):  # Should raise IntegrityError
        await db_session.commit()


@pytest.mark.asyncio
@pytest.mark.postgresql
async def test_users_table_indexes(db_session):
    """Test that indexes are created"""
    # Check for indexes
    query = text("""
        SELECT indexname
        FROM pg_indexes
        WHERE tablename = 'users'
    """)

    result = await db_session.execute(query)
    indexes = [row[0] for row in result.fetchall()]

    # Check required indexes exist
    assert 'ix_users_wallet_address' in indexes or 'users_wallet_address_key' in indexes
    assert 'ix_users_role' in indexes or 'users_role_idx' in indexes
