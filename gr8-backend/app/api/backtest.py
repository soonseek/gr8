"""
Backtest API Router

Provides endpoints for running backtests
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import asyncio

from app.backtest.engine import BacktestEngine
from app.backtest.data_fetcher import DataFetcher

router = APIRouter(prefix="/api/backtest", tags=["backtest"])

# Initialize services
data_fetcher = DataFetcher()


class BacktestRequest(BaseModel):
    """Request model for backtest execution"""
    strategy: Dict[str, Any] = Field(..., description="Strategy configuration (nodes + edges)")
    exchange: str = Field(default="binance", description="Exchange name")
    symbol: str = Field(default="BTC", description="Trading symbol")
    timeframe: str = Field(default="1h", description="Candle timeframe")
    start_date: Optional[str] = Field(default=None, description="Start date (ISO format)")
    end_date: Optional[str] = Field(default=None, description="End date (ISO format)")
    initial_capital: float = Field(default=10000.0, description="Initial capital in USDT")
    limit: int = Field(default=500, description="Number of candles to fetch")


class BacktestResponse(BaseModel):
    """Response model for backtest results"""
    success: bool
    results: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    execution_time_ms: Optional[int] = None


@router.post("/run", response_model=BacktestResponse)
async def run_backtest(request: BacktestRequest):
    """
    Run backtest on historical data
    
    This endpoint:
    1. Fetches historical market data from exchange
    2. Executes strategy on the data
    3. Returns performance metrics
    """
    start_time = datetime.now()
    
    try:
        # Fetch market data
        market_data = await data_fetcher.fetch_ohlcv(
            exchange=request.exchange,
            symbol=request.symbol,
            timeframe=request.timeframe,
            start_date=request.start_date,
            end_date=request.end_date,
            limit=request.limit,
        )

        if market_data.empty:
            raise HTTPException(status_code=400, detail="No market data available")

        # Run backtest
        engine = BacktestEngine(initial_capital=request.initial_capital)
        results = engine.execute(request.strategy, market_data)

        # Calculate execution time
        execution_time = int((datetime.now() - start_time).total_seconds() * 1000)

        return BacktestResponse(
            success=True,
            results=results,
            execution_time_ms=execution_time,
        )

    except Exception as e:
        return BacktestResponse(
            success=False,
            error=str(e),
        )


@router.get("/market-data/{exchange}/{symbol}")
async def get_market_data(
    exchange: str,
    symbol: str,
    timeframe: str = "1h",
    limit: int = 100,
):
    """
    Get latest market data for preview
    """
    try:
        market_data = await data_fetcher.fetch_ohlcv(
            exchange=exchange,
            symbol=symbol,
            timeframe=timeframe,
            limit=limit,
        )

        return {
            "success": True,
            "data": market_data.to_dict(orient='records'),
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/exchanges")
async def list_exchanges():
    """
    List supported exchanges
    """
    return {
        "exchanges": ["binance", "okx", "bybit", "gate", "bitget"],
    }
