"""Strategy SQLAlchemy Model - Stub for User Management (Story 8-2)"""

from sqlalchemy import Column, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base


class Strategy(Base):
    """Stub Strategy model for User Management (Story 8-2)

    Note: This is a minimal stub table. Epic 5 will expand this model with:
    - strategy_json (nodes/edges configuration)
    - backtest results
    - pricing and purchase tracking
    - versioning
    """

    __tablename__ = "strategies"

    id = Column(String(50), primary_key=True)
    creator_address = Column(String(50), ForeignKey("users.wallet_address", ondelete="RESTRICT"), nullable=False)
    name = Column(String(200), nullable=True)
    description = Column(Text, nullable=True)
    is_published = Column(Boolean, server_default="false", default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=True)

    # Relationships
    creator = relationship("User", foreign_keys=[creator_address], backref="strategies")

    def __repr__(self):
        return f"<Strategy(id={self.id}, name={self.name}, creator={self.creator_address})>"
