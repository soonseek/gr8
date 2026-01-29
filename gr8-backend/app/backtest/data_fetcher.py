"""
Market Data Fetcher

Fetches historical OHLCV data from exchanges using ccxt
"""

import ccxt
import pandas as pd
from typing import Optional
from datetime import datetime, timedelta


class DataFetcher:
    """
    Fetches historical market data from cryptocurrency exchanges
    """

    def __init__(self):
        self.exchange_instances = {}

    def get_exchange(self, exchange_name: str) -> ccxt.Exchange:
        """
        Get or create exchange instance
        """
        if exchange_name not in self.exchange_instances:
            exchange_class = getattr(ccxt, exchange_name)
            self.exchange_instances[exchange_name] = exchange_class({
                'enableRateLimit': True,
            })
        return self.exchange_instances[exchange_name]

    async def fetch_ohlcv(
        self,
        exchange: str = 'binance',
        symbol: str = 'BTC',
        timeframe: str = '1h',
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        limit: int = 500,
    ) -> pd.DataFrame:
        """
        Fetch OHLCV data from exchange

        Args:
            exchange: Exchange name (binance, okx, bybit, etc.)
            symbol: Symbol without slash (BTC, ETH, etc.) - for perpetual futures
            timeframe: Candle timeframe (1m, 5m, 1h, 1d, etc.)
            start_date: Start date (ISO format)
            end_date: End date (ISO format)
            limit: Number of candles to fetch

        Returns:
            DataFrame with OHLCV data
        """
        try:
            exchange_instance = self.get_exchange(exchange)

            # Convert symbol to exchange format
            # For perpetual futures: BTC -> BTC/USDT:USDT
            if '/' not in symbol:
                symbol_formatted = f"{symbol}/USDT:USDT"
            else:
                symbol_formatted = symbol

            # Fetch data
            since = None
            if start_date:
                since = int(datetime.fromisoformat(start_date).timestamp() * 1000)

            ohlcv = exchange_instance.fetch_ohlcv(
                symbol_formatted,
                timeframe=timeframe,
                since=since,
                limit=limit,
            )

            # Convert to DataFrame
            df = pd.DataFrame(
                ohlcv,
                columns=['timestamp', 'open', 'high', 'low', 'close', 'volume']
            )

            # Filter by end_date if provided
            if end_date:
                end_timestamp = int(datetime.fromisoformat(end_date).timestamp() * 1000)
                df = df[df['timestamp'] <= end_timestamp]

            return df

        except Exception as e:
            raise Exception(f"Failed to fetch market data: {str(e)}")

    def get_latest_price(self, exchange: str, symbol: str) -> float:
        """
        Get latest price for a symbol
        """
        exchange_instance = self.get_exchange(exchange)
        symbol_formatted = f"{symbol}/USDT:USDT" if '/' not in symbol else symbol
        ticker = exchange_instance.fetch_ticker(symbol_formatted)
        return ticker['last']
