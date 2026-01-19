"""Integration tests for Admin User Management API endpoints - Story 8-2"""

import pytest
from decimal import Decimal
from datetime import datetime

from app.models.user import User


@pytest.mark.asyncio
async def test_get_users_list_success(
    admin_client,
    admin_user: User,
    db_session
):
    """Test GET /api/admin/users returns paginated user list."""
    # Create test users
    for i in range(10):
        user = User(
            wallet_address=f"0x{'0' * 39}{i}",
            role="user",
            status="active",
            total_purchases=Decimal(f"{i * 100}.5"),
            total_sales=Decimal(f"{i * 50}.25"),
            strategy_count=i
        )
        db_session.add(user)

    await db_session.commit()

    # Make request
    response = await admin_client.get("/api/admin/users")

    assert response.status_code == 200
    data = response.json()

    # Verify response structure
    assert "users" in data
    assert "total" in data
    assert "page" in data
    assert "limit" in data
    assert "total_pages" in data

    # Verify pagination
    assert data["page"] == 1
    assert data["limit"] == 50
    assert data["total"] >= 10
    assert len(data["users"]) >= 10

    # Verify user data structure
    first_user = data["users"][0]
    assert "wallet_address" in first_user
    assert "ens_domain" in first_user
    assert "created_at" in first_user
    assert "status" in first_user
    assert "total_purchases" in first_user
    assert "total_sales" in first_user
    assert "strategy_count" in first_user


@pytest.mark.asyncio
async def test_get_users_list_pagination(
    admin_client,
    db_session
):
    """Test pagination works correctly."""
    # Create 25 test users
    for i in range(25):
        user = User(
            wallet_address=f"0x{'1' * 38}{i:02d}",
            role="user",
            status="active",
            total_purchases=Decimal("100"),
            total_sales=Decimal("50"),
            strategy_count=1
        )
        db_session.add(user)

    await db_session.commit()

    # Test page 1 with limit 10
    response = await admin_client.get("/api/admin/users?page=1&limit=10")

    assert response.status_code == 200
    data = response.json()
    assert len(data["users"]) == 10
    assert data["page"] == 1
    assert data["limit"] == 10
    assert data["total_pages"] == 3  # 25 users / 10 per page = 3 pages


@pytest.mark.asyncio
async def test_get_users_list_status_filter(
    admin_client,
    db_session
):
    """Test status filtering works correctly."""
    # Create users with different statuses
    for i, status in enumerate(["active", "suspended", "banned"] * 3):
        user = User(
            wallet_address=f"0x{'2' * 38}{i:02d}",
            role="user",
            status=status,
            total_purchases=Decimal("100"),
            total_sales=Decimal("50"),
            strategy_count=1
        )
        db_session.add(user)

    await db_session.commit()

    # Test filter by 'active'
    response = await admin_client.get("/api/admin/users?status_filter=active")

    assert response.status_code == 200
    data = response.json()

    # All returned users should be active
    for user in data["users"]:
        assert user["status"] == "active"


@pytest.mark.asyncio
async def test_get_users_list_search_by_wallet(
    admin_client,
    db_session
):
    """Test search by wallet address."""
    # Create users
    test_user = User(
        wallet_address="0xabc123def456789abc123def456789abc12345",
        role="user",
        status="active",
        total_purchases=Decimal("100"),
        total_sales=Decimal("50"),
        strategy_count=1
    )
    db_session.add(test_user)

    other_user = User(
        wallet_address="0x9999999999999999999999999999999999999999",
        role="user",
        status="active",
        total_purchases=Decimal("100"),
        total_sales=Decimal("50"),
        strategy_count=1
    )
    db_session.add(other_user)

    await db_session.commit()

    # Search for 'abc123'
    response = await admin_client.get("/api/admin/users?search=abc123")

    assert response.status_code == 200
    data = response.json()

    # Should find the user with 'abc123' in wallet address
    assert len(data["users"]) >= 1
    found = any("abc123" in user["wallet_address"] for user in data["users"])
    assert found


@pytest.mark.asyncio
async def test_get_users_list_invalid_status_filter(
    admin_client
):
    """Test invalid status filter returns 400."""
    response = await admin_client.get("/api/admin/users?status_filter=invalid")

    assert response.status_code == 400
    assert "Invalid status filter" in response.json()["detail"]


@pytest.mark.asyncio
async def test_get_user_detail_success(
    admin_client,
    admin_user: User,
    db_session
):
    """Test GET /api/admin/users/{wallet_address} returns user details."""
    # Create test user
    test_user = User(
        wallet_address="0xtestuser123456789abc123def456789abc123",
        role="user",
        status="active",
        total_purchases=Decimal("500.25"),
        total_sales=Decimal("250.50"),
        strategy_count=3,
        ens_domain="testuser.eth"
    )
    db_session.add(test_user)
    await db_session.commit()

    response = await admin_client.get(f"/api/admin/users/{test_user.wallet_address}")

    assert response.status_code == 200
    data = response.json()

    assert data["wallet_address"] == test_user.wallet_address
    assert data["ens_domain"] == "testuser.eth"
    assert data["role"] == "user"
    assert data["status"] == "active"
    assert data["total_purchases"] == "500.25"
    assert data["total_sales"] == "250.50"
    assert data["strategy_count"] == 3


@pytest.mark.asyncio
async def test_get_user_detail_not_found(
    admin_client
):
    """Test GET /api/admin/users/{wallet_address} returns 404 for non-existent user."""
    response = await admin_client.get("/api/admin/users/0xnonexistent")

    assert response.status_code == 404
    assert "not found" in response.json()["detail"]


@pytest.mark.asyncio
async def test_get_user_activity_success(
    admin_client,
    db_session
):
    """Test GET /api/admin/users/{wallet_address}/activity returns user activities."""
    # Create user with transactions
    from app.models.revenue_transaction import RevenueTransaction

    test_user = User(
        wallet_address="0xactivitytest123456789abc123def456789",
        role="user",
        status="active",
        total_purchases=Decimal("0"),
        total_sales=Decimal("0"),
        strategy_count=0
    )
    db_session.add(test_user)

    # Create purchase
    from app.models.strategy import Strategy
    strategy = Strategy(
        id="test_strategy_1",
        creator_address="0xother123456789abc123def456789abcd",
        name="Test Strategy"
    )
    db_session.add(strategy)

    purchase = RevenueTransaction(
        strategy_id="test_strategy_1",
        creator_address="0xother123456789abc123def456789abcd",
        buyer_address=test_user.wallet_address,
        amount=Decimal("100")
    )
    db_session.add(purchase)

    await db_session.commit()

    response = await admin_client.get(f"/api/admin/users/{test_user.wallet_address}/activity")

    assert response.status_code == 200
    data = response.json()

    assert "activities" in data
    assert "total" in data
    assert len(data["activities"]) >= 1

    # Check first activity
    first_activity = data["activities"][0]
    assert "type" in first_activity
    assert "amount" in first_activity
    assert "created_at" in first_activity


@pytest.mark.asyncio
async def test_get_user_strategies_success(
    admin_client,
    db_session
):
    """Test GET /api/admin/users/{wallet_address}/strategies returns user's strategies."""
    from app.models.strategy import Strategy

    # Create user with strategies
    test_user = User(
        wallet_address="0xstrategymaker123456789abc123def456789",
        role="user",
        status="active",
        total_purchases=Decimal("0"),
        total_sales=Decimal("0"),
        strategy_count=0
    )
    db_session.add(test_user)

    # Create strategies
    for i in range(3):
        strategy = Strategy(
            id=f"test_strategy_{i}",
            creator_address=test_user.wallet_address,
            name=f"Test Strategy {i}",
            description=f"Description {i}",
            is_published=(i % 2 == 0)  # Alternate published status
        )
        db_session.add(strategy)

    await db_session.commit()

    response = await admin_client.get(f"/api/admin/users/{test_user.wallet_address}/strategies")

    assert response.status_code == 200
    data = response.json()

    assert "strategies" in data
    assert "total" in data
    assert len(data["strategies"]) == 3

    # Check first strategy
    first_strategy = data["strategies"][0]
    assert "id" in first_strategy
    assert "name" in first_strategy
    assert "is_published" in first_strategy


@pytest.mark.asyncio
async def test_get_user_audit_logs_stub(
    admin_client,
    db_session
):
    """Test GET /api/admin/users/{wallet_address}/audit-logs returns empty list (stub)."""
    test_user = User(
        wallet_address="0xauditlogtest123456789abc123def456789",
        role="user",
        status="active",
        total_purchases=Decimal("0"),
        total_sales=Decimal("0"),
        strategy_count=0
    )
    db_session.add(test_user)
    await db_session.commit()

    response = await admin_client.get(f"/api/admin/users/{test_user.wallet_address}/audit-logs")

    assert response.status_code == 200
    data = response.json()

    # Should return empty list (audit_logs table not implemented yet)
    assert data["logs"] == []
    assert data["total"] == 0


@pytest.mark.asyncio
async def test_update_user_status_to_suspended(
    admin_client,
    db_session
):
    """Test PUT /api/admin/users/{wallet_address}/status - suspend user."""
    test_user = User(
        wallet_address="0xsuspendtest123456789abc123def456789",
        role="user",
        status="active",
        total_purchases=Decimal("0"),
        total_sales=Decimal("0"),
        strategy_count=0
    )
    db_session.add(test_user)
    await db_session.commit()

    # Suspend user with reason
    response = await admin_client.put(
        f"/api/admin/users/{test_user.wallet_address}/status",
        json={
            "status": "suspended",
            "reason": "Violated community guidelines"
        }
    )

    assert response.status_code == 200
    data = response.json()

    assert "message" in data
    assert "suspended" in data["message"].lower()
    assert "user_detail" in data

    # Verify user_detail
    user_detail = data["user_detail"]
    assert user_detail["status"] == "suspended"
    assert user_detail["suspension_reason"] == "Violated community guidelines"
    assert user_detail["suspended_at"] is not None
    assert user_detail["banned_at"] is None


@pytest.mark.asyncio
async def test_update_user_status_to_banned(
    admin_client,
    db_session
):
    """Test PUT /api/admin/users/{wallet_address}/status - ban user."""
    test_user = User(
        wallet_address="0xbantest123456789abc123def456789abcd",
        role="user",
        status="active",
        total_purchases=Decimal("0"),
        total_sales=Decimal("0"),
        strategy_count=0
    )
    db_session.add(test_user)
    await db_session.commit()

    # Ban user with reason
    response = await admin_client.put(
        f"/api/admin/users/{test_user.wallet_address}/status",
        json={
            "status": "banned",
            "reason": "Fraudulent activity detected"
        }
    )

    assert response.status_code == 200
    data = response.json()

    assert "message" in data
    assert "banned" in data["message"].lower()

    # Verify user_detail
    user_detail = data["user_detail"]
    assert user_detail["status"] == "banned"
    assert user_detail["suspension_reason"] == "Fraudulent activity detected"
    assert user_detail["banned_at"] is not None
    assert user_detail["suspended_at"] is None


@pytest.mark.asyncio
async def test_update_user_status_to_active(
    admin_client,
    db_session
):
    """Test PUT /api/admin/users/{wallet_address}/status - reactivate user."""
    test_user = User(
        wallet_address="0xreactivatetest123456789abc123def456789",
        role="user",
        status="suspended",
        suspension_reason="Previous violation",
        suspended_at=datetime.utcnow(),
        total_purchases=Decimal("0"),
        total_sales=Decimal("0"),
        strategy_count=0
    )
    db_session.add(test_user)
    await db_session.commit()

    # Reactivate user
    response = await admin_client.put(
        f"/api/admin/users/{test_user.wallet_address}/status",
        json={
            "status": "active"
        }
    )

    assert response.status_code == 200
    data = response.json()

    assert "message" in data
    assert "active" in data["message"].lower()

    # Verify user_detail
    user_detail = data["user_detail"]
    assert user_detail["status"] == "active"
    assert user_detail["suspension_reason"] is None
    assert user_detail["suspended_at"] is None
    assert user_detail["banned_at"] is None


@pytest.mark.asyncio
async def test_update_user_status_missing_reason_for_suspended(
    admin_client,
    db_session
):
    """Test PUT /api/admin/users/{wallet_address}/status - missing reason for suspended."""
    test_user = User(
        wallet_address="0xnoreason123456789abc123def456789abc",
        role="user",
        status="active",
        total_purchases=Decimal("0"),
        total_sales=Decimal("0"),
        strategy_count=0
    )
    db_session.add(test_user)
    await db_session.commit()

    # Try to suspend without reason
    response = await admin_client.put(
        f"/api/admin/users/{test_user.wallet_address}/status",
        json={
            "status": "suspended"
            # Missing reason
        }
    )

    assert response.status_code == 400
    assert "Reason is required" in response.json()["detail"]


@pytest.mark.asyncio
async def test_update_user_status_invalid_status(
    admin_client,
    db_session
):
    """Test PUT /api/admin/users/{wallet_address}/status - invalid status."""
    test_user = User(
        wallet_address="0xinvalidstatus123456789abc123def456789",
        role="user",
        status="active",
        total_purchases=Decimal("0"),
        total_sales=Decimal("0"),
        strategy_count=0
    )
    db_session.add(test_user)
    await db_session.commit()

    # Try invalid status
    response = await admin_client.put(
        f"/api/admin/users/{test_user.wallet_address}/status",
        json={
            "status": "invalid_status"
        }
    )

    assert response.status_code == 400
    assert "Invalid status" in response.json()["detail"]


@pytest.mark.asyncio
async def test_update_user_status_user_not_found(
    admin_client
):
    """Test PUT /api/admin/users/{wallet_address}/status - user not found."""
    response = await admin_client.put(
        "/api/admin/users/0xnonexistent/status",
        json={
            "status": "suspended",
            "reason": "Test reason"
        }
    )

    assert response.status_code == 404
    assert "not found" in response.json()["detail"]
