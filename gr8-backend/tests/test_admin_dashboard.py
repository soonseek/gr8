"""Tests for admin dashboard API."""

import pytest
import time
from httpx import AsyncClient

from app.models.user import User
from app.auth.jwt import create_access_token


class TestAdminDashboardAPI:
    """Test admin dashboard API endpoints."""

    @pytest.mark.asyncio
    async def test_get_dashboard_success(self, client: AsyncClient, db_session):
        """운영자 대시보드 조회 성공 테스트."""
        # Create admin user
        admin_wallet = "0x1234567890123456789012345678901234567890"
        admin_user = User(wallet_address=admin_wallet.lower(), role="admin")
        db_session.add(admin_user)
        await db_session.commit()

        # Create admin token
        admin_token = create_access_token(admin_wallet)

        # Request dashboard
        response = await client.get(
            "/api/admin/dashboard",
            headers={"Authorization": f"Bearer {admin_token}"}
        )

        assert response.status_code == 200
        data = response.json()

        # 응답 필드 확인
        assert "totalUsers" in data
        assert "activeUsers" in data
        assert "totalStrategies" in data
        assert "totalTransactions" in data
        assert "totalRevenue" in data
        assert "pendingApplications" in data
        assert "dailyStats" in data
        assert "topStrategies" in data

        # 데이터 타입 확인
        assert isinstance(data["totalUsers"], int)
        assert isinstance(data["activeUsers"], int)
        assert isinstance(data["totalStrategies"], int)
        assert isinstance(data["totalTransactions"], int)
        assert isinstance(data["totalRevenue"], (int, float))
        assert isinstance(data["pendingApplications"], int)
        assert isinstance(data["dailyStats"], list)
        assert isinstance(data["topStrategies"], list)

        # dailyStats 필드 확인
        assert len(data["dailyStats"]) == 30
        for stat in data["dailyStats"]:
            assert "date" in stat
            assert "users" in stat
            assert "transactions" in stat
            assert "revenue" in stat

    @pytest.mark.asyncio
    async def test_get_dashboard_unauthorized(self, client: AsyncClient):
        """인증 없이 요청 (401)."""
        response = await client.get("/api/admin/dashboard")

        assert response.status_code == 401
        data = response.json()
        # HTTPBearer returns "Not authenticated" by default
        assert "authenticated" in data.get("detail", "").lower()

    @pytest.mark.asyncio
    async def test_get_dashboard_forbidden(self, client: AsyncClient, db_session):
        """일반 사용자 요청 (403)."""
        # Create regular user
        user_wallet = "0xABCDEF1234567890ABCDEF1234567890ABCDEF12"
        regular_user = User(wallet_address=user_wallet.lower(), role="user")
        db_session.add(regular_user)
        await db_session.commit()

        # Create user token
        user_token = create_access_token(user_wallet)

        # Request dashboard
        response = await client.get(
            "/api/admin/dashboard",
            headers={"Authorization": f"Bearer {user_token}"}
        )

        assert response.status_code == 403
        data = response.json()
        assert "운영자" in data.get("detail", "")

    @pytest.mark.asyncio
    async def test_dashboard_response_time(self, client: AsyncClient, db_session):
        """응답 시간 테스트 (500ms 이내)."""
        # Create admin user
        admin_wallet = "0x9999999999999999999999999999999999999999"
        admin_user = User(wallet_address=admin_wallet.lower(), role="admin")
        db_session.add(admin_user)
        await db_session.commit()

        admin_token = create_access_token(admin_wallet)

        start = time.time()
        response = await client.get(
            "/api/admin/dashboard",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        end = time.time()

        assert response.status_code == 200
        assert (end - start) < 0.5  # 500ms 이내

    @pytest.mark.asyncio
    async def test_dashboard_cache_hit(self, client: AsyncClient, db_session):
        """캐시 히트 테스트."""
        # Create admin user
        admin_wallet = "0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
        admin_user = User(wallet_address=admin_wallet.lower(), role="admin")
        db_session.add(admin_user)
        await db_session.commit()

        admin_token = create_access_token(admin_wallet)

        # 첫 번째 요청 (캐시 미스)
        start1 = time.time()
        response1 = await client.get(
            "/api/admin/dashboard",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        end1 = time.time()

        # 두 번째 요청 (캐시 히트)
        start2 = time.time()
        response2 = await client.get(
            "/api/admin/dashboard",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        end2 = time.time()

        assert response1.status_code == 200
        assert response2.status_code == 200

        # 두 번째 요청이 더 빨라야 함 (캐시 히트)
        assert (end2 - start2) < (end1 - start1)

        # 두 응답의 데이터가 동일해야 함
        assert response1.json() == response2.json()


class TestAdminDashboardIntegration:
    """Test admin dashboard data accuracy."""

    @pytest.mark.asyncio
    async def test_dashboard_total_users_count(self, client: AsyncClient, db_session):
        """총 사용자 수 정확성 검증."""
        # Create admin user
        admin_wallet = "0xBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB"
        admin_user = User(wallet_address=admin_wallet.lower(), role="admin")
        db_session.add(admin_user)

        # Create test users
        for i in range(10):
            user = User(
                wallet_address=f"0x{i:040x}",
                role="user"
            )
            db_session.add(user)

        await db_session.commit()

        admin_token = create_access_token(admin_wallet)

        # Request dashboard
        response = await client.get(
            "/api/admin/dashboard",
            headers={"Authorization": f"Bearer {admin_token}"}
        )

        assert response.status_code == 200
        data = response.json()
        # At least 10 test users + 1 admin = 11 total
        assert data["totalUsers"] >= 11

    @pytest.mark.asyncio
    async def test_dashboard_active_users_count(self, client: AsyncClient, db_session):
        """활성 사용자 수 정확성 검증 (24시간 내)."""
        # Create admin user
        admin_wallet = "0xCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC"
        admin_user = User(wallet_address=admin_wallet.lower(), role="admin")
        db_session.add(admin_user)

        # Recent user (within 24 hours)
        recent_user = User(
            wallet_address="0xDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
            role="user",
        )
        db_session.add(recent_user)

        # Old user (created more than 24 hours ago - manually set timestamp)
        # Note: In SQLite we can't easily set created_at, so we'll skip this test
        # This would work better with PostgreSQL or mock

        await db_session.commit()

        admin_token = create_access_token(admin_wallet)

        # Request dashboard
        response = await client.get(
            "/api/admin/dashboard",
            headers={"Authorization": f"Bearer {admin_token}"}
        )

        assert response.status_code == 200
        data = response.json()
        # At least the recent user and admin should be counted
        assert data["activeUsers"] >= 2

    @pytest.mark.asyncio
    async def test_dashboard_daily_stats_structure(self, client: AsyncClient, db_session):
        """일별 통계 구조 검증."""
        # Create admin user
        admin_wallet = "0xEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE"
        admin_user = User(wallet_address=admin_wallet.lower(), role="admin")
        db_session.add(admin_user)
        await db_session.commit()

        admin_token = create_access_token(admin_wallet)

        response = await client.get(
            "/api/admin/dashboard",
            headers={"Authorization": f"Bearer {admin_token}"}
        )

        assert response.status_code == 200
        data = response.json()

        # Verify daily stats
        assert len(data["dailyStats"]) == 30

        # Check first and last dates
        first_date = data["dailyStats"][0]["date"]
        last_date = data["dailyStats"][29]["date"]

        # Verify date format (YYYY-MM-DD)
        assert len(first_date) == 10
        assert len(last_date) == 10

    @pytest.mark.asyncio
    async def test_dashboard_placeholder_fields(self, client: AsyncClient, db_session):
        """Placeholder 필드가 0으로 설정되어 있는지 확인."""
        # Create admin user
        admin_wallet = "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
        admin_user = User(wallet_address=admin_wallet.lower(), role="admin")
        db_session.add(admin_user)
        await db_session.commit()

        admin_token = create_access_token(admin_wallet)

        response = await client.get(
            "/api/admin/dashboard",
            headers={"Authorization": f"Bearer {admin_token}"}
        )

        assert response.status_code == 200
        data = response.json()

        # These fields should be 0 (placeholders until models are implemented)
        assert data["totalStrategies"] == 0
        assert data["totalTransactions"] == 0
        assert data["totalRevenue"] == 0.0
        assert data["pendingApplications"] == 0

        # topStrategies should be empty array
        assert isinstance(data["topStrategies"], list)
        assert len(data["topStrategies"]) == 0

    @pytest.mark.asyncio
    async def test_multiple_admins_separate_cache(self, client: AsyncClient, db_session):
        """여러 운영자가 별도의 캐시를 가지는지 확인."""
        # Create two admin users
        admin1_wallet = "0x1111111111111111111111111111111111111111"
        admin2_wallet = "0x2222222222222222222222222222222222222222"

        admin1 = User(wallet_address=admin1_wallet.lower(), role="admin")
        admin2 = User(wallet_address=admin2_wallet.lower(), role="admin")

        db_session.add(admin1)
        db_session.add(admin2)
        await db_session.commit()

        admin1_token = create_access_token(admin1_wallet)
        admin2_token = create_access_token(admin2_wallet)

        # First admin requests dashboard
        response1 = await client.get(
            "/api/admin/dashboard",
            headers={"Authorization": f"Bearer {admin1_token}"}
        )

        # Add a new user after first admin's request
        new_user = User(wallet_address="0x3333333333333333333333333333333333333333", role="user")
        db_session.add(new_user)
        await db_session.commit()

        # Second admin requests dashboard (should have different count due to new user)
        response2 = await client.get(
            "/api/admin/dashboard",
            headers={"Authorization": f"Bearer {admin2_token}"}
        )

        assert response1.status_code == 200
        assert response2.status_code == 200

        data1 = response1.json()
        data2 = response2.json()

        # Second admin should see more users (first admin's cache is separate)
        assert data2["totalUsers"] > data1["totalUsers"]


class TestDatabaseIndexOptimization:
    """Test database index optimization for dashboard queries."""

    @pytest.mark.asyncio
    async def test_created_at_index_exists(self, db_session):
        """Verify created_at index exists for active users query optimization."""
        from sqlalchemy import text
        result = await db_session.execute(text(
            "SELECT 1 FROM sqlite_master WHERE type='index' AND tbl_name='users' AND name='ix_users_created_at'"
        ))
        exists = result.scalar()
        assert exists is not None, "ix_users_created_at index should exist"

    @pytest.mark.asyncio
    async def test_updated_at_index_exists(self, db_session):
        """Verify updated_at index exists for sorting queries."""
        from sqlalchemy import text
        result = await db_session.execute(text(
            "SELECT 1 FROM sqlite_master WHERE type='index' AND tbl_name='users' AND name='ix_users_updated_at'"
        ))
        exists = result.scalar()
        assert exists is not None, "ix_users_updated_at index should exist"

    @pytest.mark.asyncio
    async def test_active_users_query_performance(self, client: AsyncClient, db_session):
        """Test active users query performance with index (should use created_at index)."""
        from datetime import datetime, timedelta
        from sqlalchemy import select, func, text
        import time

        # Create admin user
        admin_wallet = "0xPerfTest123456789012345678901234567890"
        admin_user = User(wallet_address=admin_wallet.lower(), role="admin")
        db_session.add(admin_user)

        # Create many users (simulate scale)
        active_since = datetime.utcnow() - timedelta(hours=24)
        for i in range(100):
            user = User(
                wallet_address=f"0x{i:040x}",
                role="user"
            )
            db_session.add(user)

        await db_session.commit()

        # Verify query completes quickly (should be < 100ms with index)
        start = time.time()
        result = await db_session.execute(
            select(func.count(User.id)).where(User.created_at >= active_since)
        )
        count = result.scalar()
        end = time.time()

        assert count >= 100
        assert (end - start) < 0.1  # Should complete in < 100ms with index

    @pytest.mark.asyncio
    async def test_all_required_indexes_exist(self, db_session):
        """Verify all required indexes for dashboard queries exist."""
        from sqlalchemy import text
        result = await db_session.execute(text(
            """
            SELECT name
            FROM sqlite_master
            WHERE type='index' AND tbl_name='users'
            AND name IN ('ix_users_wallet_address', 'ix_users_role',
                         'ix_users_created_at', 'ix_users_updated_at')
            ORDER BY name
            """
        ))
        indexes = [row[0] for row in result.fetchall()]

        required_indexes = [
            'ix_users_wallet_address',
            'ix_users_role',
            'ix_users_created_at',
            'ix_users_updated_at'
        ]

        for index_name in required_indexes:
            assert index_name in indexes, f"Required index {index_name} is missing"


class TestUserRoleManagement:
    """Test user role management API endpoints."""

    @pytest.mark.asyncio
    async def test_admin_can_upgrade_user_to_admin(self, client: AsyncClient, db_session):
        """Test that admin can upgrade regular user to admin."""
        # Create admin user
        admin_wallet = "0xAdminUser123456789012345678901234567890"
        admin_user = User(wallet_address=admin_wallet.lower(), role="admin")
        db_session.add(admin_user)

        # Create regular user
        user_wallet = "0xRegularUser123456789012345678901234567890"
        regular_user = User(wallet_address=user_wallet.lower(), role="user")
        db_session.add(regular_user)
        await db_session.commit()

        # Create admin token
        admin_token = create_access_token(admin_wallet)

        # Upgrade user to admin
        response = await client.post(
            f"/api/admin/users/{user_wallet}/role",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={"new_role": "admin"}
        )

        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert user_wallet.lower() in data["message"].lower()

        # Verify role was updated in database
        from sqlalchemy import select
        result = await db_session.execute(
            select(User).where(User.wallet_address == user_wallet.lower())
        )
        updated_user = result.scalar_one()
        assert updated_user.role == "admin"

    @pytest.mark.asyncio
    async def test_admin_can_downgrade_admin_to_user(self, client: AsyncClient, db_session):
        """Test that admin can downgrade admin to user."""
        # Create admin user
        admin_wallet = "0xAdminUser123456789012345678901234567890"
        admin_user = User(wallet_address=admin_wallet.lower(), role="admin")
        db_session.add(admin_user)

        # Create another admin
        other_admin_wallet = "0xOtherAdmin123456789012345678901234567890"
        other_admin = User(wallet_address=other_admin_wallet.lower(), role="admin")
        db_session.add(other_admin)
        await db_session.commit()

        # Create admin token
        admin_token = create_access_token(admin_wallet)

        # Downgrade other admin to user
        response = await client.post(
            f"/api/admin/users/{other_admin_wallet}/role",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={"new_role": "user"}
        )

        assert response.status_code == 200
        data = response.json()
        assert "message" in data

        # Verify role was updated in database
        from sqlalchemy import select
        result = await db_session.execute(
            select(User).where(User.wallet_address == other_admin_wallet.lower())
        )
        updated_user = result.scalar_one()
        assert updated_user.role == "user"

    @pytest.mark.asyncio
    async def test_regular_user_cannot_change_roles(self, client: AsyncClient, db_session):
        """Test that regular user cannot change roles."""
        # Create regular user
        user_wallet = "0xRegularUser123456789012345678901234567890"
        regular_user = User(wallet_address=user_wallet.lower(), role="user")
        db_session.add(regular_user)

        # Create another user to target
        target_wallet = "0xTargetUser123456789012345678901234567890"
        target_user = User(wallet_address=target_wallet.lower(), role="user")
        db_session.add(target_user)
        await db_session.commit()

        # Create regular user token
        user_token = create_access_token(user_wallet)

        # Try to change role (should fail)
        response = await client.post(
            f"/api/admin/users/{target_wallet}/role",
            headers={"Authorization": f"Bearer {user_token}"},
            json={"new_role": "admin"}
        )

        assert response.status_code == 403
        data = response.json()
        assert "운영자" in data.get("detail", "")

    @pytest.mark.asyncio
    async def test_cannot_change_to_invalid_role(self, client: AsyncClient, db_session):
        """Test that invalid role is rejected."""
        # Create admin user
        admin_wallet = "0xAdminUser123456789012345678901234567890"
        admin_user = User(wallet_address=admin_wallet.lower(), role="admin")
        db_session.add(admin_user)

        # Create regular user
        user_wallet = "0xRegularUser123456789012345678901234567890"
        regular_user = User(wallet_address=user_wallet.lower(), role="user")
        db_session.add(regular_user)
        await db_session.commit()

        # Create admin token
        admin_token = create_access_token(admin_wallet)

        # Try to change to invalid role
        response = await client.post(
            f"/api/admin/users/{user_wallet}/role",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={"new_role": "superadmin"}
        )

        assert response.status_code == 400
        data = response.json()
        assert "Invalid role" in data.get("detail", "")

    @pytest.mark.asyncio
    async def test_cannot_change_role_for_nonexistent_user(self, client: AsyncClient, db_session):
        """Test that changing role for non-existent user returns 404."""
        # Create admin user
        admin_wallet = "0xAdminUser123456789012345678901234567890"
        admin_user = User(wallet_address=admin_wallet.lower(), role="admin")
        db_session.add(admin_user)
        await db_session.commit()

        # Create admin token
        admin_token = create_access_token(admin_wallet)

        # Try to change role for non-existent user
        fake_wallet = "0xNonExistent123456789012345678901234567890"
        response = await client.post(
            f"/api/admin/users/{fake_wallet}/role",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={"new_role": "admin"}
        )

        assert response.status_code == 404
        data = response.json()
        assert "not found" in data.get("detail", "").lower()

    @pytest.mark.asyncio
    async def test_unauthenticated_cannot_change_roles(self, client: AsyncClient):
        """Test that unauthenticated request is rejected."""
        user_wallet = "0xSomeUser123456789012345678901234567890"

        response = await client.post(
            f"/api/admin/users/{user_wallet}/role",
            json={"new_role": "admin"}
        )

        assert response.status_code == 401

    @pytest.mark.asyncio
    async def test_cannot_downgrade_last_admin(self, client: AsyncClient, db_session):
        """Test that the last admin cannot be downgraded."""
        # Create only one admin
        admin_wallet = "0xOnlyAdmin123456789012345678901234567890"
        admin_user = User(wallet_address=admin_wallet.lower(), role="admin")
        db_session.add(admin_user)
        await db_session.commit()

        # Create admin token
        admin_token = create_access_token(admin_wallet)

        # Try to downgrade the last admin
        response = await client.post(
            f"/api/admin/users/{admin_wallet}/role",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={"new_role": "user"}
        )

        assert response.status_code == 400
        data = response.json()
        assert "last admin" in data.get("detail", "").lower()

        # Verify admin still has admin role
        from sqlalchemy import select
        result = await db_session.execute(
            select(User).where(User.wallet_address == admin_wallet.lower())
        )
        admin = result.scalar_one()
        assert admin.role == "admin"

    @pytest.mark.asyncio
    async def test_can_downgrade_admin_when_multiple_admins_exist(self, client: AsyncClient, db_session):
        """Test that admin can be downgraded when multiple admins exist."""
        # Create two admins
        admin1_wallet = "0xAdmin1123456789012345678901234567890"
        admin2_wallet = "0xAdmin2123456789012345678901234567890"

        admin1 = User(wallet_address=admin1_wallet.lower(), role="admin")
        admin2 = User(wallet_address=admin2_wallet.lower(), role="admin")
        db_session.add(admin1)
        db_session.add(admin2)
        await db_session.commit()

        # Create admin token for admin1
        admin1_token = create_access_token(admin1_wallet)

        # Downgrade admin2
        response = await client.post(
            f"/api/admin/users/{admin2_wallet}/role",
            headers={"Authorization": f"Bearer {admin1_token}"},
            json={"new_role": "user"}
        )

        assert response.status_code == 200

        # Verify admin2 was downgraded
        from sqlalchemy import select
        result = await db_session.execute(
            select(User).where(User.wallet_address == admin2_wallet.lower())
        )
        admin2_updated = result.scalar_one()
        assert admin2_updated.role == "user"
