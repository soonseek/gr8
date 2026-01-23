"""
MarketData SQLAlchemy Model

Represents historical OHLCV (Open, High, Low, Close, Volume) market data
collected from cryptocurrency exchanges via ccxt library.
"""

from sqlalchemy import Column, Integer, BigInteger, String, DECIMAL, DateTime, Index
from sqlalchemy.sql import func
from app.core.database import Base


class MarketData(Base):
    """
    Market Data Model

    Stores historical OHLCV candlestick data from cryptocurrency exchanges.
    Each row represents one candle for a specific exchange, symbol, and timeframe.

    Attributes:
        id: Primary key (auto-incrementing)
        exchange: Exchange identifier (e.g., 'binance', 'okx', 'bybit')
        symbol: Trading pair symbol (e.g., 'BTCUSDT', 'ETHUSDT')
        timeframe: Timeframe of the candle (e.g., '1m', '5m', '1h', '1d')
        timestamp: Unix timestamp in milliseconds for the candle
        open: Opening price of the candle
        high: Highest price of the candle
        low: Lowest price of the candle
        close: Closing price of the candle
        volume: Trading volume during the candle period
        created_at: Timestamp when this record was inserted into DB
    """
    __tablename__ = "market_data"

    # Primary Key
    # Use Integer (not BigInteger) for SQLite autoincrement compatibility
    # Integer can store up to 2^31-1 (2.1 billion) which is sufficient for primary keys
    id = Column(Integer, primary_key=True, autoincrement=True)

    # Composite key columns (with individual indexes for flexibility)
    exchange = Column(String(20), nullable=False, index=True)
    symbol = Column(String(20), nullable=False, index=True)
    timeframe = Column(String(10), nullable=False, index=True)
    timestamp = Column(BigInteger, nullable=False, index=True)

    # OHLCV data
    open = Column(DECIMAL(20, 8), nullable=False)
    high = Column(DECIMAL(20, 8), nullable=False)
    low = Column(DECIMAL(20, 8), nullable=False)
    close = Column(DECIMAL(20, 8), nullable=False)
    volume = Column(DECIMAL(30, 8), nullable=False)

    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Table constraints and indexes
    __table_args__ = (
        # Unique constraint to prevent duplicate data
        # Ensures no duplicate candles for the same exchange/symbol/timeframe/timestamp
        Index('uq_market_data_lookup', 'exchange', 'symbol', 'timeframe', 'timestamp', unique=True),

        # Composite index for efficient lookup queries (AC 1 requirement)
        # Optimizes: WHERE exchange = ? AND symbol = ? AND timeframe = ? AND timestamp BETWEEN ? AND ?
        Index('idx_market_data_lookup', 'exchange', 'symbol', 'timeframe', 'timestamp'),

        # Composite index for date range queries (AC 1 requirement)
        # Optimizes: WHERE symbol = ? AND timeframe = ? AND timestamp BETWEEN ? AND ?
        Index('idx_market_data_date_range', 'symbol', 'timeframe', 'timestamp'),
    )

    def __repr__(self) -> str:
        """String representation of MarketData instance"""
        return (
            f"<MarketData("
            f"id={self.id}, "
            f"exchange='{self.exchange}', "
            f"symbol='{self.symbol}', "
            f"timeframe='{self.timeframe}', "
            f"timestamp={self.timestamp}, "
            f"close={float(self.close)}"
            f")>"
        )

    def to_dict(self) -> dict:
        """
        Convert MarketData instance to dictionary

        Returns:
            Dictionary representation of the market data
        """
        return {
            "id": self.id,
            "exchange": self.exchange,
            "symbol": self.symbol,
            "timeframe": self.timeframe,
            "timestamp": self.timestamp,
            "open": float(self.open),
            "high": float(self.high),
            "low": float(self.low),
            "close": float(self.close),
            "volume": float(self.volume),
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
