"""
Market Data API Router

Provides endpoints for:
1. Fetching historical OHLCV data from exchanges
2. Querying cached market data from database
3. Triggering manual data synchronization
4. Checking synchronization status
"""

import logging
import uuid
from typing import Optional, Dict
from datetime import datetime
from fastapi import APIRouter, Depends, Query, HTTPException, Header, BackgroundTasks
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db, AsyncSessionLocal
from app.models.user import User
from app.schemas.market_data import (
    MarketDataResponse,
    MarketDataFetchRequest,
    SyncStatusResponse,
    SyncJobResponse,
)
from app.services.market_data_service import (
    MarketDataService,
    MVP_EXCHANGES,
    MVP_SYMBOLS_BASE,
    TIMEFRAMES,
)

# HTTP Bearer security scheme for Swagger UI
security = HTTPBearer(auto_error=False)

logger = logging.getLogger(__name__)

# Global in-memory storage for sync jobs (in production, use Redis or database)
sync_jobs: Dict[str, Dict] = {}

router = APIRouter(prefix="/api/v1/market", tags=["Market Data"])


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: AsyncSession = Depends(get_db),
) -> User:
    """
    Get current authenticated user from JWT token

    Args:
        credentials: HTTP Bearer credentials (auto-injected by FastAPI Security)
        db: Database session

    Returns:
        User object

    Raises:
        HTTPException 401: If token is missing or invalid
        HTTPException 403: If user is banned
    """
    if not credentials:
        raise HTTPException(
            status_code=401,
            detail="Authorization header required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials

    # Verify token
    from app.auth.jwt import verify_token
    wallet_address = verify_token(token)

    if not wallet_address:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Get user from database
    from sqlalchemy import select

    result = await db.execute(
        select(User).where(User.wallet_address == wallet_address)
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Check if user is banned
    if hasattr(user, 'status') and user.status == 'banned':
        raise HTTPException(
            status_code=403,
            detail="차단된 사용자입니다. 문의하기를 통해 문의해주세요."
        )

    return user


async def get_current_admin_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Verify that current user has admin role

    Args:
        current_user: Current authenticated user

    Returns:
        User object

    Raises:
        HTTPException 403: If user is not an admin
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin 권한이 필요합니다"
        )
    return current_user


@router.get("/data", response_model=MarketDataResponse, status_code=200)
async def get_market_data(
    symbol: str = Query(..., description="Trading symbol (e.g., BTCUSDT, BTC-USDT-SWAP)"),
    timeframe: str = Query(..., description="Timeframe (1m, 5m, 15m, 1h, 4h, 1d)"),
    start_date: datetime = Query(..., description="Start date (ISO 8601 format)"),
    end_date: datetime = Query(..., description="End date (ISO 8601 format)"),
    exchange: str = Query("binance", description="Exchange identifier (binance, okx, bybit, gate, bitget)"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get historical OHLCV market data (AC 5 requirement)

    This endpoint implements a smart caching strategy:
    1. First, query database for cached data
    2. If data exists, return immediately (fast response)
    3. If data is missing or incomplete, fetch from exchange via ccxt
    4. Save fetched data to database for future requests

    Args:
        symbol: Trading symbol (exchange-specific format)
        timeframe: Timeframe of candles
        start_date: Start datetime (inclusive)
        end_date: End datetime (exclusive)
        exchange: Exchange identifier (default: binance)
        db: Database session
        current_user: Authenticated user

    Returns:
        MarketDataResponse: List of OHLCV candles with metadata

    Raises:
        HTTPException 400: Invalid parameters
        HTTPException 500: Exchange API error
    """
    # Validate parameters
    if timeframe not in TIMEFRAMES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid timeframe. Must be one of: {TIMEFRAMES}"
        )

    if exchange not in MVP_EXCHANGES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported exchange. Must be one of: {MVP_EXCHANGES}"
        )

    if end_date <= start_date:
        raise HTTPException(
            status_code=400,
            detail="end_date must be after start_date"
        )

    try:
        # Initialize service
        service = MarketDataService(exchange_id=exchange)

        # Step 1: Try to get cached data from database
        cached_data = await service.get_data_from_db(
            symbol=symbol,
            timeframe=timeframe,
            start_date=start_date,
            end_date=end_date,
            db=db
        )

        # Step 2: If we have cached data, return immediately (AC 6 requirement)
        if cached_data and len(cached_data) > 0:
            logger.info(
                f"Returning {len(cached_data)} cached candles "
                f"({exchange}, {symbol}, {timeframe})"
            )
            return MarketDataResponse(
                data=[d.to_dict() for d in cached_data],
                cached=True,
                exchange=exchange,
                symbol=symbol,
                timeframe=timeframe,
                count=len(cached_data)
            )

        # Step 3: No cached data, fetch from exchange
        logger.info(
            f"No cached data found, fetching from {exchange} "
            f"({symbol}, {timeframe}, {start_date} → {end_date})"
        )

        ohlcv_data = await service.fetch_ohlcv(
            symbol=symbol,
            timeframe=timeframe,
            start_date=start_date,
            end_date=end_date
        )

        if not ohlcv_data:
            raise HTTPException(
                status_code=404,
                detail="No data found for the specified parameters"
            )

        # Step 4: Save to database for future requests
        saved_count = await service.save_to_db(
            ohlcv_data=ohlcv_data,
            symbol=symbol,
            timeframe=timeframe,
            db=db
        )

        logger.info(f"Fetched and saved {saved_count} candles from {exchange}")

        return MarketDataResponse(
            data=ohlcv_data,
            cached=False,
            exchange=exchange,
            symbol=symbol,
            timeframe=timeframe,
            count=len(ohlcv_data)
        )

    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error fetching market data: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"거래소 API에서 데이터를 가져오는데 실패했습니다: {str(e)}"
        )


@router.post("/data/fetch", response_model=MarketDataResponse, status_code=200)
async def fetch_and_store_market_data(
    symbol: str = Query(..., description="Trading symbol (e.g., BTCUSDT)"),
    timeframe: str = Query(..., description="Timeframe (1m, 5m, 1h, 1d)"),
    start_date: datetime = Query(..., description="Start date (ISO 8601)"),
    end_date: datetime = Query(..., description="End date (ISO 8601)"),
    exchange: str = Query("binance", description="Exchange identifier"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Force fetch market data from exchange (AC 5 requirement)

    This endpoint bypasses the database cache and fetches fresh data
    from the exchange API. Useful for:
    - Updating stale data
    - Filling specific date ranges
    - Testing exchange connectivity

    Args:
        symbol: Trading symbol
        timeframe: Timeframe
        start_date: Start datetime
        end_date: End datetime
        exchange: Exchange identifier
        db: Database session
        current_user: Authenticated user

    Returns:
        MarketDataResponse: Freshly fetched OHLCV data

    Raises:
        HTTPException 400: Invalid parameters
        HTTPException 500: Exchange API error
    """
    # Validate parameters
    if timeframe not in TIMEFRAMES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid timeframe. Must be one of: {TIMEFRAMES}"
        )

    if exchange not in MVP_EXCHANGES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported exchange. Must be one of: {MVP_EXCHANGES}"
        )

    try:
        service = MarketDataService(exchange_id=exchange)

        # Fetch from exchange (ignore cache)
        ohlcv_data = await service.fetch_ohlcv(
            symbol=symbol,
            timeframe=timeframe,
            start_date=start_date,
            end_date=end_date
        )

        if not ohlcv_data:
            raise HTTPException(
                status_code=404,
                detail="No data found for the specified parameters"
            )

        # Save to database (handles duplicates automatically)
        saved_count = await service.save_to_db(
            ohlcv_data=ohlcv_data,
            symbol=symbol,
            timeframe=timeframe,
            db=db
        )

        logger.info(f"Force fetched {saved_count} candles from {exchange}")

        return MarketDataResponse(
            data=ohlcv_data,
            cached=False,
            exchange=exchange,
            symbol=symbol,
            timeframe=timeframe,
            count=len(ohlcv_data)
        )

    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error force-fetching market data: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"거래소 API에서 데이터를 가져오는데 실패했습니다: {str(e)}"
        )


async def perform_sync_job(
    job_id: str,
    exchange: Optional[str],
    base_symbol: Optional[str],
    timeframe: Optional[str],
    db_session_factory,
) -> None:
    """
    Background task to perform market data synchronization

    Args:
        job_id: Unique job identifier
        exchange: Exchange to sync (None = all exchanges)
        base_symbol: Base symbol to sync (None = all symbols)
        timeframe: Timeframe to sync (None = all timeframes)
        db_session_factory: Database session factory
    """
    from app.core.database import AsyncSessionLocal

    async with AsyncSessionLocal() as db:
        try:
            sync_jobs[job_id]["status"] = "running"

            # Determine scope of sync
            exchanges = [exchange] if exchange else MVP_EXCHANGES
            symbols = [base_symbol] if base_symbol else MVP_SYMBOLS_BASE
            timeframes = [timeframe] if timeframe else TIMEFRAMES

            total = len(exchanges) * len(symbols) * len(timeframes)
            current = 0
            synced = 0
            failed = 0
            gaps_filled = 0

            for exch in exchanges:
                for base in symbols:
                    for tf in timeframes:
                        try:
                            service = MarketDataService(exchange_id=exch)
                            symbol = service.format_symbol(base)

                            # Sync missing data
                            new_candles = await service.sync_missing_data(
                                symbol=symbol,
                                timeframe=tf,
                                db=db
                            )
                            synced += new_candles

                            # Detect and fill gaps
                            filled = await service.detect_and_fill_gaps(
                                symbol=symbol,
                                timeframe=tf,
                                db=db
                            )
                            gaps_filled += filled

                        except Exception as e:
                            logger.error(
                                f"Failed to sync {exch}/{symbol}/{tf}: {e}"
                            )
                            failed += 1

                        current += 1
                        progress = int(current / total * 100)
                        sync_jobs[job_id]["progress"] = progress

            sync_jobs[job_id]["status"] = "completed"
            sync_jobs[job_id]["synced"] = synced
            sync_jobs[job_id]["failed"] = failed
            sync_jobs[job_id]["gaps_filled"] = gaps_filled

            logger.info(
                f"Sync job {job_id} completed: "
                f"{synced} synced, {failed} failed, {gaps_filled} gaps filled"
            )

        except Exception as e:
            logger.error(f"Sync job {job_id} failed: {e}")
            sync_jobs[job_id]["status"] = "failed"
            sync_jobs[job_id]["error"] = str(e)


@router.post("/sync", response_model=SyncJobResponse, status_code=202)
async def sync_market_data(
    background_tasks: BackgroundTasks,
    exchange: Optional[str] = Query(None, description="Exchange (None = all)"),
    base_symbol: Optional[str] = Query(None, description="Base symbol (None = all)"),
    timeframe: Optional[str] = Query(None, description="Timeframe (None = all)"),
    current_user: User = Depends(get_current_admin_user),  # Admin only
):
    """
    Trigger manual market data synchronization (AC 13 requirement)

    This endpoint initiates a background job to:
    1. Sync latest data from last timestamp to now
    2. Detect and fill data gaps
    3. Update all combinations (exchange/symbol/timeframe)

    Admin-only endpoint for operational control.

    Args:
        exchange: Exchange to sync (default: all)
        base_symbol: Base symbol to sync (default: all)
        timeframe: Timeframe to sync (default: all)
        current_user: Authenticated admin user
        background_tasks: FastAPI background tasks

    Returns:
        SyncJobResponse: Job ID for tracking

    Raises:
        HTTPException 403: If user is not admin
        HTTPException 400: Invalid parameters
    """
    # Validate parameters
    if exchange and exchange not in MVP_EXCHANGES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported exchange. Must be one of: {MVP_EXCHANGES}"
        )

    if base_symbol and base_symbol not in MVP_SYMBOLS_BASE:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported symbol. Must be one of: {MVP_SYMBOLS_BASE}"
        )

    if timeframe and timeframe not in TIMEFRAMES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid timeframe. Must be one of: {TIMEFRAMES}"
        )

    # Create unique job ID
    job_id = str(uuid.uuid4())

    # Initialize job status
    sync_jobs[job_id] = {
        "status": "pending",
        "progress": 0,
        "created_at": datetime.utcnow().isoformat(),
    }

    # Add background task
    background_tasks.add_task(
        perform_sync_job,
        job_id,
        exchange,
        base_symbol,
        timeframe,
        AsyncSessionLocal,
    )

    logger.info(f"Sync job {job_id} started by admin {current_user.wallet_address}")

    # Calculate total combinations
    exchanges = [exchange] if exchange else MVP_EXCHANGES
    symbols = [base_symbol] if base_symbol else MVP_SYMBOLS_BASE
    timeframes = [timeframe] if timeframe else TIMEFRAMES
    total = len(exchanges) * len(symbols) * len(timeframes)

    return SyncJobResponse(
        status="syncing",
        job_id=job_id,
        message=f"{total}개 조합 동기화 시작"
    )


@router.get("/sync/status", response_model=SyncStatusResponse, status_code=200)
async def get_sync_status(
    current_user: User = Depends(get_current_user),
):
    """
    Get market data synchronization status (AC 13 requirement)

    Returns the current status of sync operations and statistics
    about the database.

    Args:
        current_user: Authenticated user

    Returns:
        SyncStatusResponse: Current sync status and statistics
    """
    # Count total combinations (MVP scope)
    total_combinations = len(MVP_EXCHANGES) * len(MVP_SYMBOLS_BASE) * len(TIMEFRAMES)

    # Aggregate stats from all sync jobs
    total_synced = 0
    total_failed = 0
    total_gaps_filled = 0
    last_sync = None

    for job_data in sync_jobs.values():
        if job_data["status"] == "completed":
            total_synced += job_data.get("synced", 0)
            total_failed += job_data.get("failed", 0)
            total_gaps_filled += job_data.get("gaps_filled", 0)

        # Track most recent sync
        job_time = job_data.get("created_at")
        if job_time and (not last_sync or job_time > last_sync):
            last_sync = job_time

    # Determine overall status
    if any(job["status"] == "running" for job in sync_jobs.values()):
        status = "syncing"
    else:
        status = "idle"

    return SyncStatusResponse(
        last_sync=last_sync,
        total_combinations=total_combinations,
        synced=total_synced,
        failed=total_failed,
        gaps_filled=total_gaps_filled,
        status=status
    )
