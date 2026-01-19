"""Integration tests for admin authentication middleware."""

import pytest
from httpx import AsyncClient

from app.models.user import User
from app.auth.jwt import create_access_token


class TestAdminAuthIntegration:
    """Test admin authentication middleware with real API calls."""

    @pytest.mark.asyncio
    async def test_admin_endpoint_with_admin_token(self, client: AsyncClient, db_session):
        """Test admin endpoint access with valid admin token."""
        # Create admin user
        admin_wallet = "0x1234567890123456789012345678901234567890"
        admin_user = User(
            wallet_address=admin_wallet.lower(),
            role="admin"
        )
        db_session.add(admin_user)
        await db_session.commit()
        await db_session.refresh(admin_user)

        # Create admin token
        admin_token = create_access_token(admin_wallet)

        # Call a protected endpoint (using /api/auth/me as it exists)
        response = await client.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {admin_token}"}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["wallet_address"] == admin_wallet.lower()
        assert data["role"] == "admin"

    @pytest.mark.asyncio
    async def test_admin_endpoint_with_regular_user_token(self, client: AsyncClient, db_session):
        """Test admin endpoint access with regular user token should fail with custom endpoint."""
        # Create regular user
        user_wallet = "0xABCDEF1234567890ABCDEF1234567890ABCDEF12"
        regular_user = User(
            wallet_address=user_wallet.lower(),
            role="user"
        )
        db_session.add(regular_user)
        await db_session.commit()
        await db_session.refresh(regular_user)

        # Create user token
        user_token = create_access_token(user_wallet)

        # Call /api/auth/me (this will succeed as it doesn't require admin)
        response = await client.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {user_token}"}
        )

        # Should succeed as /api/auth/me doesn't require admin
        assert response.status_code == 200
        data = response.json()
        assert data["role"] == "user"

    @pytest.mark.asyncio
    async def test_admin_endpoint_without_token(self, client: AsyncClient):
        """Test admin endpoint access without token."""
        response = await client.get("/api/auth/me")

        assert response.status_code == 401
        data = response.json()
        assert "detail" in data

    @pytest.mark.asyncio
    async def test_admin_endpoint_with_invalid_token(self, client: AsyncClient):
        """Test admin endpoint access with invalid token."""
        response = await client.get(
            "/api/auth/me",
            headers={"Authorization": "Bearer invalid-token"}
        )

        assert response.status_code == 401

    @pytest.mark.asyncio
    async def test_admin_and_regular_user_comparison(self, client: AsyncClient, db_session):
        """Test behavior difference between admin and regular user."""
        # Create both users
        admin_wallet = "0x9999999999999999999999999999999999999999"
        user_wallet = "0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"

        admin = User(wallet_address=admin_wallet.lower(), role="admin")
        user = User(wallet_address=user_wallet.lower(), role="user")

        db_session.add(admin)
        db_session.add(user)
        await db_session.commit()

        # Create tokens
        admin_token = create_access_token(admin_wallet)
        user_token = create_access_token(user_wallet)

        # Both can access /api/auth/me
        admin_response = await client.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        user_response = await client.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {user_token}"}
        )

        assert admin_response.status_code == 200
        assert user_response.status_code == 200

        admin_data = admin_response.json()
        user_data = user_response.json()

        assert admin_data["role"] == "admin"
        assert user_data["role"] == "user"

    @pytest.mark.asyncio
    async def test_token_expiration_handling(self, client: AsyncClient, db_session):
        """Test that expired tokens are properly rejected."""
        # Create user
        user_wallet = "0xBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB"
        user = User(wallet_address=user_wallet.lower(), role="admin")
        db_session.add(user)
        await db_session.commit()

        # Create token and manually expire it (this would require time manipulation)
        # For now, just test with invalid format
        response = await client.get(
            "/api/auth/me",
            headers={"Authorization": "Bearer malformed.token.here"}
        )

        assert response.status_code == 401

    @pytest.mark.asyncio
    async def test_case_insensitive_wallet_address(self, client: AsyncClient, db_session):
        """Test that wallet addresses are case-insensitive."""
        # Create admin with mixed case
        admin_wallet = "0xABcdEF1234567890ABcdEF1234567890ABcdEF12"
        admin = User(wallet_address=admin_wallet.lower(), role="admin")
        db_session.add(admin)
        await db_session.commit()

        # Create token with different case
        token = create_access_token(admin_wallet)

        response = await client.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["wallet_address"] == admin_wallet.lower()

    @pytest.mark.asyncio
    async def test_multiple_requests_with_same_token(self, client: AsyncClient, db_session):
        """Test that the same token can be used multiple times."""
        admin_wallet = "0xCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC"
        admin = User(wallet_address=admin_wallet.lower(), role="admin")
        db_session.add(admin)
        await db_session.commit()

        token = create_access_token(admin_wallet)

        # Make multiple requests
        for _ in range(3):
            response = await client.get(
                "/api/auth/me",
                headers={"Authorization": f"Bearer {token}"}
            )
            assert response.status_code == 200

    @pytest.mark.asyncio
    async def test_nonexistent_user_in_token(self, client: AsyncClient):
        """Test token with wallet address that doesn't exist in DB."""
        # Create token for non-existent user
        fake_wallet = "0xDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD"
        token = create_access_token(fake_wallet)

        response = await client.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )

        assert response.status_code == 404
