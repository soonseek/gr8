"""Unit tests for stub models (Strategy and RevenueTransaction) - Story 8-2-db-2"""

import pytest
from datetime import datetime
from decimal import Decimal
from app.models.strategy import Strategy
from app.models.revenue_transaction import RevenueTransaction


def test_strategy_model_creation():
    """Test Strategy model creation with valid data"""
    strategy = Strategy(
        id="strategy_001",
        creator_address="0x1234567890abcdef1234567890abcdef12345678",
        name="Test Strategy",
        description="A test trading strategy",
        is_published=False
    )

    assert strategy.id == "strategy_001"
    assert strategy.creator_address == "0x1234567890abcdef1234567890abcdef12345678"
    assert strategy.name == "Test Strategy"
    assert strategy.description == "A test trading strategy"
    assert strategy.is_published is False


def test_strategy_model_repr():
    """Test Strategy model __repr__ method"""
    strategy = Strategy(
        id="strategy_001",
        creator_address="0x1234567890abcdef1234567890abcdef12345678",
        name="Test Strategy"
    )

    repr_str = repr(strategy)
    assert "Strategy" in repr_str
    assert "strategy_001" in repr_str
    assert "Test Strategy" in repr_str
    assert "0x1234567890abcdef1234567890abcdef12345678" in repr_str


def test_strategy_model_default_values():
    """Test Strategy model with default values"""
    strategy = Strategy(
        id="strategy_002",
        creator_address="0x1234567890abcdef1234567890abcdef12345678",
        is_published=False  # Explicitly set for Python object
    )

    assert strategy.name is None
    assert strategy.description is None
    assert strategy.is_published is False


def test_revenue_transaction_model_creation():
    """Test RevenueTransaction model creation with valid data"""
    transaction = RevenueTransaction(
        id=1,
        strategy_id="strategy_001",
        creator_address="0x1234567890abcdef1234567890abcdef12345678",
        buyer_address="0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
        amount=Decimal("100.5")
    )

    assert transaction.id == 1
    assert transaction.strategy_id == "strategy_001"
    assert transaction.creator_address == "0x1234567890abcdef1234567890abcdef12345678"
    assert transaction.buyer_address == "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd"
    assert transaction.amount == Decimal("100.5")


def test_revenue_transaction_model_repr():
    """Test RevenueTransaction model __repr__ method"""
    transaction = RevenueTransaction(
        id=1,
        creator_address="0x1234567890abcdef1234567890abcdef12345678",
        buyer_address="0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
        amount=Decimal("50.25")
    )

    repr_str = repr(transaction)
    assert "RevenueTransaction" in repr_str
    assert "1" in repr_str
    assert "50.25" in repr_str
    assert "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd" in repr_str


def test_revenue_transaction_model_nullable_strategy_id():
    """Test RevenueTransaction model with nullable strategy_id"""
    transaction = RevenueTransaction(
        id=2,
        strategy_id=None,  # Can be None for non-strategy transactions
        creator_address="0x1234567890abcdef1234567890abcdef12345678",
        buyer_address="0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
        amount=Decimal("25.0")
    )

    assert transaction.id == 2
    assert transaction.strategy_id is None
    assert transaction.amount == Decimal("25.0")


def test_revenue_transaction_model_precision():
    """Test RevenueTransaction amount precision (20, 8)"""
    # Test small amount
    transaction1 = RevenueTransaction(
        id=3,
        creator_address="0x1234567890abcdef1234567890abcdef12345678",
        buyer_address="0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
        amount=Decimal("0.00000001")
    )
    assert transaction1.amount == Decimal("0.00000001")

    # Test large amount
    transaction2 = RevenueTransaction(
        id=4,
        creator_address="0x1234567890abcdef1234567890abcdef12345678",
        buyer_address="0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
        amount=Decimal("99999999.99999999")
    )
    assert transaction2.amount == Decimal("99999999.99999999")
