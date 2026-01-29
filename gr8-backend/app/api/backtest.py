"""
Backtest API Router

Provides endpoints for running backtests and managing results
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
import asyncio
import uuid

from app.backtest.engine import BacktestEngine
from app.backtest.data_fetcher import DataFetcher
from app.core.database import get_db
from app.models.backtest import BacktestResult
from app.auth.jwt_auth import get_current_user

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
    db: AsyncSession = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """
    Run backtest on historical data and save results
    
    This endpoint:
    1. Fetches historical market data from exchange
    2. Executes strategy on the data
    3. Returns performance metrics
    4. Saves results to database
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

        # Save results to database
        backtest_id = str(uuid.uuid4())
        backtest_result = BacktestResult(
            id=backtest_id,
            user_wallet=current_user.get('wallet_address', 'anonymous'),
            strategy_name=request.strategy.get('metadata', {}).get('name', 'Unnamed Strategy'),
            strategy_data=request.strategy,
            exchange=request.exchange,
            symbol=request.symbol,
            timeframe=request.timeframe,
            start_date=request.start_date,
            end_date=request.end_date,
            initial_capital=request.initial_capital,
            final_capital=results['final_capital'],
            total_return=results['total_return'],
            roi=results['roi'],
            max_drawdown=results['max_drawdown'],
            sharpe_ratio=results['sharpe_ratio'],
            total_trades=results['total_trades'],
            win_rate=results['win_rate'],
            profit_factor=results['profit_factor'],
            trades=results['trades'],
            equity_curve=results['equity_curve'],
            execution_time_ms=execution_time,
        )

        db.add(backtest_result)
        await db.commit()
        await db.refresh(backtest_result)

        return BacktestResponse(
            success=True,
            results={**results, 'id': backtest_id},
            execution_time_ms=execution_time,
        )

    except Exception as e:


@router.get("/history")
async def get_backtest_history(
    db: AsyncSession = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
    limit: int = 20,
):
    """
    Get user's backtest history
    """
    from sqlalchemy import select, desc
    
    try:
        wallet_address = current_user.get('wallet_address', 'anonymous')
        
        query = select(BacktestResult).where(
            BacktestResult.user_wallet == wallet_address
        ).order_by(desc(BacktestResult.created_at)).limit(limit)
        
        result = await db.execute(query)
        backtests = result.scalars().all()
        
        return {
            "success": True,
            "backtests": [
                {
                    "id": bt.id,
                    "strategy_name": bt.strategy_name,
                    "exchange": bt.exchange,
                    "symbol": bt.symbol,
                    "timeframe": bt.timeframe,
                    "roi": bt.roi,
                    "max_drawdown": bt.max_drawdown,
                    "total_trades": bt.total_trades,
                    "win_rate": bt.win_rate,
                    "created_at": bt.created_at.isoformat() if bt.created_at else None,
                }
                for bt in backtests
            ],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/result/{backtest_id}")
async def get_backtest_result(
    backtest_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """
    Get detailed backtest result by ID
    """
    from sqlalchemy import select
    
    try:
        query = select(BacktestResult).where(BacktestResult.id == backtest_id)
        result = await db.execute(query)
        backtest = result.scalar_one_or_none()
        
        if not backtest:
            raise HTTPException(status_code=404, detail="Backtest not found")
        
        # Check ownership
        if backtest.user_wallet != current_user.get('wallet_address', 'anonymous'):
            raise HTTPException(status_code=403, detail="Not authorized")
        
        return {
            "success": True,
            "backtest": {
                "id": backtest.id,
                "strategy_name": backtest.strategy_name,
                "strategy_data": backtest.strategy_data,
                "exchange": backtest.exchange,
                "symbol": backtest.symbol,
                "timeframe": backtest.timeframe,
                "initial_capital": backtest.initial_capital,
                "final_capital": backtest.final_capital,
                "total_return": backtest.total_return,
                "roi": backtest.roi,
                "max_drawdown": backtest.max_drawdown,
                "sharpe_ratio": backtest.sharpe_ratio,
                "total_trades": backtest.total_trades,
                "win_rate": backtest.win_rate,
                "profit_factor": backtest.profit_factor,
                "trades": backtest.trades,
                "equity_curve": backtest.equity_curve,
                "execution_time_ms": backtest.execution_time_ms,
                "created_at": backtest.created_at.isoformat() if backtest.created_at else None,
            },
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

        await db.rollback()
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
