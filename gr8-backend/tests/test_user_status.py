"""Unit tests for User model status management features"""

import pytest
from datetime import datetime
from decimal import Decimal
from app.models.user import User


def test_user_model_status_active():
    """Test User model with active status"""
    user = User(
        wallet_address="0x1234567890abcdef1234567890abcdef12345678",
        role="user",
        status="active"
    )

    assert user.status == "active"
    assert user.is_active is True
    assert user.is_suspended is False
    assert user.is_banned is False


def test_user_model_status_suspended():
    """Test User model with suspended status"""
    user = User(
        wallet_address="0x1234567890abcdef1234567890abcdef12345678",
        role="user",
        status="suspended",
        suspension_reason="Violated community guidelines",
        suspended_at=datetime.utcnow()
    )

    assert user.status == "suspended"
    assert user.is_active is False
    assert user.is_suspended is True
    assert user.is_banned is False
    assert user.suspension_reason == "Violated community guidelines"
    assert user.suspended_at is not None


def test_user_model_status_banned():
    """Test User model with banned status"""
    user = User(
        wallet_address="0x1234567890abcdef1234567890abcdef12345678",
        role="user",
        status="banned",
        banned_at=datetime.utcnow()
    )

    assert user.status == "banned"
    assert user.is_active is False
    assert user.is_suspended is False
    assert user.is_banned is True
    assert user.banned_at is not None


def test_user_model_status_validation_invalid():
    """Test User model status validation with invalid value"""
    with pytest.raises(ValueError, match="status must be 'active', 'suspended', or 'banned'"):
        User(
            wallet_address="0x1234567890abcdef1234567890abcdef12345678",
            status="invalid"  # Invalid status
        )


def test_user_model_default_status():
    """Test User model with default status"""
    user = User(
        wallet_address="0x1234567890abcdef1234567890abcdef12345678",
        status="active"
    )

    assert user.status == "active"
    assert user.is_active is True


def test_user_model_ens_domain():
    """Test User model with ENS domain"""
    user = User(
        wallet_address="0x1234567890abcdef1234567890abcdef12345678",
        ens_domain="vitalik.eth"
    )

    assert user.ens_domain == "vitalik.eth"


def test_user_model_aggregated_data():
    """Test User model with aggregated data fields"""
    user = User(
        wallet_address="0x1234567890abcdef1234567890abcdef12345678",
        total_purchases=Decimal("100.5"),
        total_sales=Decimal("50.25"),
        strategy_count=5
    )

    assert user.total_purchases == Decimal("100.5")
    assert user.total_sales == Decimal("50.25")
    assert user.strategy_count == 5


def test_user_model_repr_with_status():
    """Test User model __repr__ includes status"""
    user = User(
        id=1,
        wallet_address="0x1234567890abcdef1234567890abcdef12345678",
        role="user",
        status="active"
    )

    repr_str = repr(user)
    assert "User" in repr_str
    assert "1" in repr_str
    assert "0x1234567890abcdef1234567890abcdef12345678" in repr_str
    assert "user" in repr_str
    assert "active" in repr_str


def test_user_model_all_status_properties():
    """Test all status property methods"""
    # Test active user
    active_user = User(
        wallet_address="0x1234567890abcdef1234567890abcdef12345678",
        status="active"
    )
    assert active_user.is_active is True
    assert active_user.is_suspended is False
    assert active_user.is_banned is False

    # Test suspended user
    suspended_user = User(
        wallet_address="0x1234567890abcdef1234567890abcdef12345678",
        status="suspended"
    )
    assert suspended_user.is_active is False
    assert suspended_user.is_suspended is True
    assert suspended_user.is_banned is False

    # Test banned user
    banned_user = User(
        wallet_address="0x1234567890abcdef1234567890abcdef12345678",
        status="banned"
    )
    assert banned_user.is_active is False
    assert banned_user.is_suspended is False
    assert banned_user.is_banned is True
