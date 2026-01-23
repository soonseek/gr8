"""
SyncStatus SQLAlchemy Model

Tracks the status of market data synchronization jobs.
Monitors last sync timestamps, status, and gap filling operations.
"""

from sqlalchemy import Column, BigInteger, String, DateTime, Integer
from sqlalchemy.sql import func
from app.core.database import Base


class SyncStatus(Base):
    """
    Sync Status Model

    Tracks the synchronization status for each exchange/symbol/timeframe combination.
    Records when data was last synced and whether any gaps were filled.

    Attributes:
        id: Primary key (auto-incrementing)
        exchange: Exchange identifier (e.g., 'binance', 'okx', 'bybit')
        symbol: Trading pair symbol (e.g., 'BTCUSDT', 'ETHUSDT')
        timeframe: Timeframe of the data (e.g., '1m', '5m', '1h', '1d')
        last_sync_timestamp: Last market data timestamp that was synced (milliseconds)
        last_sync_at: When this sync was performed (database server time)
        status: Current sync status (syncing, completed, failed)
        gaps_filled: Number of data gaps filled during last sync
        created_at: When this record was first created
        updated_at: When this record was last updated
    """
    __tablename__ = "sync_status"

    # Primary Key
    id = Column(BigInteger, primary_key=True, autoincrement=True)

    # Composite key columns
    exchange = Column(String(20), nullable=False, index=True)
    symbol = Column(String(20), nullable=False, index=True)
    timeframe = Column(String(10), nullable=False, index=True)

    # Sync tracking
    last_sync_timestamp = Column(BigInteger, nullable=False, index=True)  # Last synced data timestamp (ms)
    last_sync_at = Column(DateTime(timezone=True), server_default=func.now())  # When sync was performed

    # Status
    status = Column(String(20), nullable=False, default="completed")  # syncing, completed, failed
    gaps_filled = Column(Integer, default=0, nullable=False)  # Number of gaps filled

    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Unique constraint: one status record per exchange/symbol/timeframe combination
    __table_args__ = (
        # Uncomment to enforce single status record per combination
        # Index('uq_sync_status_combination', 'exchange', 'symbol', 'timeframe', unique=True),
    )

    def __repr__(self) -> str:
        """String representation of SyncStatus instance"""
        return (
            f"<SyncStatus("
            f"id={self.id}, "
            f"exchange='{self.exchange}', "
            f"symbol='{self.symbol}', "
            f"timeframe='{self.timeframe}', "
            f"status='{self.status}', "
            f"last_sync_timestamp={self.last_sync_timestamp}"
            f")>"
        )

    def to_dict(self) -> dict:
        """
        Convert SyncStatus instance to dictionary

        Returns:
            Dictionary representation of the sync status
        """
        return {
            "id": self.id,
            "exchange": self.exchange,
            "symbol": self.symbol,
            "timeframe": self.timeframe,
            "last_sync_timestamp": self.last_sync_timestamp,
            "last_sync_at": self.last_sync_at.isoformat() if self.last_sync_at else None,
            "status": self.status,
            "gaps_filled": self.gaps_filled,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
