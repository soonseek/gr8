"""
Integration Tests for Market Data API

Tests the market data API endpoints including:
- GET /api/v1/market/data
- POST /api/v1/market/data/fetch
- POST /api/v1/market/sync
- GET /api/v1/market/sync/status

These tests use actual database and mock ccxt calls.
"""

import pytest
from datetime import datetime, timedelta
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from unittest.mock import patch, Mock

from app.models.market_data import MarketData
from app.models.user import User


@pytest.mark.describe("Market Data API - GET /api/v1/market/data")
class TestGetMarketData:
    """Test GET /api/v1/market/data endpoint"""

    @pytest.mark.asyncio
    async def test_get_market_data_from_cache(self, async_client: AsyncClient, db_session: AsyncSession):
        """Test retrieving cached market data from database"""
        # Insert test data
        market_data = MarketData(
            exchange="binance",
            symbol="BTCUSDT",
            timeframe="1h",
            timestamp=1640995200000,
            open=47000.0,
            high=47500.0,
            low=46800.0,
            close=47200.0,
            volume=1234.56
        )
        db_session.add(market_data)
        await db_session.commit()

        # Mock authentication (create admin user and mock token verification)
        admin_user = User(
            wallet_address="0xadmin",
            role="admin",
            status="active",
            total_purchases=0,
            total_sales=0,
            strategy_count=0
        )
        db_session.add(admin_user)
        await db_session.commit()

        # Mock the authentication dependency
        from app.middleware.auth import verify_token
        from main import app

        async def mock_verify_token():
            return admin_user

        app.dependency_overrides[verify_token] = mock_verify_token

        # Request data
        start_date = "2022-01-01T00:00:00"
        end_date = "2022-01-02T00:00:00"

        response = await async_client.get(
            "/api/v1/market/data",
            params={
                "symbol": "BTCUSDT",
                "timeframe": "1h",
                "start_date": start_date,
                "end_date": end_date,
                "exchange": "binance"
            }
        )

        # Verify response
        assert response.status_code == 200
        data = response.json()
        assert data["cached"] == True
        assert data["exchange"] == "binance"
        assert data["symbol"] == "BTCUSDT"
        assert data["timeframe"] == "1h"
        assert data["count"] >= 1
        assert len(data["data"]) >= 1

        # Clean up
        app.dependency_overrides.clear()

    @pytest.mark.asyncio
    async def test_get_market_data_missing_params(self, async_client: AsyncClient):
        """Test API returns 422 for missing required parameters"""
        from app.middleware.auth import verify_token
        from main import app

        # Mock authentication
        async def mock_verify_token():
            return User(
                wallet_address="0xadmin",
                role="admin",
                status="active",
                total_purchases=0,
                total_sales=0,
                strategy_count=0
            )

        app.dependency_overrides[verify_token] = mock_verify_token

        # Request without required parameters
        response = await async_client.get(
            "/api/v1/market/data",
            params={
                "symbol": "BTCUSDT"
                # Missing: timeframe, start_date, end_date
            }
        )

        # Verify validation error
        assert response.status_code == 422

        app.dependency_overrides.clear()

    @pytest.mark.asyncio
    async def test_get_market_data_invalid_timeframe(self, async_client: AsyncClient):
        """Test API returns 422 for invalid timeframe"""
        from app.middleware.auth import verify_token
        from main import app

        # Mock authentication
        async def mock_verify_token():
            return User(
                wallet_address="0xadmin",
                role="admin",
                status="active",
                total_purchases=0,
                total_sales=0,
                strategy_count=0
            )

        app.dependency_overrides[verify_token] = mock_verify_token

        start_date = "2022-01-01T00:00:00"
        end_date = "2022-01-02T00:00:00"

        # Request with invalid timeframe
        response = await async_client.get(
            "/api/v1/market/data",
            params={
                "symbol": "BTCUSDT",
                "timeframe": "invalid_timeframe",
                "start_date": start_date,
                "end_date": end_date
            }
        )

        # Verify validation error
        assert response.status_code == 422

        app.dependency_overrides.clear()


@pytest.mark.describe("Market Data API - POST /api/v1/market/data/fetch")
class TestFetchMarketData:
    """Test POST /api/v1/market/data/fetch endpoint"""

    @pytest.mark.asyncio
    async def test_fetch_market_data_with_mock_ccxt(self, async_client: AsyncClient, db_session: AsyncSession):
        """Test fetching market data with mocked ccxt call"""
        from app.middleware.auth import verify_token
        from main import app
        import ccxt

        # Mock authentication
        admin_user = User(
            wallet_address="0xadmin",
            role="admin",
            status="active",
            total_purchases=0,
            total_sales=0,
            strategy_count=0
        )
        db_session.add(admin_user)
        await db_session.commit()

        async def mock_verify_token():
            return admin_user

        app.dependency_overrides[verify_token] = mock_verify_token

        # Mock ccxt fetch_ohlcv response
        mock_ohlcv_data = [
            [1640995200000, "47000.50", "47500.00", "46800.00", "47200.00", "1234.56"],
            [1640998800000, "47200.00", "47800.00", "47000.00", "47500.00", "2345.67"],
        ]

        # Patch ccxt.Binance.fetch_ohlcv
        with patch('ccxt.binance.Binance.fetch_ohlcv', return_value=mock_ohlcv_data):
            start_date = "2022-01-01T00:00:00"
            end_date = "2022-01-02T00:00:00"

            response = await async_client.post(
                "/api/v1/market/data/fetch",
                params={
                    "symbol": "BTCUSDT",
                    "timeframe": "1h",
                    "start_date": start_date,
                    "end_date": end_date,
                    "exchange": "binance"
                }
            )

            # Verify response
            assert response.status_code == 200
            data = response.json()
            assert data["cached"] == False
            assert data["exchange"] == "binance"
            assert data["symbol"] == "BTCUSDT"
            assert data["count"] == 2

            # Verify data was saved to database
            query = select(MarketData).where(
                MarketData.exchange == "binance",
                MarketData.symbol == "BTCUSDT",
                MarketData.timeframe == "1h"
            )
            result = await db_session.execute(query)
            saved_data = result.scalars().all()
            assert len(saved_data) == 2

        app.dependency_overrides.clear()

    @pytest.mark.asyncio
    async def test_fetch_market_data_ccxt_error(self, async_client: AsyncClient, db_session: AsyncSession):
        """Test API handles ccxt errors gracefully"""
        from app.middleware.auth import verify_token
        from main import app
        import ccxt

        # Mock authentication
        admin_user = User(
            wallet_address="0xadmin",
            role="admin",
            status="active",
            total_purchases=0,
            total_sales=0,
            strategy_count=0
        )
        db_session.add(admin_user)
        await db_session.commit()

        async def mock_verify_token():
            return admin_user

        app.dependency_overrides[verify_token] = mock_verify_token

        # Mock ccxt error
        with patch('ccxt.binance.Binance.fetch_ohlcv', side_effect=ccxt.NetworkError("Connection failed")):
            start_date = "2022-01-01T00:00:00"
            end_date = "2022-01-02T00:00:00"

            response = await async_client.post(
                "/api/v1/market/data/fetch",
                params={
                    "symbol": "BTCUSDT",
                    "timeframe": "1h",
                    "start_date": start_date,
                    "end_date": end_date,
                    "exchange": "binance"
                }
            )

            # Verify error response
            assert response.status_code == 500
            data = response.json()
            assert "detail" in data

        app.dependency_overrides.clear()


@pytest.mark.describe("Market Data API - POST /api/v1/market/sync")
class TestSyncMarketData:
    """Test POST /api/v1/market/sync endpoint"""

    @pytest.mark.asyncio
    async def test_sync_market_data_admin_only(self, async_client: AsyncClient, db_session: AsyncSession):
        """Test that only admins can trigger sync"""
        from app.middleware.auth import verify_token
        from main import app

        # Mock normal user (not admin)
        normal_user = User(
            wallet_address="0xuser",
            role="user",
            status="active",
            total_purchases=0,
            total_sales=0,
            strategy_count=0
        )
        db_session.add(normal_user)
        await db_session.commit()

        async def mock_verify_token():
            return normal_user

        app.dependency_overrides[verify_token] = mock_verify_token

        # Try to trigger sync as normal user
        response = await async_client.post("/api/v1/market/sync")

        # Verify forbidden
        assert response.status_code == 403

        app.dependency_overrides.clear()

    @pytest.mark.asyncio
    async def test_sync_market_data_as_admin(self, async_client: AsyncClient, db_session: AsyncSession):
        """Test admin can trigger sync job"""
        from app.middleware.auth import verify_token
        from main import app

        # Mock admin user
        admin_user = User(
            wallet_address="0xadmin",
            role="admin",
            status="active",
            total_purchases=0,
            total_sales=0,
            strategy_count=0
        )
        db_session.add(admin_user)
        await db_session.commit()

        async def mock_verify_token():
            return admin_user

        app.dependency_overrides[verify_token] = mock_verify_token

        # Trigger sync as admin
        with patch('app.api.routers.market_data.perform_sync_job'):
            response = await async_client.post("/api/v1/market/sync")

            # Verify sync started
            assert response.status_code == 200
            data = response.json()
            assert data["status"] in ["syncing", "pending"]
            assert "job_id" in data

        app.dependency_overrides.clear()


@pytest.mark.describe("Market Data API - GET /api/v1/market/sync/status")
class TestSyncStatus:
    """Test GET /api/v1/market/sync/status endpoint"""

    @pytest.mark.asyncio
    async def test_get_sync_status(self, async_client: AsyncClient, db_session: AsyncSession):
        """Test retrieving sync status"""
        from app.middleware.auth import verify_token
        from main import app

        # Mock authentication
        admin_user = User(
            wallet_address="0xadmin",
            role="admin",
            status="active",
            total_purchases=0,
            total_sales=0,
            strategy_count=0
        )
        db_session.add(admin_user)
        await db_session.commit()

        async def mock_verify_token():
            return admin_user

        app.dependency_overrides[verify_token] = mock_verify_token

        # Get sync status
        response = await async_client.get("/api/v1/market/sync/status")

        # Verify response
        assert response.status_code == 200
        data = response.json()
        assert "total_combinations" in data
        assert "synced" in data
        assert "failed" in data
        assert "gaps_filled" in data
        assert "status" in data

        app.dependency_overrides.clear()


@pytest.mark.describe("Market Data API - Multiple Exchanges")
class TestMultipleExchanges:
    """Test API works with all MVP exchanges"""

    @pytest.mark.asyncio
    async def test_all_mvp_exchanges_configured(self):
        """Test that all MVP exchanges are properly configured"""
        from app.services.market_data_service import EXCHANGE_FUTURES_CONFIG, MVP_EXCHANGES

        # Verify all MVP exchanges have configs
        for exchange_id in MVP_EXCHANGES:
            assert exchange_id in EXCHANGE_FUTURES_CONFIG
            config = EXCHANGE_FUTURES_CONFIG[exchange_id]
            assert "defaultType" in config
            assert "symbol_format" in config

    @pytest.mark.asyncio
    async def test_exchange_specific_symbols(self):
        """Test exchange-specific symbol formatting"""
        from app.services.market_data_service import EXCHANGE_FUTURES_CONFIG

        # Test symbol format for each exchange
        test_cases = [
            ("binance", "BTCUSDT"),
            ("okx", "BTC-USDT-SWAP"),
            ("bybit", "BTCUSDT"),
            ("gate", "BTC_USDT"),
            ("bitget", "BTCUSDT"),
        ]

        for exchange_id, expected_symbol in test_cases:
            config = EXCHANGE_FUTURES_CONFIG[exchange_id]
            symbol = config["symbol_format"].format(base="BTC")
            assert symbol == expected_symbol, f"Symbol format mismatch for {exchange_id}"


@pytest.mark.describe("Market Data API - Error Scenarios")
class TestErrorScenarios:
    """Test various error scenarios"""

    @pytest.mark.asyncio
    async def test_unauthenticated_request(self, async_client: AsyncClient):
        """Test that unauthenticated requests are rejected"""
        # Try to access endpoint without authentication
        response = await async_client.get(
            "/api/v1/market/data",
            params={
                "symbol": "BTCUSDT",
                "timeframe": "1h",
                "start_date": "2022-01-01T00:00:00",
                "end_date": "2022-01-02T00:00:00"
            }
        )

        # Verify unauthorized
        assert response.status_code == 401

    @pytest.mark.asyncio
    async def test_invalid_date_format(self, async_client: AsyncClient):
        """Test API handles invalid date formats"""
        from app.middleware.auth import verify_token
        from main import app

        # Mock authentication
        async def mock_verify_token():
            return User(
                wallet_address="0xadmin",
                role="admin",
                status="active",
                total_purchases=0,
                total_sales=0,
                strategy_count=0
            )

        app.dependency_overrides[verify_token] = mock_verify_token

        # Request with invalid date format
        response = await async_client.get(
            "/api/v1/market/data",
            params={
                "symbol": "BTCUSDT",
                "timeframe": "1h",
                "start_date": "invalid_date",
                "end_date": "2022-01-02T00:00:00"
            }
        )

        # Verify validation error
        assert response.status_code == 422

        app.dependency_overrides.clear()

    @pytest.mark.asyncio
    async def test_end_date_before_start_date(self, async_client: AsyncClient):
        """Test API validates end_date is after start_date"""
        from app.middleware.auth import verify_token
        from main import app

        # Mock authentication
        async def mock_verify_token():
            return User(
                wallet_address="0xadmin",
                role="admin",
                status="active",
                total_purchases=0,
                total_sales=0,
                strategy_count=0
            )

        app.dependency_overrides[verify_token] = mock_verify_token

        # Request with end_date before start_date
        response = await async_client.get(
            "/api/v1/market/data",
            params={
                "symbol": "BTCUSDT",
                "timeframe": "1h",
                "start_date": "2022-01-02T00:00:00",
                "end_date": "2022-01-01T00:00:00"  # Before start_date
            }
        )

        # Verify validation error
        assert response.status_code == 422

        app.dependency_overrides.clear()
