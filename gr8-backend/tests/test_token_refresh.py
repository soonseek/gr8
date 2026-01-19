"""Tests for JWT token refresh functionality."""

import pytest
from httpx import AsyncClient
from datetime import datetime, timedelta

from app.models.user import User
from app.auth.jwt import create_access_token, decode_jwt


class TestTokenRefreshAPI:
    """Test token refresh API endpoints."""

    @pytest.mark.asyncio
    async def test_refresh_token_success(self, client: AsyncClient, db_session):
        """토큰 갱신 성공 테스트."""
        # Create user
        wallet_address = "0x1234567890123456789012345678901234567890"
        user = User(wallet_address=wallet_address.lower(), role="user")
        db_session.add(user)
        await db_session.commit()

        # Create initial token
        old_token = create_access_token(wallet_address)

        # Request token refresh
        response = await client.post(
            "/api/auth/refresh",
            json={"token": old_token}
        )

        assert response.status_code == 200
        data = response.json()

        # Verify response structure
        assert "access_token" in data
        assert "token_type" in data
        assert "expires_in" in data
        assert data["token_type"] == "bearer"
        assert data["expires_in"] == 86400  # 24 hours in seconds

        # Verify new token is valid (may be same if generated within same second)
        new_token = data["access_token"]
        new_payload = decode_jwt(new_token)
        assert new_payload is not None
        assert new_payload["wallet_address"] == wallet_address.lower()

    @pytest.mark.asyncio
    async def test_refresh_token_invalid(self, client: AsyncClient):
        """무효한 토큰으로 갱신 시도 - 401."""
        response = await client.post(
            "/api/auth/refresh",
            json={"token": "invalid.token.here"}
        )

        assert response.status_code == 401
        data = response.json()
        assert "detail" in data

    @pytest.mark.asyncio
    async def test_refresh_token_missing(self, client: AsyncClient):
        """토큰 미포함 요청 - 422."""
        response = await client.post(
            "/api/auth/refresh",
            json={}
        )

        assert response.status_code == 422  # Validation error

    @pytest.mark.asyncio
    async def test_refresh_token_user_not_found(self, client: AsyncClient, db_session):
        """존재하지 않는 사용자의 토큰 갱신 - 401."""
        # Create token for non-existent user
        wallet_address = "0xNonExistent123456789012345678901234567890"
        token = create_access_token(wallet_address)

        # Try to refresh
        response = await client.post(
            "/api/auth/refresh",
            json={"token": token}
        )

        assert response.status_code == 401
        data = response.json()
        assert "not found" in data.get("detail", "").lower()

    @pytest.mark.asyncio
    async def test_refresh_token_expired(self, client: AsyncClient, db_session):
        """만료된 토큰으로 갱신 시도 - 401."""
        # Create user
        wallet_address = "0xExpiredUser1234567890123456789012345678"
        user = User(wallet_address=wallet_address.lower(), role="user")
        db_session.add(user)
        await db_session.commit()

        # Create expired token (manually set exp to past)
        from jose import jwt
        from app.auth.jwt import SECRET_KEY, ALGORITHM
        import os

        payload = {
            "wallet_address": wallet_address.lower(),
            "exp": datetime.utcnow() - timedelta(hours=1),  # Expired 1 hour ago
            "iat": datetime.utcnow() - timedelta(hours=25)
        }
        expired_token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

        # Try to refresh expired token
        response = await client.post(
            "/api/auth/refresh",
            json={"token": expired_token}
        )

        assert response.status_code == 401

    @pytest.mark.asyncio
    async def test_refresh_token_extends_expiry(self, client: AsyncClient, db_session):
        """갱신된 토큰의 만료 시간이 24시간으로 연장되는지 확인."""
        # Create user
        wallet_address = "0xTimeExtension123456789012345678901234567"
        user = User(wallet_address=wallet_address.lower(), role="user")
        db_session.add(user)
        await db_session.commit()

        # Create token
        old_token = create_access_token(wallet_address)

        # Refresh token
        response = await client.post(
            "/api/auth/refresh",
            json={"token": old_token}
        )

        assert response.status_code == 200
        data = response.json()

        # Verify expires_in is 24 hours
        assert data["expires_in"] == 86400

        # Verify token payload has valid expiry in future
        new_token = data["access_token"]
        new_payload = decode_jwt(new_token)
        assert new_payload is not None

        # Verify expiry is approximately 24 hours from now (within 1 minute margin)
        from datetime import datetime, timedelta
        exp_time = datetime.utcfromtimestamp(new_payload["exp"])
        now = datetime.utcnow()
        time_diff = (exp_time - now).total_seconds()

        # Should be close to 24 hours (86400 seconds), allow 60 second margin
        assert 86340 <= time_diff <= 86460


class TestTokenRefreshIntegration:
    """Test token refresh integration scenarios."""

    @pytest.mark.asyncio
    async def test_concurrent_refresh_requests(self, client: AsyncClient, db_session):
        """동시에 여러 갱신 요청이 들어올 경우 처리."""
        # Create user
        wallet_address = "0xConcurrent1234567890123456789012345678"
        user = User(wallet_address=wallet_address.lower(), role="user")
        db_session.add(user)
        await db_session.commit()

        # Create token
        old_token = create_access_token(wallet_address)

        # Send multiple concurrent refresh requests
        import asyncio
        responses = await asyncio.gather(*[
            client.post("/api/auth/refresh", json={"token": old_token})
            for _ in range(5)
        ])

        # All should succeed
        for response in responses:
            assert response.status_code == 200
            assert "access_token" in response.json()

        # All tokens should be valid
        for response in responses:
            new_token = response.json()["access_token"]
            payload = decode_jwt(new_token)
            assert payload is not None
