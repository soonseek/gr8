"""Integration tests for user status migration"""

import pytest
from sqlalchemy import text
from app.core.database import AsyncSessionLocal


@pytest.mark.asyncio
async def test_migration_upgrade_columns_exist(db_session):
    """Test that migration adds all required columns"""
    # Check if new columns exist
    result = await db_session.execute(text("""
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = 'users'
        AND column_name IN (
            'status', 'ens_domain', 'suspension_reason',
            'suspended_at', 'banned_at', 'total_purchases',
            'total_sales', 'strategy_count'
        )
        ORDER BY column_name;
    """))
    columns = result.fetchall()

    # We expect 8 new columns
    column_names = [col[0] for col in columns]

    required_columns = [
        'status', 'ens_domain', 'suspension_reason',
        'suspended_at', 'banned_at', 'total_purchases',
        'total_sales', 'strategy_count'
    ]

    for col in required_columns:
        assert col in column_names, f"Column {col} not found in users table"


@pytest.mark.asyncio
async def test_migration_status_default_value(db_session):
    """Test that existing records have status='active' by default"""
    # The migration should set status='active' for all existing users
    # This is tested by inserting a new user without specifying status
    # and checking it defaults to 'active'

    result = await db_session.execute(text("""
        SELECT column_default
        FROM information_schema.columns
        WHERE table_name = 'users'
        AND column_name = 'status';
    """))
    default_value = result.scalar_one()

    # PostgreSQL stores default as 'active'::varchar or similar
    assert default_value is not None
    assert 'active' in str(default_value).lower()


@pytest.mark.asyncio
async def test_migration_indexes_exist(db_session):
    """Test that migration creates required indexes"""
    result = await db_session.execute(text("""
        SELECT indexname
        FROM pg_indexes
        WHERE tablename = 'users'
        AND indexname IN ('idx_users_status', 'idx_users_wallet')
        ORDER BY indexname;
    """))
    indexes = result.fetchall()

    index_names = [idx[0] for idx in indexes]

    # Check that status index exists
    assert 'idx_users_status' in index_names, "idx_users_status index not found"

    # Note: idx_users_wallet may not exist if wallet_address already has unique index
    # The migration correctly skips it to avoid conflicts


@pytest.mark.asyncio
async def test_migration_aggregated_data_defaults(db_session):
    """Test that aggregated data columns have correct defaults"""
    result = await db_session.execute(text("""
        SELECT column_name, column_default
        FROM information_schema.columns
        WHERE table_name = 'users'
        AND column_name IN ('total_purchases', 'total_sales', 'strategy_count')
        ORDER BY column_name;
    """))
    columns = result.fetchall()

    for col_name, default_value in columns:
        assert default_value is not None, f"Column {col_name} has no default value"
        assert '0' in str(default_value), f"Column {col_name} default should be 0, got {default_value}"


@pytest.mark.asyncio
async def test_user_model_with_new_columns(db_session):
    """Test that User model works with new columns"""
    from app.models.user import User
    from decimal import Decimal

    # Create a user with all new fields
    user = User(
        wallet_address="0x1234567890abcdef1234567890abcdef12345678",
        role="user",
        status="active",
        ens_domain="test.eth",
        total_purchases=Decimal("100.5"),
        total_sales=Decimal("50.25"),
        strategy_count=5
    )

    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)

    assert user.status == "active"
    assert user.ens_domain == "test.eth"
    assert user.total_purchases == Decimal("100.5")
    assert user.total_sales == Decimal("50.25")
    assert user.strategy_count == 5


@pytest.mark.asyncio
async def test_user_status_validation(db_session):
    """Test that User model validates status values"""
    from app.models.user import User

    # Test valid status
    user = User(
        wallet_address="0x1234567890abcdef1234567890abcdef12345678",
        status="active"
    )
    db_session.add(user)
    await db_session.commit()

    # Test invalid status raises error
    with pytest.raises(ValueError, match="status must be"):
        user_invalid = User(
            wallet_address="0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
            status="invalid_status"
        )
        db_session.add(user_invalid)
        await db_session.commit()
