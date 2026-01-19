"""Integration tests for authentication API endpoints."""

import pytest
from unittest.mock import patch, MagicMock
from sqlalchemy import select

from app.models.user import User


class TestLoginEndpoint:
    """Test POST /api/auth/login endpoint."""

    @pytest.mark.asyncio
    async def test_login_success_valid_signature(self, client: MagicMock, db_session: MagicMock):
        """Test successful login with valid signature."""
        # Mock Web3 signature verification
        with patch('app.api.routers.auth.verify_web3_signature', return_value=True):
            response = await client.post(
                "/api/auth/login",
                json={
                    "wallet_address": "0x1234567890123456789012345678901234567890",
                    "signature": "0xabcdef1234567890",
                    "message": "Welcome to gr8! Sign this message to authenticate."
                }
            )

        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert "wallet_address" in data

    @pytest.mark.asyncio
    async def test_login_invalid_signature(self, client: MagicMock):
        """Test login with invalid signature."""
        # Mock Web3 signature verification to fail
        with patch('app.api.routers.auth.verify_web3_signature', return_value=False):
            response = await client.post(
                "/api/auth/login",
                json={
                    "wallet_address": "0x1234567890123456789012345678901234567890",
                    "signature": "0xinvalid",
                    "message": "Welcome to gr8! Sign this message to authenticate."
                }
            )

        assert response.status_code == 401
        data = response.json()
        assert "detail" in data
        assert data["detail"] == "Invalid signature or wallet address"

    @pytest.mark.asyncio
    async def test_login_creates_new_user(self, client: MagicMock, db_session: MagicMock):
        """Test that login creates a new user if not exists."""
        # Create a first user so the test user becomes second (regular user)
        first_user = User(wallet_address="0xFirstUser123456789012345678901234567890", role="admin")
        db_session.add(first_user)
        await db_session.commit()

        wallet_address = "0xABCDEF1234567890ABCDEF1234567890ABCDEF12"

        # Mock Web3 signature verification
        with patch('app.api.routers.auth.verify_web3_signature', return_value=True):
            response = await client.post(
                "/api/auth/login",
                json={
                    "wallet_address": wallet_address,
                    "signature": "0xabcdef1234567890",
                    "message": "Welcome to gr8! Sign this message to authenticate."
                }
            )

        assert response.status_code == 200

        # Verify user was created in database
        result = await db_session.execute(
            select(User).where(User.wallet_address == wallet_address.lower())
        )
        user = result.scalar_one_or_none()
        assert user is not None
        assert user.role == "user"

    @pytest.mark.asyncio
    async def test_login_existing_user(self, client: MagicMock, db_session: MagicMock):
        """Test login with existing user."""
        wallet_address = "0x1234567890123456789012345678901234567890"

        # Create existing user
        existing_user = User(wallet_address=wallet_address.lower(), role="user")
        db_session.add(existing_user)
        await db_session.commit()
        await db_session.refresh(existing_user)

        # Mock Web3 signature verification
        with patch('app.api.routers.auth.verify_web3_signature', return_value=True):
            response = await client.post(
                "/api/auth/login",
                json={
                    "wallet_address": wallet_address,
                    "signature": "0xabcdef1234567890",
                    "message": "Welcome to gr8! Sign this message to authenticate."
                }
            )

        assert response.status_code == 200
        data = response.json()
        assert data["wallet_address"] == wallet_address.lower()

    @pytest.mark.asyncio
    async def test_login_default_message(self, client: MagicMock):
        """Test login with default message."""
        # Mock Web3 signature verification
        with patch('app.api.routers.auth.verify_web3_signature', return_value=True):
            response = await client.post(
                "/api/auth/login",
                json={
                    "wallet_address": "0x1234567890123456789012345678901234567890",
                    "signature": "0xabcdef1234567890"
                    # message should use default
                }
            )

        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data

    @pytest.mark.asyncio
    async def test_login_custom_message(self, client: MagicMock):
        """Test login with custom message."""
        custom_message = "Custom authentication message"

        # Mock Web3 signature verification
        with patch('app.api.routers.auth.verify_web3_signature', return_value=True):
            response = await client.post(
                "/api/auth/login",
                json={
                    "wallet_address": "0x1234567890123456789012345678901234567890",
                    "signature": "0xabcdef1234567890",
                    "message": custom_message
                }
            )

        assert response.status_code == 200

    @pytest.mark.asyncio
    async def test_login_address_normalization(self, client: MagicMock, db_session: MagicMock):
        """Test that wallet address is normalized to lowercase."""
        mixed_case_address = "0xABCDEFabcdef1234567890ABCDEFabcdef123456"

        # Mock Web3 signature verification
        with patch('app.api.routers.auth.verify_web3_signature', return_value=True):
            response = await client.post(
                "/api/auth/login",
                json={
                    "wallet_address": mixed_case_address,
                    "signature": "0xabcdef1234567890"
                }
            )

        assert response.status_code == 200

        # Verify stored address is lowercase
        result = await db_session.execute(
            select(User).where(User.wallet_address == mixed_case_address.lower())
        )
        user = result.scalar_one()
        assert user.wallet_address == mixed_case_address.lower()


class TestGetCurrentUserEndpoint:
    """Test GET /api/auth/me endpoint."""

    @pytest.mark.asyncio
    async def test_get_me_valid_token(self, client: MagicMock, db_session: MagicMock):
        """Test getting current user with valid token."""
        # Create a test user
        wallet_address = "0x1234567890123456789012345678901234567890"
        user = User(wallet_address=wallet_address.lower(), role="user")
        db_session.add(user)
        await db_session.commit()
        await db_session.refresh(user)

        # Create a valid JWT token
        from app.auth.jwt import create_access_token
        token = create_access_token(wallet_address)

        # Make request with Authorization header
        response = await client.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["wallet_address"] == wallet_address.lower()
        assert data["role"] == "user"

    @pytest.mark.asyncio
    async def test_get_me_missing_token(self, client: MagicMock):
        """Test getting current user without token."""
        response = await client.get("/api/auth/me")

        assert response.status_code == 401
        data = response.json()
        assert "detail" in data
        assert data["detail"] == "Authorization header required"

    @pytest.mark.asyncio
    async def test_get_me_invalid_token(self, client: MagicMock):
        """Test getting current user with invalid token."""
        response = await client.get(
            "/api/auth/me",
            headers={"Authorization": "Bearer invalid-token"}
        )

        assert response.status_code == 401
        data = response.json()
        assert "detail" in data
        assert data["detail"] == "Invalid or expired token"

    @pytest.mark.asyncio
    async def test_get_me_malformed_authorization_header(self, client: MagicMock):
        """Test with malformed Authorization header."""
        response = await client.get(
            "/api/auth/me",
            headers={"Authorization": "InvalidFormat token"}
        )

        assert response.status_code == 401
        data = response.json()
        assert "detail" in data

    @pytest.mark.asyncio
    async def test_get_me_user_not_found(self, client: MagicMock):
        """Test with valid token but user not found in database."""
        from app.auth.jwt import create_access_token

        # Create token for non-existent user
        wallet_address = "0x9999999999999999999999999999999999999999"
        token = create_access_token(wallet_address)

        response = await client.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )

        assert response.status_code == 404
        data = response.json()
        assert "detail" in data
        assert data["detail"] == "User not found"

    @pytest.mark.asyncio
    async def test_get_me_admin_user(self, client: MagicMock, db_session: MagicMock):
        """Test getting current admin user."""
        # Create an admin user
        wallet_address = "0x1234567890123456789012345678901234567890"
        user = User(wallet_address=wallet_address.lower(), role="admin")
        db_session.add(user)
        await db_session.commit()
        await db_session.refresh(user)

        # Create token
        from app.auth.jwt import create_access_token
        token = create_access_token(wallet_address)

        response = await client.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["wallet_address"] == wallet_address.lower()
        assert data["role"] == "admin"


class TestFirstUserAdminProvisioning:
    """Test first user automatic admin provisioning."""

    @pytest.mark.asyncio
    async def test_first_user_becomes_admin(self, client: MagicMock, db_session: MagicMock):
        """Test that the first user automatically becomes admin."""
        wallet_address = "0xFirstUser123456789012345678901234567890"

        # Mock Web3 signature verification
        with patch('app.api.routers.auth.verify_web3_signature', return_value=True):
            response = await client.post(
                "/api/auth/login",
                json={
                    "wallet_address": wallet_address,
                    "signature": "0xabcdef1234567890"
                }
            )

        assert response.status_code == 200
        data = response.json()

        # Verify first user gets admin role
        assert data["role"] == "admin"
        assert data["is_first_user"] is True

        # Verify in database
        result = await db_session.execute(
            select(User).where(User.wallet_address == wallet_address.lower())
        )
        user = result.scalar_one()
        assert user.role == "admin"

    @pytest.mark.asyncio
    async def test_second_user_becomes_regular_user(self, client: MagicMock, db_session: MagicMock):
        """Test that second user becomes regular user."""
        # Create first user (admin)
        first_user = User(wallet_address="0xFirstUser123456789012345678901234567890", role="admin")
        db_session.add(first_user)
        await db_session.commit()

        second_wallet = "0xSecondUser123456789012345678901234567890"

        # Mock Web3 signature verification
        with patch('app.api.routers.auth.verify_web3_signature', return_value=True):
            response = await client.post(
                "/api/auth/login",
                json={
                    "wallet_address": second_wallet,
                    "signature": "0xabcdef1234567890"
                }
            )

        assert response.status_code == 200
        data = response.json()

        # Verify second user gets regular user role
        assert data["role"] == "user"
        assert data["is_first_user"] is False

        # Verify in database
        result = await db_session.execute(
            select(User).where(User.wallet_address == second_wallet.lower())
        )
        user = result.scalar_one()
        assert user.role == "user"


class TestAuthFlowIntegration:
    """Test complete authentication flow."""

    @pytest.mark.asyncio
    async def test_complete_auth_flow(self, client: MagicMock, db_session: MagicMock):
        """Test complete login -> get me flow."""
        # Create a first user so the test user becomes second (regular user)
        first_user = User(wallet_address="0xFirstUser123456789012345678901234567890", role="admin")
        db_session.add(first_user)
        await db_session.commit()

        wallet_address = "0xABCDEF1234567890ABCDEF1234567890ABCDEF12"

        # Step 1: Login
        with patch('app.api.routers.auth.verify_web3_signature', return_value=True):
            login_response = await client.post(
                "/api/auth/login",
                json={
                    "wallet_address": wallet_address,
                    "signature": "0xabcdef1234567890"
                }
            )

        assert login_response.status_code == 200
        login_data = login_response.json()
        token = login_data["access_token"]

        # Step 2: Get current user with token
        me_response = await client.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )

        assert me_response.status_code == 200
        me_data = me_response.json()
        assert me_data["wallet_address"] == wallet_address.lower()
        assert me_data["role"] == "user"

        # Step 3: Verify user exists in database
        result = await db_session.execute(
            select(User).where(User.wallet_address == wallet_address.lower())
        )
        user = result.scalar_one()
        assert user.wallet_address == wallet_address.lower()
