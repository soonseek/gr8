"""
Backtest API Router

Provides endpoints for running backtests and managing results - MongoDB version
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorDatabase
import asyncio
import uuid

from app.backtest.engine import BacktestEngine
from app.backtest.data_fetcher import DataFetcher
from app.core.database import get_db

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
async def run_backtest(
    request: BacktestRequest,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """
    Run backtest on historical data and optionally save results - MongoDB version
    
    This endpoint:
    1. Fetches historical market data from exchange
    2. Executes strategy on the data
    3. Returns performance metrics
    4. Attempts to save results to MongoDB (optional)
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

        # Try to save results to MongoDB (optional - won't fail if DB unavailable)
        backtest_id = str(uuid.uuid4())
        try:
            backtest_doc = {
                "_id": backtest_id,
                "user_wallet": 'anonymous',
                "strategy_name": request.strategy.get('metadata', {}).get('name', 'Unnamed Strategy'),
                "strategy_data": request.strategy,
                "exchange": request.exchange,
                "symbol": request.symbol,
                "timeframe": request.timeframe,
                "start_date": request.start_date,
                "end_date": request.end_date,
                "initial_capital": request.initial_capital,
                "final_capital": results['final_capital'],
                "total_return": results['total_return'],
                "roi": results['roi'],
                "max_drawdown": results['max_drawdown'],
                "sharpe_ratio": results['sharpe_ratio'],
                "total_trades": results['total_trades'],
                "win_rate": results['win_rate'],
                "profit_factor": results['profit_factor'],
                "trades": results['trades'],
                "equity_curve": results['equity_curve'],
                "execution_time_ms": execution_time,
                "created_at": datetime.utcnow(),
            }

            await db.backtest_results.insert_one(backtest_doc)
        except Exception as db_error:
            # DB save failed, but still return results
            print(f"Warning: Failed to save backtest to MongoDB: {db_error}")

        return BacktestResponse(
            success=True,
            results={**results, 'id': backtest_id},
            execution_time_ms=execution_time,
        )

    except Exception as e:
        return BacktestResponse(
            success=False,
            error=str(e),
        )


@router.get("/history")
async def get_backtest_history(
    db: AsyncIOMotorDatabase = Depends(get_db),
    limit: int = 20,
):
    """
    Get backtest history (all users for now) - MongoDB version
    """
    try:
        cursor = db.backtest_results.find().sort("created_at", -1).limit(limit)
        backtests = await cursor.to_list(length=limit)
        
        return {
            "success": True,
            "backtests": [
                {
                    "id": str(bt["_id"]),
                    "strategy_name": bt.get("strategy_name"),
                    "exchange": bt.get("exchange"),
                    "symbol": bt.get("symbol"),
                    "timeframe": bt.get("timeframe"),
                    "roi": bt.get("roi"),
                    "max_drawdown": bt.get("max_drawdown"),
                    "total_trades": bt.get("total_trades"),
                    "win_rate": bt.get("win_rate"),
                    "created_at": bt.get("created_at").isoformat() if bt.get("created_at") else None,
                }
                for bt in backtests
            ],
        }
    except Exception as e:
        # DB not available, return empty list
        return {
            "success": True,
            "backtests": [],
        }


@router.get("/result/{backtest_id}")
async def get_backtest_result(
    backtest_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """
    Get detailed backtest result by ID - MongoDB version
    """
    try:
        backtest = await db.backtest_results.find_one({"_id": backtest_id})
        
        if not backtest:
            raise HTTPException(status_code=404, detail="Backtest not found")
        
        return {
            "success": True,
            "backtest": {
                "id": str(backtest["_id"]),
                "strategy_name": backtest.get("strategy_name"),
                "strategy_data": backtest.get("strategy_data"),
                "exchange": backtest.get("exchange"),
                "symbol": backtest.get("symbol"),
                "timeframe": backtest.get("timeframe"),
                "initial_capital": backtest.get("initial_capital"),
                "final_capital": backtest.get("final_capital"),
                "total_return": backtest.get("total_return"),
                "roi": backtest.get("roi"),
                "max_drawdown": backtest.get("max_drawdown"),
                "sharpe_ratio": backtest.get("sharpe_ratio"),
                "total_trades": backtest.get("total_trades"),
                "win_rate": backtest.get("win_rate"),
                "profit_factor": backtest.get("profit_factor"),
                "trades": backtest.get("trades"),
                "equity_curve": backtest.get("equity_curve"),
                "execution_time_ms": backtest.get("execution_time_ms"),
                "created_at": backtest.get("created_at").isoformat() if backtest.get("created_at") else None,
            },
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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
