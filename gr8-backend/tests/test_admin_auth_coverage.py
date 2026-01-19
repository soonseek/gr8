"""
Additional admin auth tests to improve code coverage
"""

import pytest
from fastapi import status
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.auth.jwt import create_access_token


class TestAdminAuthEdgeCases:
    """Additional edge case tests for admin authentication"""

    @pytest.mark.asyncio
    async def test_admin_dashboard_with_invalid_token_format(self, async_client: AsyncClient):
        """Test dashboard access with malformed JWT token"""
        response = await async_client.get(
            "/api/admin/dashboard",
            headers={"Authorization": "Bearer invalid.token.format"}
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    @pytest.mark.asyncio
    async def test_admin_dashboard_with_expired_token(self, async_client: AsyncClient, admin_user: User):
        """Test dashboard access with expired token"""
        # Create an expired token (exp in the past)
        from datetime import datetime, timedelta
        from jose import jwt

        expired_payload = {
            "sub": str(admin_user.wallet_address),
            "role": admin_user.role,
            "exp": (datetime.utcnow() - timedelta(hours=1)).timestamp()
        }
        expired_token = jwt.encode(
            expired_payload,
            "your-secret-key-here",  # Must match config
            algorithm="HS256"
        )

        response = await async_client.get(
            "/api/admin/dashboard",
            headers={"Authorization": f"Bearer {expired_token}"}
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    @pytest.mark.asyncio
    async def test_admin_dashboard_with_no_token(self, async_client: AsyncClient):
        """Test dashboard access without token"""
        response = await async_client.get("/api/admin/dashboard")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    @pytest.mark.asyncio
    async def test_admin_dashboard_with_bearer_prefix_missing(self, async_client: AsyncClient, admin_token: str):
        """Test dashboard access with malformed Authorization header"""
        response = await async_client.get(
            "/api/admin/dashboard",
            headers={"Authorization": admin_token}  # Missing "Bearer" prefix
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    @pytest.mark.asyncio
    async def test_admin_middleware_with_nonexistent_user(self, client: AsyncClient):
        """Test admin middleware with deleted user"""
        # Create token for non-existent user
        fake_wallet = "0xnonexistentuser1234567890"
        token = create_access_token(
            data={"sub": fake_wallet, "role": "admin"}
        )

        response = await client.get(
            "/api/admin/dashboard",
            headers={"Authorization": f"Bearer {token}"}
        )

        # Should fail because user doesn't exist
        assert response.status_code in [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN]

    @pytest.mark.asyncio
    async def test_web3_auth_verify_signature_error(self, client: AsyncClient):
        """Test Web3 auth with invalid signature"""
        response = await async_client.post(
            "/api/auth/web3/login",
            json={
                "wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
                "signature": "invalid_signature",
                "message": "test message"
            }
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    @pytest.mark.asyncio
    async def test_web3_auth_missing_fields(self, client: AsyncClient):
        """Test Web3 auth with missing required fields"""
        # Missing signature
        response = await async_client.post(
            "/api/auth/web3/login",
            json={
                "wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
                "message": "test message"
            }
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    @pytest.mark.asyncio
    async def test_token_refresh_with_invalid_refresh_token(self, client: AsyncClient):
        """Test token refresh with invalid refresh token"""
        response = await async_client.post(
            "/api/auth/refresh",
            json={"refresh_token": "invalid_refresh_token"}
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    @pytest.mark.asyncio
    async def test_token_refresh_missing_token(self, client: AsyncClient):
        """Test token refresh without token"""
        response = await async_client.post(
            "/api/auth/refresh",
            json={}
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


class TestAdminDashboardCoverage:
    """Additional tests to improve dashboard API coverage"""

    @pytest.mark.asyncio
    async def test_dashboard_with_no_data(self, client: AsyncClient, admin_token: str, db_session: AsyncSession):
        """Test dashboard when database is empty"""
        # Clear all data
        await db_session.execute("DELETE FROM users")
        await db_session.commit()

        response = await client.get(
            "/api/admin/dashboard",
            headers={"Authorization": f"Bearer {admin_token}"}
        )

        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["totalUsers"] == 0
        assert data["activeUsers"] == 0
        assert data["totalStrategies"] == 0
        assert data["totalTransactions"] == 0
        assert data["totalRevenue"] == 0
        assert data["pendingApplications"] == 0

    @pytest.mark.asyncio
    async def test_dashboard_cache_invalidation(self, client: AsyncClient, admin_token: str, db_session: AsyncSession, admin_user: User):
        """Test that cache is properly invalidated"""
        from app.core.cache import cache

        # First request - cache miss
        response1 = await client.get(
            "/api/admin/dashboard",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response1.status_code == status.HTTP_200_OK

        # Get cache key
        cache_key = f"admin_dashboard:{admin_user.wallet_address}"

        # Check cache exists
        assert await cache.get(cache_key) is not None

        # Clear cache
        await cache.delete(cache_key)

        # Second request - cache miss again
        response2 = await client.get(
            "/api/admin/dashboard",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response2.status_code == status.HTTP_200_OK

    @pytest.mark.asyncio
    async def test_dashboard_concurrent_requests(self, client: AsyncClient, admin_token: str):
        """Test dashboard with concurrent requests"""
        import asyncio

        # Make 10 concurrent requests
        tasks = [
            client.get(
                "/api/admin/dashboard",
                headers={"Authorization": f"Bearer {admin_token}"}
            )
            for _ in range(10)
        ]

        responses = await asyncio.gather(*tasks)

        # All should succeed
        for response in responses:
            assert response.status_code == status.HTTP_200_OK


class TestAdminRoleManagementCoverage:
    """Additional role management edge case tests"""

    @pytest.mark.asyncio
    async def test_change_role_with_same_role(self, client: AsyncClient, admin_token: str, admin_user: User):
        """Test changing user to the same role they already have"""
        response = await async_client.put(
            f"/api/admin/users/{admin_user.wallet_address}/role",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={"role": "admin"}
        )

        # Should succeed or return no-op
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_304_NOT_MODIFIED]

    @pytest.mark.asyncio
    async def test_change_role_with_invalid_role_name(self, client: AsyncClient, admin_token: str, regular_user: User):
        """Test changing user to invalid role"""
        response = await async_client.put(
            f"/api/admin/users/{regular_user.wallet_address}/role",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={"role": "superadmin"}
        )

        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    @pytest.mark.asyncio
    async def test_change_role_with_malformed_wallet(self, client: AsyncClient, admin_token: str):
        """Test changing role with invalid wallet address"""
        response = await async_client.put(
            "/api/admin/users/invalidwallet/role",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={"role": "admin"}
        )

        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    @pytest.mark.asyncio
    async def test_regular_user_cannot_access_admin_endpoints(self, client: AsyncClient, regular_user: User):
        """Test that regular users cannot access admin endpoints"""
        # Create token for regular user
        from app.auth.jwt import create_access_token
        token = create_access_token(
            data={"sub": str(regular_user.wallet_address), "role": "user"}
        )

        # Try to access admin dashboard
        response = await async_client.get(
            "/api/admin/dashboard",
            headers={"Authorization": f"Bearer {token}"}
        )

        assert response.status_code == status.HTTP_403_FORBIDDEN

    @pytest.mark.asyncio
    async def test_regular_user_cannot_change_roles(self, client: AsyncClient, regular_user: User):
        """Test that regular users cannot change roles"""
        from app.auth.jwt import create_access_token
        token = create_access_token(
            data={"sub": str(regular_user.wallet_address), "role": "user"}
        )

        response = await async_client.put(
            f"/api/admin/users/{regular_user.wallet_address}/role",
            headers={"Authorization": f"Bearer {token}"},
            json={"role": "admin"}
        )

        assert response.status_code == status.HTTP_403_FORBIDDEN
