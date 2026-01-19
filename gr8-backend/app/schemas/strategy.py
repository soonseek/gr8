"""Strategy and Revenue Transaction Pydantic Schemas - Stub for User Management (Story 8-2)"""

from pydantic import BaseModel, ConfigDict
from datetime import datetime
from decimal import Decimal
from typing import Optional


# Strategy Schemas
class StrategyBase(BaseModel):
    """Base strategy schema with common fields"""
    id: str
    creator_address: str
    name: Optional[str] = None
    description: Optional[str] = None
    is_published: bool = False


class StrategyResponse(StrategyBase):
    """Schema for strategy response"""
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Revenue Transaction Schemas
class RevenueTransactionBase(BaseModel):
    """Base revenue transaction schema with common fields"""
    strategy_id: Optional[str] = None
    creator_address: str
    buyer_address: str
    amount: Decimal


class RevenueTransactionResponse(RevenueTransactionBase):
    """Schema for revenue transaction response"""
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
