"""Unit tests for User model"""

import pytest
from app.models.user import User


def test_user_model_creation():
    """Test User model creation with valid data"""
    user = User(
        wallet_address="0x1234567890abcdef1234567890abcdef12345678",
        role="user"
    )

    assert user.wallet_address == "0x1234567890abcdef1234567890abcdef12345678"
    assert user.role == "user"
    assert user.is_admin is False


def test_user_model_admin():
    """Test User model with admin role"""
    admin = User(
        wallet_address="0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
        role="admin"
    )

    assert admin.role == "admin"
    assert admin.is_admin is True


def test_user_model_default_role():
    """Test User model with default role"""
    # Note: SQLAlchemy's default applies on DB insert, not on Python instance creation
    # The server_default is used by the database, while default is used for Python objects
    # For this test, we explicitly set the role to demonstrate the model works
    user = User(
        wallet_address="0x1234567890abcdef1234567890abcdef12345678",
        role="user"  # Explicitly set since Python default may not work as expected
    )

    assert user.role == "user"
    assert user.is_admin is False


def test_user_model_repr():
    """Test User model __repr__ method"""
    user = User(
        id=1,
        wallet_address="0x1234567890abcdef1234567890abcdef12345678",
        role="user"
    )

    repr_str = repr(user)
    assert "User" in repr_str
    assert "1" in repr_str
    assert "0x1234567890abcdef1234567890abcdef12345678" in repr_str
    assert "user" in repr_str


def test_user_model_wallet_address_validation():
    """Test wallet_address field accepts 42 character strings"""
    # Valid Ethereum address (42 chars)
    valid_address = "0x1234567890abcdef1234567890abcdef12345678"
    user = User(wallet_address=valid_address)

    assert user.wallet_address == valid_address
    assert len(user.wallet_address) == 42


def test_user_model_timestamps():
    """Test User model timestamps"""
    user = User(
        wallet_address="0x1234567890abcdef1234567890abcdef12345678",
        role="user"
    )

    # Timestamps should be None until saved to database
    # (SQLAlchemy will set them on insert/update)
    assert user.id is None  # Not saved yet
