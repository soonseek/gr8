"""Revenue Transaction SQLAlchemy Model - Stub for User Management (Story 8-2)"""

from sqlalchemy import Column, String, DateTime, Integer, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base


class RevenueTransaction(Base):
    """Stub Revenue Transaction model for User Management (Story 8-2)

    Note: This is a minimal stub table. Epic 6 will expand this model with:
    - transaction_type (sale, withdrawal, partner_reward)
    - transaction status tracking
    - More complex revenue distribution logic
    """

    __tablename__ = "revenue_transactions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    strategy_id = Column(String(50), ForeignKey("strategies.id"), nullable=True)
    creator_address = Column(String(50), ForeignKey("users.wallet_address", ondelete="RESTRICT"), nullable=False)
    buyer_address = Column(String(50), ForeignKey("users.wallet_address", ondelete="RESTRICT"), nullable=False)
    amount = Column(Numeric(20, 8), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=True)

    # Relationships
    strategy = relationship("Strategy", foreign_keys=[strategy_id])
    creator = relationship("User", foreign_keys=[creator_address], backref="sales")
    buyer = relationship("User", foreign_keys=[buyer_address], backref="purchases")

    def __repr__(self):
        return f"<RevenueTransaction(id={self.id}, amount={self.amount}, buyer={self.buyer_address})>"
