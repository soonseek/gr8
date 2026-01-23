"""
APScheduler Configuration for Market Data Sync

This module configures and manages the APScheduler for automatic market data synchronization.
- Syncs latest market data every hour
- Detects and fills data gaps
- Manages scheduler lifecycle (start/shutdown)
"""

import logging
from contextlib import asynccontextmanager
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import AsyncSessionLocal
from app.services.market_data_service import (
    MarketDataService,
    MVP_EXCHANGES,
    MVP_SYMBOLS_BASE,
    TIMEFRAMES,
    HISTORICAL_DATA_YEARS,
)

logger = logging.getLogger(__name__)

# Global scheduler instance
scheduler = AsyncIOScheduler()


async def sync_latest_market_data():
    """
    Scheduled job: Sync latest market data for all MVP combinations

    This APScheduler job runs every hour (cron: minute=0) and:

    1. Iterates through all MVP combinations (exchange × symbol × timeframe)
    2. For each combination:
       a. Gets the last timestamp from database
       b. If data exists:
          - Detects and fills gaps
          - Syncs latest data (last timestamp → now)
       c. If no data exists:
          - Fetches ALL historical data (HISTORICAL_DATA_YEARS back)
    3. Tracks progress (synced, failed, gaps_filled)
    4. Logs summary on completion

    MVP Scope:
    - Exchanges (5): Binance, OKX, Bybit, Gate.io, Bitget
    - Symbols (5): BTC, ETH, SOL, XRP, DOGE (perpetual futures)
    - Timeframes (6): 1m, 5m, 15m, 1h, 4h, 1d
    - Total: 5 × 5 × 6 = 150 data streams

    Returns:
        None (logs results to console)

    Examples:
        Triggered automatically by APScheduler every hour:
        >>> sync_latest_market_data()
        # Logs: "Scheduled sync completed: 145/150 synced, 3 failed, 10 gaps filled"

    Note:
        - Runs in background as async job
        - Continues on individual failures (logs errors, increments failed counter)
        - Uses HISTORICAL_DATA_YEARS (2) for initial data fetch
        - Each combination processed sequentially (not parallel) to respect rate limits

    See Also:
        - MarketDataService.sync_missing_data: Core sync logic
        - MarketDataService.detect_and_fill_gaps: Gap detection/filling
    """
    logger.info("Starting scheduled market data sync")

    total_combinations = len(MVP_EXCHANGES) * len(MVP_SYMBOLS_BASE) * len(TIMEFRAMES)
    current = 0
    synced = 0
    failed = 0
    gaps_filled = 0

    try:
        async with AsyncSessionLocal() as db:
            for exchange_id in MVP_EXCHANGES:
                for symbol_base in MVP_SYMBOLS_BASE:
                    for timeframe in TIMEFRAMES:
                        current += 1

                        try:
                            # Create service for this exchange
                            service = MarketDataService(exchange_id=exchange_id)

                            # Get symbol format for this exchange
                            from app.services.market_data_service import EXCHANGE_FUTURES_CONFIG
                            symbol = EXCHANGE_FUTURES_CONFIG[exchange_id]["symbol_format"].format(base=symbol_base)

                            # Get last timestamp from database
                            last_ts = await service.get_last_timestamp(
                                exchange=exchange_id,
                                symbol=symbol,
                                timeframe=timeframe,
                                db=db
                            )

                            if last_ts:
                                # Data exists - detect and fill gaps, then sync latest
                                from datetime import datetime, timedelta
                                now = datetime.utcnow()
                                last_date = datetime.fromtimestamp(last_ts / 1000)

                                # 1. Detect and fill gaps first
                                gaps_filled_count = await service.detect_and_fill_gaps(
                                    exchange=exchange_id,
                                    symbol=symbol,
                                    timeframe=timeframe,
                                    db=db
                                )

                                if gaps_filled_count > 0:
                                    gaps_filled += gaps_filled_count
                                    logger.info(
                                        f"Filled {gaps_filled_count} gaps for {exchange_id}/{symbol}/{timeframe}"
                                    )

                                # 2. Sync latest data if behind
                                if now > last_date:
                                    ohlcv_data = await service.fetch_ohlcv(
                                        symbol=symbol,
                                        timeframe=timeframe,
                                        start_date=last_date,
                                        end_date=now
                                    )

                                    if ohlcv_data:
                                        saved = await service.save_to_db(
                                            ohlcv_data=ohlcv_data,
                                            exchange=exchange_id,
                                            symbol=symbol,
                                            timeframe=timeframe,
                                            db=db
                                        )
                                        synced += 1

                                logger.info(
                                    f"Synced {exchange_id}/{symbol}/{timeframe}: "
                                    f"{current}/{total_combinations}"
                                )
                            else:
                                # No existing data - fetch ALL historical data from the beginning
                                from datetime import datetime, timedelta
                                now = datetime.utcnow()

                                # Fetch from a very early date to get all available data
                                # Using HISTORICAL_DATA_YEARS back as reasonable start for crypto futures
                                start_date = now - timedelta(days=HISTORICAL_DATA_YEARS * 365)  # Historical data

                                logger.info(
                                    f"No existing data for {exchange_id}/{symbol}/{timeframe}, "
                                    f"fetching ALL historical data from {start_date}"
                                )

                                try:
                                    ohlcv_data = await service.fetch_ohlcv(
                                        symbol=symbol,
                                        timeframe=timeframe,
                                        start_date=start_date,
                                        end_date=now
                                    )

                                    if ohlcv_data:
                                        saved = await service.save_to_db(
                                            ohlcv_data=ohlcv_data,
                                            exchange=exchange_id,
                                            symbol=symbol,
                                            timeframe=timeframe,
                                            db=db
                                        )
                                        synced += 1
                                        logger.info(
                                            f"Fetched ALL historical data for {exchange_id}/{symbol}/{timeframe}: "
                                            f"{len(ohlcv_data)} candles from {start_date.date()} to {now.date()}"
                                        )
                                    else:
                                        logger.warning(
                                            f"No data returned for {exchange_id}/{symbol}/{timeframe}"
                                        )
                                except Exception as e:
                                    logger.error(
                                        f"Failed to fetch historical data for {exchange_id}/{symbol}/{timeframe}: {e}"
                                    )
                                    failed += 1
                                    continue

                        except Exception as e:
                            logger.error(
                                f"Failed to sync {exchange_id}/{symbol_base}/{timeframe}: {e}"
                            )
                            failed += 1
                            continue

        logger.info(
            f"Scheduled sync completed: {synced}/{total_combinations} synced, "
            f"{failed} failed, {gaps_filled} gaps filled"
        )

    except Exception as e:
        logger.error(f"Error in scheduled sync job: {e}", exc_info=True)


@asynccontextmanager
async def lifespan():
    """
    Lifespan context manager for FastAPI app

    Starts scheduler on app startup and shuts down on app shutdown.
    """
    # Startup: Start scheduler
    logger.info("Starting APScheduler")

    # Add scheduled job: Run every hour at minute 0
    scheduler.add_job(
        sync_latest_market_data,
        trigger=CronTrigger(minute=0),  # Run every hour at :00
        id='sync_market_data',
        name='Sync Latest Market Data',
        replace_existing=True
    )

    scheduler.start()

    logger.info("APScheduler started successfully")

    yield

    # Shutdown: Stop scheduler
    logger.info("Shutting down APScheduler")
    scheduler.shutdown(wait=True)
    logger.info("APScheduler shut down successfully")


def get_scheduler_status():
    """
    Get current scheduler status

    Returns:
        dict: Scheduler status information
    """
    jobs = scheduler.get_jobs()

    return {
        "status": "running" if scheduler.running else "stopped",
        "total_jobs": len(jobs),
        "jobs": [
            {
                "id": job.id,
                "name": job.name,
                "next_run_time": job.next_run_time.isoformat() if job.next_run_time else None
            }
            for job in jobs
        ]
    }
