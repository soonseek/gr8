"""User Pydantic Schemas for Request/Response Validation"""

from pydantic import BaseModel, Field, field_validator, ConfigDict
from typing import Optional
from datetime import datetime
from decimal import Decimal


class UserBase(BaseModel):
    """Base user schema with common fields"""
    wallet_address: str = Field(..., min_length=42, max_length=42, pattern="^0x[a-fA-F0-9]{40}$")
    role: str = Field(default="user")
    status: str = Field(default="active")
    ens_domain: Optional[str] = Field(None, max_length=100)

    @field_validator('role')
    @classmethod
    def role_must_be_valid(cls, v: str) -> str:
        """Validate role is either 'user' or 'admin'"""
        if v not in ['user', 'admin']:
            raise ValueError('role must be either "user" or "admin"')
        return v

    @field_validator('status')
    @classmethod
    def status_must_be_valid(cls, v: str) -> str:
        """Validate status is either 'active', 'suspended', or 'banned'"""
        if v not in ['active', 'suspended', 'banned']:
            raise ValueError('status must be either "active", "suspended", or "banned"')
        return v


class UserCreate(UserBase):
    """Schema for creating a new user"""
    pass


class UserResponse(UserBase):
    """Schema for user response with all fields"""
    id: int
    suspension_reason: Optional[str] = None
    suspended_at: Optional[datetime] = None
    banned_at: Optional[datetime] = None
    total_purchases: Decimal
    total_sales: Decimal
    strategy_count: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserRoleUpdate(BaseModel):
    """Schema for updating user role"""
    role: str = Field(..., pattern="^(user|admin)$")


class UserStatusUpdate(BaseModel):
    """Schema for updating user status"""
    status: str = Field(..., pattern="^(active|suspended|banned)$")
    suspension_reason: Optional[str] = Field(None, max_length=1000)
