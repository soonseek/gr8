"""Unit tests for User Pydantic schemas"""

import pytest
from datetime import datetime
from decimal import Decimal
from app.schemas.user import UserCreate, UserResponse, UserRoleUpdate, UserStatusUpdate
from pydantic import ValidationError


def test_user_create_valid():
    """Test UserCreate schema with valid data"""
    user_data = {
        "wallet_address": "0x1234567890abcdef1234567890abcdef12345678",
        "role": "user"
    }
    user = UserCreate(**user_data)

    assert user.wallet_address == "0x1234567890abcdef1234567890abcdef12345678"
    assert user.role == "user"


def test_user_create_default_role():
    """Test UserCreate schema with default role"""
    user_data = {
        "wallet_address": "0x1234567890abcdef1234567890abcdef12345678"
    }
    user = UserCreate(**user_data)

    assert user.wallet_address == "0x1234567890abcdef1234567890abcdef12345678"
    assert user.role == "user"  # default


def test_user_create_invalid_role():
    """Test UserCreate schema rejects invalid role"""
    user_data = {
        "wallet_address": "0x1234567890abcdef1234567890abcdef12345678",
        "role": "superadmin"  # Invalid role
    }

    with pytest.raises(ValidationError) as exc_info:
        UserCreate(**user_data)

    assert 'role must be either "user" or "admin"' in str(exc_info.value)


def test_user_create_invalid_wallet_address_length():
    """Test UserCreate schema rejects invalid wallet address length"""
    user_data = {
        "wallet_address": "0x123456",  # Too short
        "role": "user"
    }

    with pytest.raises(ValidationError) as exc_info:
        UserCreate(**user_data)

    assert "at least 42 characters" in str(exc_info.value).lower()


def test_user_create_invalid_wallet_address_format():
    """Test UserCreate schema rejects invalid wallet address format"""
    user_data = {
        "wallet_address": "0xZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ",  # Invalid hex characters
        "role": "user"
    }

    with pytest.raises(ValidationError) as exc_info:
        UserCreate(**user_data)

    assert "string_pattern_mismatch" in str(exc_info.value).lower()


def test_user_response():
    """Test UserResponse schema"""
    from decimal import Decimal

    user_data = {
        "id": 1,
        "wallet_address": "0x1234567890abcdef1234567890abcdef12345678",
        "role": "admin",
        "status": "active",
        "ens_domain": None,
        "suspension_reason": None,
        "suspended_at": None,
        "banned_at": None,
        "total_purchases": Decimal("0"),
        "total_sales": Decimal("0"),
        "strategy_count": 0,
        "created_at": datetime(2026, 1, 14, 10, 0, 0),
        "updated_at": datetime(2026, 1, 14, 10, 0, 0)
    }
    user = UserResponse(**user_data)

    assert user.id == 1
    assert user.wallet_address == "0x1234567890abcdef1234567890abcdef12345678"
    assert user.role == "admin"
    assert user.status == "active"
    assert user.created_at == datetime(2026, 1, 14, 10, 0, 0)
    assert user.updated_at == datetime(2026, 1, 14, 10, 0, 0)


def test_user_role_update_valid():
    """Test UserRoleUpdate schema with valid data"""
    role_data = {"role": "admin"}
    role_update = UserRoleUpdate(**role_data)

    assert role_update.role == "admin"


def test_user_role_update_invalid():
    """Test UserRoleUpdate schema rejects invalid role"""
    role_data = {"role": "moderator"}  # Invalid role

    with pytest.raises(ValidationError) as exc_info:
        UserRoleUpdate(**role_data)

    # Pydantic v2 uses pattern mismatch error
    assert "string_pattern_mismatch" in str(exc_info.value).lower()


def test_user_role_update_both_roles():
    """Test UserRoleUpdate accepts both valid roles"""
    # Test 'user' role
    role_update_user = UserRoleUpdate(role="user")
    assert role_update_user.role == "user"

    # Test 'admin' role
    role_update_admin = UserRoleUpdate(role="admin")
    assert role_update_admin.role == "admin"


def test_user_create_with_status():
    """Test UserCreate schema with status field"""
    user_data = {
        "wallet_address": "0x1234567890abcdef1234567890abcdef12345678",
        "role": "user",
        "status": "active"
    }
    user = UserCreate(**user_data)

    assert user.wallet_address == "0x1234567890abcdef1234567890abcdef12345678"
    assert user.role == "user"
    assert user.status == "active"


def test_user_create_default_status():
    """Test UserCreate schema with default status"""
    user_data = {
        "wallet_address": "0x1234567890abcdef1234567890abcdef12345678"
    }
    user = UserCreate(**user_data)

    assert user.status == "active"  # default


def test_user_create_invalid_status():
    """Test UserCreate schema rejects invalid status"""
    user_data = {
        "wallet_address": "0x1234567890abcdef1234567890abcdef12345678",
        "status": "inactive"  # Invalid status
    }

    with pytest.raises(ValidationError) as exc_info:
        UserCreate(**user_data)

    assert 'status must be either "active", "suspended", or "banned"' in str(exc_info.value)


def test_user_create_with_ens_domain():
    """Test UserCreate schema with ENS domain"""
    user_data = {
        "wallet_address": "0x1234567890abcdef1234567890abcdef12345678",
        "ens_domain": "vitalik.eth"
    }
    user = UserCreate(**user_data)

    assert user.ens_domain == "vitalik.eth"


def test_user_response_with_status_fields():
    """Test UserResponse schema with all status fields"""
    user_data = {
        "id": 1,
        "wallet_address": "0x1234567890abcdef1234567890abcdef12345678",
        "role": "user",
        "status": "active",
        "ens_domain": "vitalik.eth",
        "suspension_reason": None,
        "suspended_at": None,
        "banned_at": None,
        "total_purchases": Decimal("100.5"),
        "total_sales": Decimal("50.25"),
        "strategy_count": 5,
        "created_at": datetime(2026, 1, 14, 10, 0, 0),
        "updated_at": datetime(2026, 1, 14, 10, 0, 0)
    }
    user = UserResponse(**user_data)

    assert user.id == 1
    assert user.wallet_address == "0x1234567890abcdef1234567890abcdef12345678"
    assert user.role == "user"
    assert user.status == "active"
    assert user.ens_domain == "vitalik.eth"
    assert user.total_purchases == Decimal("100.5")
    assert user.total_sales == Decimal("50.25")
    assert user.strategy_count == 5


def test_user_status_update_valid():
    """Test UserStatusUpdate schema with valid data"""
    status_data = {
        "status": "suspended",
        "suspension_reason": "Violated community guidelines"
    }
    status_update = UserStatusUpdate(**status_data)

    assert status_update.status == "suspended"
    assert status_update.suspension_reason == "Violated community guidelines"


def test_user_status_update_all_statuses():
    """Test UserStatusUpdate accepts all valid statuses"""
    # Test 'active' status
    status_active = UserStatusUpdate(status="active")
    assert status_active.status == "active"

    # Test 'suspended' status
    status_suspended = UserStatusUpdate(status="suspended")
    assert status_suspended.status == "suspended"

    # Test 'banned' status
    status_banned = UserStatusUpdate(status="banned")
    assert status_banned.status == "banned"


def test_user_status_update_invalid():
    """Test UserStatusUpdate rejects invalid status"""
    status_data = {"status": "inactive"}  # Invalid status

    with pytest.raises(ValidationError) as exc_info:
        UserStatusUpdate(**status_data)

    assert "string_pattern_mismatch" in str(exc_info.value).lower()

