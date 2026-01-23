"""
Pydantic Schemas for Market Data API

Defines request/response models for market data endpoints
"""

from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import List, Optional


class MarketDataBase(BaseModel):
    """
    Base schema for market data (OHLCV candle)

    Represents a single candlestick with open, high, low, close, and volume data
    """
    exchange: str = Field(..., description="Exchange identifier (e.g., 'binance', 'okx', 'bybit')")
    symbol: str = Field(..., description="Trading pair symbol (e.g., 'BTCUSDT', 'ETHUSDT')")
    timeframe: str = Field(..., description="Timeframe (e.g., '1m', '5m', '1h', '1d')")
    timestamp: int = Field(..., description="Unix timestamp in milliseconds", ge=0)
    open: float = Field(..., description="Opening price", gt=0)
    high: float = Field(..., description="Highest price", gt=0)
    low: float = Field(..., description="Lowest price", gt=0)
    close: float = Field(..., description="Closing price", gt=0)
    volume: float = Field(..., description="Trading volume", ge=0)

    @field_validator('high')
    @classmethod
    def high_must_be_gte_low(cls, v: float, info) -> float:
        """Validate that high price is >= low price"""
        if 'low' in info.data and v < info.data['low']:
            raise ValueError('high must be greater than or equal to low')
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "exchange": "binance",
                "symbol": "BTCUSDT",
                "timeframe": "1h",
                "timestamp": 1640995200000,
                "open": 47000.50,
                "high": 47500.00,
                "low": 46800.00,
                "close": 47200.00,
                "volume": 1234.56
            }
        }


class MarketDataResponse(BaseModel):
    """
    Response schema for market data API

    Returns a list of OHLCV candles along with metadata
    """
    data: List[MarketDataBase] = Field(..., description="List of OHLCV candles")
    cached: bool = Field(..., description="Whether data was retrieved from database cache")
    exchange: str = Field(..., description="Exchange identifier")
    symbol: str = Field(..., description="Trading pair symbol")
    timeframe: str = Field(..., description="Timeframe")
    count: int = Field(..., description="Number of candles returned", ge=0)

    class Config:
        json_schema_extra = {
            "example": {
                "data": [
                    {
                        "exchange": "binance",
                        "symbol": "BTCUSDT",
                        "timeframe": "1h",
                        "timestamp": 1640995200000,
                        "open": 47000.50,
                        "high": 47500.00,
                        "low": 46800.00,
                        "close": 47200.00,
                        "volume": 1234.56
                    }
                ],
                "cached": True,
                "exchange": "binance",
                "symbol": "BTCUSDT",
                "timeframe": "1h",
                "count": 1
            }
        }


class MarketDataFetchRequest(BaseModel):
    """
    Request schema for fetching market data

    Used when forcing a fresh data fetch from exchange API
    """
    symbol: str = Field(..., description="Trading pair symbol (e.g., 'BTCUSDT')")
    timeframe: str = Field(..., description="Timeframe (1m, 5m, 15m, 1h, 4h, 1d)")
    start_date: datetime = Field(..., description="Start date (ISO 8601 format)")
    end_date: datetime = Field(..., description="End date (ISO 8601 format)")
    exchange: str = Field(default="binance", description="Exchange identifier")

    @field_validator('timeframe')
    @classmethod
    def validate_timeframe(cls, v: str) -> str:
        """Validate that timeframe is supported"""
        valid_timeframes = ['1m', '5m', '15m', '1h', '4h', '1d']
        if v not in valid_timeframes:
            raise ValueError(f'timeframe must be one of {valid_timeframes}')
        return v

    @field_validator('end_date')
    @classmethod
    def end_date_after_start_date(cls, v: datetime, info) -> datetime:
        """Validate that end_date is after start_date"""
        if 'start_date' in info.data and v <= info.data['start_date']:
            raise ValueError('end_date must be after start_date')
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "symbol": "BTCUSDT",
                "timeframe": "1h",
                "start_date": "2024-01-01T00:00:00Z",
                "end_date": "2024-01-31T23:59:59Z",
                "exchange": "binance"
            }
        }


class SyncStatusResponse(BaseModel):
    """
    Response schema for market data synchronization status

    Returns the current status of background sync jobs
    """
    last_sync: Optional[str] = Field(None, description="Last successful sync timestamp (ISO 8601)")
    total_combinations: int = Field(..., description="Total number of exchange/symbol/timeframe combinations")
    synced: int = Field(..., description="Number of successfully synced combinations", ge=0)
    failed: int = Field(..., description="Number of failed combinations", ge=0)
    gaps_filled: int = Field(..., description="Number of data gaps filled", ge=0)
    status: str = Field(..., description="Current sync status (idle, syncing, completed)")

    class Config:
        json_schema_extra = {
            "example": {
                "last_sync": "2024-01-20T10:00:00Z",
                "total_combinations": 150,
                "synced": 120,
                "failed": 5,
                "gaps_filled": 10,
                "status": "syncing"
            }
        }


class SyncJobResponse(BaseModel):
    """
    Response schema for triggering a sync job

    Returns job ID for tracking the sync operation
    """
    status: str = Field(..., description="Job status (syncing, pending)")
    job_id: str = Field(..., description="Unique job identifier for tracking")
    message: str = Field(..., description="Human-readable status message")

    class Config:
        json_schema_extra = {
            "example": {
                "status": "syncing",
                "job_id": "550e8400-e29b-41d4-a716-446655440000",
                "message": "25개 조합 동기화 시작"
            }
        }
