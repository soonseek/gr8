"""Unit tests for stub schemas (Strategy and RevenueTransaction) - Story 8-2-db-2"""

import pytest
from datetime import datetime
from decimal import Decimal
from app.schemas.strategy import StrategyResponse, RevenueTransactionResponse


def test_strategy_response_schema():
    """Test StrategyResponse schema with valid data"""
    strategy_data = {
        "id": "strategy_001",
        "creator_address": "0x1234567890abcdef1234567890abcdef12345678",
        "name": "Test Strategy",
        "description": "A test trading strategy",
        "is_published": False,
        "created_at": datetime(2026, 1, 19, 10, 0, 0)
    }
    strategy = StrategyResponse(**strategy_data)

    assert strategy.id == "strategy_001"
    assert strategy.creator_address == "0x1234567890abcdef1234567890abcdef12345678"
    assert strategy.name == "Test Strategy"
    assert strategy.description == "A test trading strategy"
    assert strategy.is_published is False
    assert strategy.created_at == datetime(2026, 1, 19, 10, 0, 0)


def test_strategy_response_schema_optional_fields():
    """Test StrategyResponse schema with optional fields as None"""
    strategy_data = {
        "id": "strategy_002",
        "creator_address": "0x1234567890abcdef1234567890abcdef12345678",
        "name": None,
        "description": None,
        "is_published": True,
        "created_at": datetime(2026, 1, 19, 10, 0, 0)
    }
    strategy = StrategyResponse(**strategy_data)

    assert strategy.id == "strategy_002"
    assert strategy.name is None
    assert strategy.description is None
    assert strategy.is_published is True


def test_revenue_transaction_response_schema():
    """Test RevenueTransactionResponse schema with valid data"""
    transaction_data = {
        "id": 1,
        "strategy_id": "strategy_001",
        "creator_address": "0x1234567890abcdef1234567890abcdef12345678",
        "buyer_address": "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
        "amount": Decimal("100.5"),
        "created_at": datetime(2026, 1, 19, 10, 0, 0)
    }
    transaction = RevenueTransactionResponse(**transaction_data)

    assert transaction.id == 1
    assert transaction.strategy_id == "strategy_001"
    assert transaction.creator_address == "0x1234567890abcdef1234567890abcdef12345678"
    assert transaction.buyer_address == "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd"
    assert transaction.amount == Decimal("100.5")
    assert transaction.created_at == datetime(2026, 1, 19, 10, 0, 0)


def test_revenue_transaction_response_schema_nullable_strategy_id():
    """Test RevenueTransactionResponse schema with nullable strategy_id"""
    transaction_data = {
        "id": 2,
        "strategy_id": None,
        "creator_address": "0x1234567890abcdef1234567890abcdef12345678",
        "buyer_address": "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
        "amount": Decimal("50.25"),
        "created_at": datetime(2026, 1, 19, 10, 0, 0)
    }
    transaction = RevenueTransactionResponse(**transaction_data)

    assert transaction.id == 2
    assert transaction.strategy_id is None
    assert transaction.amount == Decimal("50.25")


def test_revenue_transaction_response_schema_precision():
    """Test RevenueTransactionResponse schema amount precision"""
    # Test small amount
    transaction_data_small = {
        "id": 3,
        "strategy_id": None,
        "creator_address": "0x1234567890abcdef1234567890abcdef12345678",
        "buyer_address": "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
        "amount": Decimal("0.00000001"),
        "created_at": datetime(2026, 1, 19, 10, 0, 0)
    }
    transaction_small = RevenueTransactionResponse(**transaction_data_small)
    assert transaction_small.amount == Decimal("0.00000001")

    # Test large amount
    transaction_data_large = {
        "id": 4,
        "strategy_id": None,
        "creator_address": "0x1234567890abcdef1234567890abcdef12345678",
        "buyer_address": "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
        "amount": Decimal("99999999.99999999"),
        "created_at": datetime(2026, 1, 19, 10, 0, 0)
    }
    transaction_large = RevenueTransactionResponse(**transaction_data_large)
    assert transaction_large.amount == Decimal("99999999.99999999")
