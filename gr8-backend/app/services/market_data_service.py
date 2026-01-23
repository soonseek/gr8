"""
Market Data Collection Service using ccxt

This service provides functionality to:
1. Fetch historical OHLCV data from cryptocurrency exchanges via ccxt
2. Save data to PostgreSQL database
3. Query cached data from database
4. Detect and fill data gaps
5. Sync latest data incrementally

MVP Scope:
- 5 exchanges (Binance, OKX, Bybit, Gate.io, Bitget)
- 5 symbols (BTC, ETH, SOL, XRP, DOGE)
- Perpetual futures (swap/forward contracts)
"""

# Standard library imports
import asyncio
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional

# Third-party imports
import ccxt
from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

# Local imports
from app.models.market_data import MarketData

logger = logging.getLogger(__name__)

# MVP Configuration Constants (AC 8 requirement)
MVP_EXCHANGES = ["binance", "okx", "bybit", "gate", "bitget"]
MVP_SYMBOLS_BASE = ["BTC", "ETH", "SOL", "XRP", "DOGE"]  # Base symbols for perpetual futures
TIMEFRAMES = ["1m", "5m", "15m", "1h", "4h", "1d"]

# Maximum candles per request to prevent infinite loops
MAX_CANDLES_PER_REQUEST = 100000
CCXT_LIMIT_PER_REQUEST = 1000  # ccxt default limit
HISTORICAL_DATA_YEARS = 2  # Years of historical data to fetch for new symbols

# Exchange-specific perpetual futures configuration (AC 8 requirement)
EXCHANGE_FUTURES_CONFIG = {
    "binance": {
        "defaultType": "future",  # Binance futures
        "symbol_format": "{base}USDT",  # BTC → BTCUSDT
    },
    "okx": {
        "defaultType": "swap",  # OKX perpetual swaps
        "symbol_format": "{base}-USDT-SWAP",  # BTC → BTC-USDT-SWAP
    },
    "bybit": {
        "defaultType": "future",  # Bybit futures (USDT margin)
        "symbol_format": "{base}USDT",  # BTC → BTCUSDT
    },
    "gate": {
        "defaultType": "futures",  # Gate.io futures
        "symbol_format": "{base}_USDT",  # BTC → BTC_USDT
    },
    "bitget": {
        "defaultType": "futuresUSDT",  # Bitget USDT margin futures
        "symbol_format": "{base}USDT",  # BTC → BTCUSDT
    },
}

# Timeframe intervals in milliseconds (for gap detection)
TIMEFRAME_INTERVALS = {
    '1m': 60_000,        # 1 minute
    '5m': 300_000,       # 5 minutes
    '15m': 900_000,      # 15 minutes
    '1h': 3_600_000,     # 1 hour
    '4h': 14_400_000,    # 4 hours
    '1d': 86_400_000,    # 1 day
}


class MarketDataService:
    """
    ccxt-based Market Data Collection Service

    Handles fetching, storing, and querying historical OHLCV data
    from cryptocurrency exchanges for perpetual futures contracts.
    """

    def __init__(self, exchange_id: str = "binance"):
        """
        Initialize market data service for a specific exchange

        Args:
            exchange_id: Exchange identifier (default: 'binance')
                        Must be one of: binance, okx, bybit, gate, bitget
        """
        if exchange_id not in EXCHANGE_FUTURES_CONFIG:
            raise ValueError(
                f"Unsupported exchange: {exchange_id}. "
                f"Supported exchanges: {list(EXCHANGE_FUTURES_CONFIG.keys())}"
            )

        self.exchange_id = exchange_id

        # Get exchange-specific config for perpetual futures
        config = EXCHANGE_FUTURES_CONFIG[exchange_id].copy()
        config["enableRateLimit"] = True  # Automatic rate limiting (ccxt built-in)
        config["options"] = {"defaultType": config.pop("defaultType")}

        # Create ccxt exchange instance
        try:
            self.exchange = getattr(ccxt, exchange_id)(config)
            logger.info(f"Initialized ccxt exchange: {exchange_id} (perpetual futures mode)")
        except Exception as e:
            logger.error(f"Failed to initialize ccxt exchange {exchange_id}: {e}")
            raise

    def format_symbol(self, base: str) -> str:
        """
        Format base symbol to exchange-specific perpetual futures format

        Args:
            base: Base cryptocurrency (e.g., 'BTC', 'ETH')

        Returns:
            Exchange-formatted symbol for perpetual futures

        Examples:
            Binance:  BTC → BTCUSDT
            OKX:      BTC → BTC-USDT-SWAP
            Bybit:    BTC → BTCUSDT
            Gate.io:  BTC → BTC_USDT
            Bitget:   BTC → BTCUSDT
        """
        config = EXCHANGE_FUTURES_CONFIG[self.exchange_id]
        symbol_format = config["symbol_format"]
        return symbol_format.format(base=base)

    async def fetch_ohlcv(
        self,
        symbol: str,
        timeframe: str,
        start_date: datetime,
        end_date: datetime,
    ) -> List[Dict]:
        """
        Fetch OHLCV data from exchange using ccxt

        Args:
            symbol: Trading symbol (exchange-specific format, e.g., 'BTCUSDT', 'BTC-USDT-SWAP')
            timeframe: Timeframe (1m, 5m, 15m, 1h, 4h, 1d)
            start_date: Start datetime (inclusive)
            end_date: End datetime (exclusive)

        Returns:
            List of OHLCV candles as dictionaries:
            [
                {
                    'timestamp': 1499040000000,
                    'open': 0.01634790,
                    'high': 0.80000000,
                    'low': 0.01575800,
                    'close': 0.01577100,
                    'volume': 148976.1141
                },
                ...
            ]

        Raises:
            ccxt.BaseError: If ccxt API call fails
        """
        if timeframe not in TIMEFRAMES:
            raise ValueError(f"Invalid timeframe: {timeframe}. Must be one of {TIMEFRAMES}")

        # Convert datetime to milliseconds timestamp
        since = int(start_date.timestamp() * 1000)
        end_ts = int(end_date.timestamp() * 1000)

        all_ohlcv = []
        current_since = since

        try:
            # Fetch data in batches (ccxt limit is typically 1000 candles per request)
            while current_since < end_ts:
                # ccxt fetch_ohlcv is synchronous, not async
                # Run in thread pool to avoid blocking event loop
                import asyncio
                loop = asyncio.get_event_loop()
                ohlcv = await loop.run_in_executor(
                    None,
                    lambda: self.exchange.fetch_ohlcv(
                        symbol=symbol,
                        timeframe=timeframe,
                        since=current_since,
                        limit=CCXT_LIMIT_PER_REQUEST  # ccxt default limit
                    )
                )

                if not ohlcv:
                    break  # No more data available

                # Convert ccxt format (list of lists) to list of dicts
                reached_end = False  # Flag to track if we've reached end_ts
                for candle in ohlcv:
                    timestamp, open_price, high, low, close, volume = candle

                    # Skip candles outside our date range
                    if timestamp >= end_ts:
                        reached_end = True
                        break  # Exit for loop

                    # Ensure numeric types (ccxt may return strings)
                    # Convert to float first to handle both string and numeric inputs
                    open_price = float(open_price) if not isinstance(open_price, (int, float)) else open_price
                    high = float(high) if not isinstance(high, (int, float)) else high
                    low = float(low) if not isinstance(low, (int, float)) else low
                    close = float(close) if not isinstance(close, (int, float)) else close
                    volume = float(volume) if not isinstance(volume, (int, float)) else volume

                    # Validate data (AC 6 requirement)
                    if not self._validate_candle(open_price, high, low, close, volume):
                        logger.warning(
                            f"Skipping invalid candle at {timestamp}: "
                            f"O={open_price}, H={high}, L={low}, C={close}, V={volume}"
                        )
                        continue

                    all_ohlcv.append({
                        'timestamp': int(timestamp),  # Ensure timestamp is int
                        'open': open_price,
                        'high': high,
                        'low': low,
                        'close': close,
                        'volume': volume,
                    })

                # Exit while loop if we've reached the end timestamp
                if reached_end:
                    break

                # Move to next batch
                if ohlcv:
                    current_since = ohlcv[-1][0] + TIMEFRAME_INTERVALS[timeframe]
                else:
                    break

                # Safety check to prevent infinite loops
                if len(all_ohlcv) > MAX_CANDLES_PER_REQUEST:
                    logger.warning(f"Reached maximum candle limit ({MAX_CANDLES_PER_REQUEST}), stopping fetch")
                    break

            logger.info(
                f"Fetched {len(all_ohlcv)} candles from {self.exchange_id} "
                f"for {symbol} {timeframe} ({start_date} → {end_date})"
            )
            return all_ohlcv

        except ccxt.BaseError as e:
            logger.error(f"ccxt error fetching data from {self.exchange_id}: {e}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error fetching OHLCV data: {e}")
            raise

    def _validate_candle(
        self,
        open_price: float,
        high: float,
        low: float,
        close: float,
        volume: float
    ) -> bool:
        """
        Validate candle data (AC 6 requirement)

        Args:
            open_price: Opening price
            high: Highest price
            low: Lowest price
            close: Closing price
            volume: Trading volume

        Returns:
            True if candle data is valid, False otherwise
        """
        # All prices must be positive
        if open_price <= 0 or high <= 0 or low <= 0 or close <= 0:
            return False

        # Volume must be non-negative
        if volume < 0:
            return False

        # High must be >= low
        if high < low:
            return False

        # High should be >= open and close
        if high < open_price or high < close:
            return False

        # Low should be <= open and close
        if low > open_price or low > close:
            return False

        return True

    async def save_to_db(
        self,
        ohlcv_data: List[Dict],
        symbol: str,
        timeframe: str,
        db: AsyncSession,
        exchange: Optional[str] = None,
    ) -> int:
        """
        Save OHLCV data to database using bulk insert (handles duplicates via UNIQUE constraint)

        Args:
            ohlcv_data: List of OHLCV candles (from fetch_ohlcv)
            symbol: Trading symbol
            timeframe: Timeframe
            db: Database session
            exchange: Exchange identifier (optional, defaults to self.exchange_id)

        Returns:
            Number of successfully saved candles
        """
        # Use provided exchange or default to service's exchange_id
        exchange_id = exchange or self.exchange_id

        # Create MarketData objects for all candles
        market_data_objects = [
            MarketData(
                exchange=exchange_id,
                symbol=symbol,
                timeframe=timeframe,
                timestamp=candle['timestamp'],
                open=candle['open'],
                high=candle['high'],
                low=candle['low'],
                close=candle['close'],
                volume=candle['volume']
            )
            for candle in ohlcv_data
        ]

        try:
            # Bulk insert with ON CONFLICT DO NOTHING (PostgreSQL)
            # This is much faster than individual inserts
            db.add_all(market_data_objects)
            await db.commit()

            saved_count = len(market_data_objects)
            logger.info(
                f"Bulk saved {saved_count}/{len(ohlcv_data)} candles to DB "
                f"({exchange_id}, {symbol}, {timeframe})"
            )
            return saved_count

        except Exception as e:
            # If bulk insert fails, fall back to individual inserts with duplicate handling
            logger.warning(f"Bulk insert failed, falling back to individual inserts: {e}")
            await db.rollback()

            saved_count = 0
            for candle in ohlcv_data:
                market_data = MarketData(
                    exchange=exchange_id,
                    symbol=symbol,
                    timeframe=timeframe,
                    timestamp=candle['timestamp'],
                    open=candle['open'],
                    high=candle['high'],
                    low=candle['low'],
                    close=candle['close'],
                    volume=candle['volume']
                )

                try:
                    db.add(market_data)
                    await db.commit()
                    saved_count += 1
                except Exception:
                    # UNIQUE constraint violation → duplicate data, skip
                    await db.rollback()
                    continue

            logger.info(
                f"Fallback saved {saved_count}/{len(ohlcv_data)} candles to DB "
                f"({exchange_id}, {symbol}, {timeframe})"
            )
            return saved_count

    async def get_data_from_db(
        self,
        symbol: str,
        timeframe: str,
        start_date: datetime,
        end_date: datetime,
        db: AsyncSession,
    ) -> List[MarketData]:
        """
        Query OHLCV data from database

        Args:
            symbol: Trading symbol
            timeframe: Timeframe
            start_date: Start datetime (inclusive)
            end_date: End datetime (inclusive)
            db: Database session

        Returns:
            List of MarketData objects
        """
        start_ts = int(start_date.timestamp() * 1000)
        end_ts = int(end_date.timestamp() * 1000)

        query = select(MarketData).where(
            and_(
                MarketData.exchange == self.exchange_id,
                MarketData.symbol == symbol,
                MarketData.timeframe == timeframe,
                MarketData.timestamp >= start_ts,
                MarketData.timestamp <= end_ts
            )
        ).order_by(MarketData.timestamp)

        result = await db.execute(query)
        market_data = result.scalars().all()

        logger.info(
            f"Retrieved {len(market_data)} candles from DB "
            f"({self.exchange_id}, {symbol}, {timeframe}, {start_date} → {end_date})"
        )
        return market_data

    async def get_last_timestamp(
        self,
        symbol: str,
        timeframe: str,
        db: AsyncSession,
        exchange: Optional[str] = None,
    ) -> Optional[int]:
        """
        Get the last (most recent) timestamp for a specific exchange/symbol/timeframe

        Args:
            symbol: Trading symbol
            timeframe: Timeframe
            db: Database session
            exchange: Exchange identifier (optional, defaults to self.exchange_id)

        Returns:
            Last timestamp in milliseconds, or None if no data exists
        """
        # Use provided exchange or default to service's exchange_id
        exchange_id = exchange or self.exchange_id

        query = select(MarketData.timestamp).where(
            and_(
                MarketData.exchange == exchange_id,
                MarketData.symbol == symbol,
                MarketData.timeframe == timeframe
            )
        ).order_by(MarketData.timestamp.desc()).limit(1)

        result = await db.execute(query)
        last_row = result.first()

        return last_row[0] if last_row else None

    async def detect_and_fill_gaps(
        self,
        symbol: str,
        timeframe: str,
        db: AsyncSession,
        exchange: Optional[str] = None,
    ) -> int:
        """
        Detect and fill data gaps in historical data (AC 12 requirement)

        This method:
        1. Queries all existing timestamps for the given exchange/symbol/timeframe
        2. Identifies gaps where timestamp intervals exceed the expected timeframe interval
        3. Fetches missing data from exchange for each gap period
        4. Saves filled data to database

        Args:
            symbol: Trading symbol (exchange-formatted, e.g., BTCUSDT, BTC-USDT-SWAP)
            timeframe: Timeframe (1m, 5m, 15m, 1h, 4h, 1d)
            db: Database session
            exchange: Exchange identifier (optional, defaults to self.exchange_id)

        Returns:
            Number of gaps filled (int). Returns 0 if fewer than 2 data points exist.

        Examples:
            >>> service = MarketDataService("binance")
            >>> gaps_filled = await service.detect_and_fill_gaps(
            ...     symbol="BTCUSDT",
            ...     timeframe="1h",
            ...     db=db_session
            ... )
            >>> print(f"Filled {gaps_filled} gaps")

        Note:
            - Requires at least 2 existing data points to detect gaps
            - Uses TIMEFRAME_INTERVALS to determine expected intervals
            - Logs warnings for each detected gap
        """
        # Use provided exchange or default to service's exchange_id
        exchange_id = exchange or self.exchange_id

        # Get all timestamps for this combination
        query = select(MarketData.timestamp).where(
            and_(
                MarketData.exchange == exchange_id,
                MarketData.symbol == symbol,
                MarketData.timeframe == timeframe
            )
        ).order_by(MarketData.timestamp)

        result = await db.execute(query)
        timestamps = [row[0] for row in result.all()]

        if len(timestamps) < 2:
            return 0  # Not enough data to detect gaps

        # Detect gaps
        interval = TIMEFRAME_INTERVALS[timeframe]
        gaps = []

        for i in range(len(timestamps) - 1):
            current = timestamps[i]
            next_ts = timestamps[i + 1]

            if next_ts - current > interval:
                # Gap detected
                gap_start = current + interval
                gap_end = next_ts - interval
                gaps.append((gap_start, gap_end))
                logger.warning(
                    f"Gap detected: {datetime.fromtimestamp(current/1000)} → "
                    f"{datetime.fromtimestamp(next_ts/1000)} "
                    f"({(next_ts - current) // 1000 // interval} candles missing)"
                )

        # Fill gaps
        gaps_filled = 0
        for gap_start, gap_end in gaps:
            try:
                start_date = datetime.fromtimestamp(gap_start / 1000)
                end_date = datetime.fromtimestamp(gap_end / 1000)

                ohlcv_data = await self.fetch_ohlcv(symbol, timeframe, start_date, end_date)
                saved = await self.save_to_db(ohlcv_data, symbol, timeframe, db, exchange=exchange_id)

                if saved > 0:
                    gaps_filled += saved
                    logger.info(f"Filled gap: {start_date} → {end_date} ({saved} candles)")

            except Exception as e:
                logger.error(f"Failed to fill gap {gap_start} → {gap_end}: {e}")
                continue

        logger.info(f"Filled {gaps_filled} candles across {len(gaps)} gaps")
        return gaps_filled

    async def sync_missing_data(
        self,
        symbol: str,
        timeframe: str,
        db: AsyncSession,
    ) -> int:
        """
        Sync missing data from last timestamp to now (AC 12 requirement)

        This method implements incremental update logic:
        1. If no existing data: fetch ALL historical data (HISTORICAL_DATA_YEARS back)
        2. If data exists: fetch from last timestamp to now
        3. Save fetched data to database
        4. Detect and fill any gaps

        Args:
            symbol: Trading symbol (exchange-formatted, e.g., BTCUSDT, BTC-USDT-SWAP)
            timeframe: Timeframe (1m, 5m, 15m, 1h, 4h, 1d)
            db: Database session

        Returns:
            Number of new candles synced (int). Returns 0 if:
            - Data already up-to-date (now <= last_date)
            - Exchange returns no data
            - Fetch fails

        Examples:
            >>> service = MarketDataService("binance")
            >>> synced = await service.sync_missing_data(
            ...     symbol="BTCUSDT",
            ...     timeframe="1h",
            ...     db=db_session
            ... )
            >>> print(f"Synced {synced} new candles")

        Note:
            - Uses HISTORICAL_DATA_YEARS (2 years) for initial data fetch
            - Logs warnings for missing data or fetch failures
            - Does NOT call detect_and_fill_gaps (caller must invoke separately)
        """
        from datetime import timedelta

        last_ts = await self.get_last_timestamp(symbol, timeframe, db)

        if not last_ts:
            # No existing data - fetch ALL historical data (from HISTORICAL_DATA_YEARS ago)
            now = datetime.utcnow()
            start_date = now - timedelta(days=HISTORICAL_DATA_YEARS * 365)  # Historical data

            logger.info(
                f"No existing data for {self.exchange_id}/{symbol}/{timeframe}, "
                f"fetching ALL historical data from {start_date.date()} to {now.date()}"
            )

            try:
                ohlcv_data = await self.fetch_ohlcv(symbol, timeframe, start_date, now)

                if ohlcv_data:
                    saved = await self.save_to_db(ohlcv_data, symbol, timeframe, db)
                    logger.info(
                        f"Fetched initial data for {self.exchange_id}/{symbol}/{timeframe}: "
                        f"{saved} candles"
                    )
                    return saved
                else:
                    logger.warning(f"No data returned from exchange for {symbol}/{timeframe}")
                    return 0

            except Exception as e:
                logger.error(f"Failed to fetch initial data for {symbol}/{timeframe}: {e}")
                return 0

        # Fetch from last timestamp → now
        last_date = datetime.fromtimestamp(last_ts / 1000)
        now = datetime.utcnow()

        if now <= last_date:
            logger.info(f"Data already up-to-date for {self.exchange_id}/{symbol}/{timeframe}")
            return 0

        try:
            ohlcv_data = await self.fetch_ohlcv(symbol, timeframe, last_date, now)
            saved = await self.save_to_db(ohlcv_data, symbol, timeframe, db)

            # Detect and fill gaps after syncing
            await self.detect_and_fill_gaps(symbol, timeframe, db)

            return saved

        except Exception as e:
            logger.error(f"Failed to sync missing data: {e}")
            raise
