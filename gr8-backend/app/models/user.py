"""User SQLAlchemy Model"""

from sqlalchemy import Column, Integer, String, DateTime, Text, Numeric
from sqlalchemy.orm import validates
from datetime import datetime
from app.core.database import Base


class User(Base):
    """User model for authentication and authorization"""

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    wallet_address = Column(String(42), unique=True, nullable=False, index=True)
    role = Column(String(20), server_default="user", default="user", nullable=False, index=True)

    # Status management
    status = Column(String(20), server_default="active", default="active", nullable=False, index=True)
    ens_domain = Column(String(100), nullable=True)
    suspension_reason = Column(Text, nullable=True)
    suspended_at = Column(DateTime, nullable=True)
    banned_at = Column(DateTime, nullable=True)

    # Aggregated data
    total_purchases = Column(Numeric(20, 8), server_default="0", default=0, nullable=False)
    total_sales = Column(Numeric(20, 8), server_default="0", default=0, nullable=False)
    strategy_count = Column(Integer, server_default="0", default=0, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=True, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=True, index=True)

    @validates('role')
    def validate_role(self, key, value):
        """Validate that role is either 'user' or 'admin'"""
        if value not in ['user', 'admin']:
            raise ValueError(f"role must be either 'user' or 'admin', got '{value}'")
        return value

    @validates('status')
    def validate_status(self, key, value):
        """Validate that status is either 'active', 'suspended', or 'banned'"""
        if value not in ['active', 'suspended', 'banned']:
            raise ValueError(f"status must be 'active', 'suspended', or 'banned', got '{value}'")
        return value

    def __repr__(self):
        return f"<User(id={self.id}, wallet_address={self.wallet_address}, role={self.role}, status={self.status})>"

    @property
    def is_admin(self) -> bool:
        """Check if user is admin"""
        return self.role == "admin"

    @property
    def is_active(self) -> bool:
        """Check if user is active"""
        return self.status == "active"

    @property
    def is_suspended(self) -> bool:
        """Check if user is suspended"""
        return self.status == "suspended"

    @property
    def is_banned(self) -> bool:
        """Check if user is banned"""
        return self.status == "banned"
