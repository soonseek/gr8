"""Integration tests for banned user access restrictions - Story 8-2 Task 8"""

import pytest
from datetime import datetime

from app.models.user import User
from httpx import AsyncClient, ASGITransport
from main import app
from app.auth.jwt import create_access_token


@pytest.mark.asyncio
async def test_banned_user_cannot_access_me_endpoint(
    client: AsyncClient,
    db_session
):
    """Test that banned users get 403 on GET /api/auth/me"""
    # Create a banned user
    banned_user = User(
        wallet_address="0xbanned123456789abc123def456789abcd",
        role="user",
        status="banned",
        suspension_reason="Violation of terms",
        banned_at=datetime.utcnow(),
        total_purchases=0,
        total_sales=0,
        strategy_count=0
    )
    db_session.add(banned_user)
    await db_session.commit()

    # Create token for banned user
    token = create_access_token(wallet_address=banned_user.wallet_address)

    # Try to access /api/auth/me
    response = await client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 403
    assert "차단된 사용자입니다" in response.json()["detail"]


@pytest.mark.asyncio
async def test_banned_user_cannot_refresh_token(
    client: AsyncClient,
    db_session
):
    """Test that banned users get 403 on POST /api/auth/refresh"""
    # Create a banned user
    banned_user = User(
        wallet_address="0xbanned987654321def987654321fedcba98765",
        role="user",
        status="banned",
        suspension_reason="Fraudulent activity",
        banned_at=datetime.utcnow(),
        total_purchases=0,
        total_sales=0,
        strategy_count=0
    )
    db_session.add(banned_user)
    await db_session.commit()

    # Create token for banned user
    token = create_access_token(wallet_address=banned_user.wallet_address)

    # Try to refresh token
    response = await client.post(
        "/api/auth/refresh",
        json={"token": token}
    )

    assert response.status_code == 403
    assert "차단된 사용자입니다" in response.json()["detail"]


@pytest.mark.asyncio
async def test_banned_user_cannot_access_admin_endpoints(
    client: AsyncClient,
    db_session
):
    """Test that banned admin users get 403 on admin endpoints"""
    # Create a banned admin user
    banned_admin = User(
        wallet_address="0xbannedadmin123456789abc123def456789abc",
        role="admin",
        status="banned",
        suspension_reason="Admin misconduct",
        banned_at=datetime.utcnow(),
        total_purchases=0,
        total_sales=0,
        strategy_count=0
    )
    db_session.add(banned_admin)
    await db_session.commit()

    # Create token for banned admin
    token = create_access_token(wallet_address=banned_admin.wallet_address)

    # Try to access admin dashboard
    response = await client.get(
        "/api/admin/dashboard",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 403
    assert "차단된 사용자입니다" in response.json()["detail"]


@pytest.mark.asyncio
async def test_suspended_user_can_still_access_endpoints(
    client: AsyncClient,
    db_session
):
    """Test that suspended users can still access endpoints (not banned)"""
    # Create a suspended user
    suspended_user = User(
        wallet_address="0xsuspended123456789abc123def456789abcd",
        role="user",
        status="suspended",
        suspension_reason="Temporary violation",
        suspended_at=datetime.utcnow(),
        total_purchases=0,
        total_sales=0,
        strategy_count=0
    )
    db_session.add(suspended_user)
    await db_session.commit()

    # Create token for suspended user
    token = create_access_token(wallet_address=suspended_user.wallet_address)

    # Should be able to access /api/auth/me
    response = await client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["wallet_address"] == suspended_user.wallet_address
