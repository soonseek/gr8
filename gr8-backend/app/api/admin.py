"""Admin dashboard API endpoints."""

import logging
from datetime import datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel, Field
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.core.cache import cache
from app.models.user import User
from app.models.strategy import Strategy
from app.models.revenue_transaction import RevenueTransaction
from app.schemas.admin import (
    AdminDashboardResponse,
    DailyStats,
    TopStrategy,
)
from app.middleware.admin_auth import verify_admin_token

router = APIRouter(prefix="/api/admin", tags=["admin"])

logger = logging.getLogger(__name__)


# User Management Schemas
class UserSummary(BaseModel):
    """Summary information for a user in the list view."""

    wallet_address: str = Field(..., description="User's wallet address")
    ens_domain: Optional[str] = Field(None, description="ENS domain if available")
    created_at: datetime = Field(..., description="Account creation date")
    status: str = Field(..., description="User status (active/suspended/banned)")
    total_purchases: Decimal = Field(..., description="Total purchase amount")
    total_sales: Decimal = Field(..., description="Total sales amount")
    strategy_count: int = Field(..., description="Number of strategies created")


class UserListResponse(BaseModel):
    """Response schema for paginated user list."""

    users: List[UserSummary] = Field(..., description="List of users")
    total: int = Field(..., description="Total number of users matching filter")
    page: int = Field(..., description="Current page number")
    limit: int = Field(..., description="Number of users per page")
    total_pages: int = Field(..., description="Total number of pages")


# User Detail Schemas
class UserDetailResponse(BaseModel):
    """Complete user detail information."""

    wallet_address: str = Field(..., description="User's wallet address")
    ens_domain: Optional[str] = Field(None, description="ENS domain if available")
    role: str = Field(..., description="User role (user/admin)")
    status: str = Field(..., description="User status (active/suspended/banned)")
    suspension_reason: Optional[str] = Field(None, description="Reason for suspension/ban")
    suspended_at: Optional[datetime] = Field(None, description="Suspension date")
    banned_at: Optional[datetime] = Field(None, description="Ban date")
    created_at: datetime = Field(..., description="Account creation date")
    updated_at: datetime = Field(..., description="Last update date")
    total_purchases: Decimal = Field(..., description="Total purchase amount")
    total_sales: Decimal = Field(..., description="Total sales amount")
    strategy_count: int = Field(..., description="Number of strategies created")


class ActivityItem(BaseModel):
    """Single activity item."""

    type: str = Field(..., description="Activity type (purchase/sale/backtest)")
    description: str = Field(..., description="Activity description")
    amount: Optional[Decimal] = Field(None, description="Transaction amount")
    created_at: datetime = Field(..., description="Activity date")


class ActivityResponse(BaseModel):
    """Response schema for user activity."""

    activities: List[ActivityItem] = Field(..., description="List of activities")
    total: int = Field(..., description="Total number of activities")


class StrategyListItem(BaseModel):
    """Strategy item in user's strategy list."""

    id: str = Field(..., description="Strategy ID")
    name: Optional[str] = Field(None, description="Strategy name")
    description: Optional[str] = Field(None, description="Strategy description")
    is_published: bool = Field(..., description="Whether strategy is published")
    created_at: datetime = Field(..., description="Strategy creation date")


class UserStrategiesResponse(BaseModel):
    """Response schema for user's strategies."""

    strategies: List[StrategyListItem] = Field(..., description="List of strategies")
    total: int = Field(..., description="Total number of strategies")


class AuditLogItem(BaseModel):
    """Single audit log item."""

    id: int = Field(..., description="Log ID")
    admin_address: str = Field(..., description="Admin who performed action")
    action: str = Field(..., description="Action performed")
    target_user: str = Field(..., description="Target user wallet address")
    old_value: Optional[str] = Field(None, description="Previous value")
    new_value: Optional[str] = Field(None, description="New value")
    created_at: datetime = Field(..., description="Log timestamp")


class AuditLogResponse(BaseModel):
    """Response schema for user audit logs."""

    logs: List[AuditLogItem] = Field(..., description="List of audit logs")
    total: int = Field(..., description="Total number of logs")


# User Status Change Schemas
class UserStatusUpdateRequest(BaseModel):
    """Request schema for updating user status."""

    status: str = Field(..., description="New status (active/suspended/banned)")
    reason: Optional[str] = Field(None, description="Reason for suspension/ban (required for suspended/banned)")


class UserStatusUpdateResponse(BaseModel):
    """Response schema for user status update."""

    message: str = Field(..., description="Success message")
    user_detail: UserDetailResponse = Field(..., description="Updated user detail")


class RoleUpdateRequest(BaseModel):
    """Request schema for updating user role."""

    new_role: str = Field(..., description="New role (user/admin)")


class RoleUpdateResponse(BaseModel):
    """Response schema for role update."""

    message: str = Field(..., description="Success message")


@router.get("/dashboard", response_model=AdminDashboardResponse)
async def get_admin_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(verify_admin_token),
) -> AdminDashboardResponse:
    """
    운영자 대시보드 데이터를 반환합니다.

    Args:
        db: 데이터베이스 세션
        current_user: 인증된 운영자 사용자

    Returns:
        AdminDashboardResponse: 요약 카드, 일별 통계, 인기 전략

    Raises:
        HTTPException 401: 인증되지 않은 경우
        HTTPException 403: 운영자 권한이 없는 경우
        HTTPException 500: 서버 에러
    """
    try:
        # 캐시 키 생성
        cache_key = f"admin_dashboard_{current_user.wallet_address}"

        # 캐시된 데이터 확인
        cached_data = await cache.get(cache_key)
        if cached_data:
            logger.info(f"Cache hit for dashboard: {current_user.wallet_address}")
            return AdminDashboardResponse(**cached_data)

        logger.info(f"Cache miss, calculating dashboard: {current_user.wallet_address}")

        # 캐시 미스시 데이터 계산
        dashboard_data = await _calculate_dashboard_data(db)

        # 캐시 저장 (5분 TTL)
        await cache.set(cache_key, dashboard_data.model_dump(), ttl=300)

        return dashboard_data

    except Exception as e:
        logger.error(f"Error fetching dashboard data: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"대시보드 데이터 로딩 중 오류가 발생했습니다: {str(e)}"
        )


async def _calculate_dashboard_data(
    db: AsyncSession
) -> AdminDashboardResponse:
    """
    대시보드 데이터를 계산합니다.

    Args:
        db: 데이터베이스 세션

    Returns:
        AdminDashboardResponse: 계산된 대시보드 데이터
    """
    # 1. 총 사용자 수
    total_users_result = await db.execute(select(func.count(User.id)))
    total_users = total_users_result.scalar() or 0

    # 2. 활성 사용자 수 (24시간 내 생성된 사용자)
    active_since = datetime.utcnow() - timedelta(hours=24)
    active_users_result = await db.execute(
        select(func.count(User.id)).where(User.created_at >= active_since)
    )
    active_users = active_users_result.scalar() or 0

    # 3-6. Mock 데이터 (TODO: Strategy, Transaction, PartnerApplication 모델 구현 후 실제 데이터 사용)
    total_strategies = 87  # Mock 데이터
    total_transactions = 15420  # Mock 데이터
    total_revenue = 125500.0  # Mock 데이터 (USDC)
    pending_applications = 12  # Mock 데이터

    # 7. 일별 통계 (30일) - Mock 데이터
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)

    # Mock 데이터 생성 (실제 데이터는 TODO 이후 구현)
    daily_stats: List[DailyStats] = []
    base_users = 1200
    base_transactions = 500
    base_revenue = 40000

    for i in range(30):
        date = thirty_days_ago + timedelta(days=i)
        # 점진적 증가 패턴
        growth_factor = 1 + (i * 0.05)  # 5% 성장률

        daily_stats.append(
            DailyStats(
                date=date.strftime("%Y-%m-%d"),
                users=int(base_users * growth_factor),
                transactions=int(base_transactions * growth_factor),
                revenue=base_revenue * growth_factor,
            )
        )

    # 8. Top 5 판매 전략 - Mock 데이터
    top_strategies: List[TopStrategy] = [
        TopStrategy(id="str-1", name="RSI Momentum Strategy", sales=156),
        TopStrategy(id="str-2", name="MACD Crossover Bot", sales=142),
        TopStrategy(id="str-3", name="Bollinger Bands Scalper", sales=128),
        TopStrategy(id="str-4", name="Grid Trading Pro", sales=95),
        TopStrategy(id="str-5", name="DCA Accumulator", sales=87),
    ]

    return AdminDashboardResponse(
        totalUsers=total_users,
        activeUsers=active_users,
        totalStrategies=total_strategies,
        totalTransactions=total_transactions,
        totalRevenue=total_revenue,
        pendingApplications=pending_applications,
        dailyStats=daily_stats,
        topStrategies=top_strategies,
    )


@router.post("/users/{wallet_address}/role", response_model=RoleUpdateResponse, status_code=status.HTTP_200_OK)
async def update_user_role(
    wallet_address: str,
    request: RoleUpdateRequest,
    current_admin: User = Depends(verify_admin_token),
    db: AsyncSession = Depends(get_db)
) -> RoleUpdateResponse:
    """
    사용자 역할 변경 (운영자 전용).

    운영자는 다른 사용자의 역할을 user/admin으로 변경할 수 있습니다.

    Args:
        wallet_address: 역할을 변경할 사용자의 지갑 주소
        request: new_role 필드를 포함한 요청
        current_admin: 인증된 운영자 (verify_admin_token 미들웨어)
        db: 데이터베이스 세션

    Returns:
        RoleUpdateResponse: 성공 메시지

    Raises:
        HTTPException 400: 잘못된 역할 값
        HTTPException 403: 운영자 권한 없음
        HTTPException 404: 사용자를 찾을 수 없음
    """
    # Validate role
    if request.new_role not in ['user', 'admin']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role. Must be 'user' or 'admin'"
        )

    # Find target user
    normalized_address = wallet_address.lower()
    result = await db.execute(
        select(User).where(User.wallet_address == normalized_address)
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User {wallet_address} not found"
        )

    # Prevent downgrading the last admin
    if user.role == 'admin' and request.new_role == 'user':
        # Count total admins
        admin_count_result = await db.execute(
            select(func.count(User.id)).where(User.role == 'admin')
        )
        admin_count = admin_count_result.scalar() or 0

        if admin_count <= 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot downgrade the last admin. At least one admin must remain."
            )

    # Update role
    user.role = request.new_role
    await db.commit()

    logger.info(
        f"Admin {current_admin.wallet_address} updated user {wallet_address} role to {request.new_role}"
    )

    return RoleUpdateResponse(
        message=f"User {wallet_address} role updated to {request.new_role}"
    )


@router.get("/users/{wallet_address}", response_model=UserDetailResponse)
async def get_user_detail(
    wallet_address: str,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(verify_admin_token),
) -> UserDetailResponse:
    """
    사용자 상세 정보를 반환합니다 (운영자 전용).

    Args:
        wallet_address: 조회할 사용자의 지갑 주소
        db: 데이터베이스 세션
        current_admin: 인증된 운영자

    Returns:
        UserDetailResponse: 사용자 상세 정보

    Raises:
        HTTPException 404: 사용자를 찾을 수 없음
    """
    try:
        # Find user
        normalized_address = wallet_address.lower()
        result = await db.execute(
            select(User).where(User.wallet_address == normalized_address)
        )
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User {wallet_address} not found"
            )

        return UserDetailResponse(
            wallet_address=user.wallet_address,
            ens_domain=user.ens_domain,
            role=user.role,
            status=user.status,
            suspension_reason=user.suspension_reason,
            suspended_at=user.suspended_at,
            banned_at=user.banned_at,
            created_at=user.created_at,
            updated_at=user.updated_at,
            total_purchases=user.total_purchases or Decimal('0'),
            total_sales=user.total_sales or Decimal('0'),
            strategy_count=user.strategy_count or 0
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching user detail: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"사용자 상세 정보 로딩 중 오류가 발생했습니다: {str(e)}"
        )


@router.get("/users/{wallet_address}/activity", response_model=ActivityResponse)
async def get_user_activity(
    wallet_address: str,
    limit: int = Query(100, ge=1, le=100, description="Number of activities to return"),
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(verify_admin_token),
) -> ActivityResponse:
    """
    사용자 활동 내역을 반환합니다 (운영자 전용).

    Args:
        wallet_address: 조회할 사용자의 지갑 주소
        limit: 반환할 활동 수 (최대 100)
        db: 데이터베이스 세션
        current_admin: 인증된 운영자

    Returns:
        ActivityResponse: 활동 내역 (구매, 판매)

    Raises:
        HTTPException 404: 사용자를 찾을 수 없음
    """
    try:
        normalized_address = wallet_address.lower()

        # Verify user exists
        user_result = await db.execute(
            select(User).where(User.wallet_address == normalized_address)
        )
        user = user_result.scalar_one_or_none()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User {wallet_address} not found"
            )

        # Get purchase activities
        purchase_result = await db.execute(
            select(RevenueTransaction)
            .where(RevenueTransaction.buyer_address == normalized_address)
            .order_by(RevenueTransaction.created_at.desc())
            .limit(limit)
        )
        purchases = purchase_result.scalars().all()

        # Get sale activities
        sale_result = await db.execute(
            select(RevenueTransaction)
            .where(RevenueTransaction.creator_address == normalized_address)
            .order_by(RevenueTransaction.created_at.desc())
            .limit(limit)
        )
        sales = sale_result.scalars().all()

        # Combine and sort by date
        activities = []

        for purchase in purchases:
            activities.append(
                ActivityItem(
                    type="purchase",
                    description=f"Strategy purchase",
                    amount=purchase.amount,
                    created_at=purchase.created_at
                )
            )

        for sale in sales:
            activities.append(
                ActivityItem(
                    type="sale",
                    description=f"Strategy sale",
                    amount=sale.amount,
                    created_at=sale.created_at
                )
            )

        # Sort by created_at descending and take top 'limit'
        activities.sort(key=lambda x: x.created_at, reverse=True)
        activities = activities[:limit]

        return ActivityResponse(
            activities=activities,
            total=len(activities)
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching user activity: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"활동 내역 로딩 중 오류가 발생했습니다: {str(e)}"
        )


@router.get("/users/{wallet_address}/strategies", response_model=UserStrategiesResponse)
async def get_user_strategies(
    wallet_address: str,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(verify_admin_token),
) -> UserStrategiesResponse:
    """
    사용자의 전략 목록을 반환합니다 (운영자 전용).

    Args:
        wallet_address: 조회할 사용자의 지갑 주소
        db: 데이터베이스 세션
        current_admin: 인증된 운영자

    Returns:
        UserStrategiesResponse: 전략 목록

    Raises:
        HTTPException 404: 사용자를 찾을 수 없음
    """
    try:
        normalized_address = wallet_address.lower()

        # Verify user exists
        user_result = await db.execute(
            select(User).where(User.wallet_address == normalized_address)
        )
        user = user_result.scalar_one_or_none()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User {wallet_address} not found"
            )

        # Get user's strategies
        strategies_result = await db.execute(
            select(Strategy)
            .where(Strategy.creator_address == normalized_address)
            .order_by(Strategy.created_at.desc())
        )
        strategies = strategies_result.scalars().all()

        strategy_list = [
            StrategyListItem(
                id=strategy.id,
                name=strategy.name,
                description=strategy.description,
                is_published=strategy.is_published,
                created_at=strategy.created_at
            )
            for strategy in strategies
        ]

        return UserStrategiesResponse(
            strategies=strategy_list,
            total=len(strategy_list)
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching user strategies: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"전략 목록 로딩 중 오류가 발생했습니다: {str(e)}"
        )


@router.get("/users/{wallet_address}/audit-logs", response_model=AuditLogResponse)
async def get_user_audit_logs(
    wallet_address: str,
    limit: int = Query(100, ge=1, le=100, description="Number of logs to return"),
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(verify_admin_token),
) -> AuditLogResponse:
    """
    사용자 관련 감사 로그를 반환합니다 (운영자 전용).

    참고: audit_logs 테이블은 Story 8.6에서 구현 예정입니다.
    현재는 빈 리스트를 반환합니다.

    Args:
        wallet_address: 조회할 사용자의 지갑 주소
        limit: 반환할 로그 수
        db: 데이터베이스 세션
        current_admin: 인증된 운영자

    Returns:
        AuditLogResponse: 감사 로그 (현재는 빈 리스트)
    """
    try:
        # Verify user exists
        normalized_address = wallet_address.lower()
        user_result = await db.execute(
            select(User).where(User.wallet_address == normalized_address)
        )
        user = user_result.scalar_one_or_none()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User {wallet_address} not found"
            )

        # TODO: Implement after audit_logs table is created in Story 8.6
        # For now, return empty list
        logger.info(f"Audit logs requested for {wallet_address} - not implemented yet (Story 8.6)")

        return AuditLogResponse(
            logs=[],
            total=0
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching audit logs: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"감사 로그 로딩 중 오류가 발생했습니다: {str(e)}"
        )


@router.put("/users/{wallet_address}/status", response_model=UserStatusUpdateResponse)
async def update_user_status(
    wallet_address: str,
    request: UserStatusUpdateRequest,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(verify_admin_token),
) -> UserStatusUpdateResponse:
    """
    사용자 상태를 변경합니다 (운영자 전용).

    Args:
        wallet_address: 상태를 변경할 사용자의 지갑 주소
        request: status와 reason을 포함한 요청
        db: 데이터베이스 세션
        current_admin: 인증된 운영자

    Returns:
        UserStatusUpdateResponse: 성공 메시지와 업데이트된 사용자 정보

    Raises:
        HTTPException 400: 잘못된 상태 또는 사유 누락
        HTTPException 404: 사용자를 찾을 수 없음
    """
    try:
        # Validate status
        if request.status not in ['active', 'suspended', 'banned']:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid status. Must be 'active', 'suspended', or 'banned'"
            )

        # Validate reason for non-active statuses
        if request.status in ['suspended', 'banned'] and not request.reason:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Reason is required when changing status to '{request.status}'"
            )

        # Find user
        normalized_address = wallet_address.lower()
        result = await db.execute(
            select(User).where(User.wallet_address == normalized_address)
        )
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User {wallet_address} not found"
            )

        # Store old status for logging
        old_status = user.status

        # Update user status
        user.status = request.status

        if request.status == 'suspended':
            user.suspension_reason = request.reason
            user.suspended_at = datetime.utcnow()
            user.banned_at = None

        elif request.status == 'banned':
            user.suspension_reason = request.reason
            user.banned_at = datetime.utcnow()
            user.suspended_at = None

        elif request.status == 'active':
            # Reactivate: clear all suspension/ban fields
            user.suspension_reason = None
            user.suspended_at = None
            user.banned_at = None

        await db.commit()
        await db.refresh(user)

        # TODO: Log audit trail (Story 8.6)
        logger.info(
            f"Admin {current_admin.wallet_address} updated user {wallet_address} "
            f"status from {old_status} to {request.status}"
        )

        # TODO: Send email notification (Story 8.7)
        logger.info(f"TODO: Send email notification to user {wallet_address}")

        # Return updated user detail
        user_detail = UserDetailResponse(
            wallet_address=user.wallet_address,
            ens_domain=user.ens_domain,
            role=user.role,
            status=user.status,
            suspension_reason=user.suspension_reason,
            suspended_at=user.suspended_at,
            banned_at=user.banned_at,
            created_at=user.created_at,
            updated_at=user.updated_at,
            total_purchases=user.total_purchases or Decimal('0'),
            total_sales=user.total_sales or Decimal('0'),
            strategy_count=user.strategy_count or 0
        )

        return UserStatusUpdateResponse(
            message=f"User status updated to '{request.status}'",
            user_detail=user_detail
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating user status: {e}")
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"상태 변경 중 오류가 발생했습니다: {str(e)}"
        )


@router.get("/users", response_model=UserListResponse)
async def get_users_list(
    page: int = Query(1, ge=1, description="Page number (1-indexed)"),
    limit: int = Query(50, ge=1, le=100, description="Number of users per page (max 100)"),
    status_filter: Optional[str] = Query(None, description="Filter by status (active/suspended/banned)"),
    search: Optional[str] = Query(None, description="Search by wallet address or ENS domain"),
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(verify_admin_token),
) -> UserListResponse:
    """
    사용자 목록을 반환합니다 (운영자 전용).

    페이지네이션, 검색, 상태 필터링을 지원합니다.

    Args:
        page: 페이지 번호 (1-indexed)
        limit: 페이지당 사용자 수 (최대 100)
        status_filter: 상태 필터 (active/suspended/banned)
        search: 검색어 (지갑 주소 또는 ENS 도메인)
        db: 데이터베이스 세션
        current_admin: 인증된 운영자

    Returns:
        UserListResponse: 사용자 목록과 페이지네이션 정보

    Raises:
        HTTPException 401: 인증되지 않은 경우
        HTTPException 403: 운영자 권한이 없는 경우
        HTTPException 500: 서버 에러
    """
    try:
        # 기본 쿼리 작성
        query = select(User)

        # 상태 필터링
        if status_filter:
            if status_filter not in ['active', 'suspended', 'banned']:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid status filter. Must be 'active', 'suspended', or 'banned'"
                )
            query = query.where(User.status == status_filter)

        # 검색 (지갑 주소 또는 ENS 도메인)
        if search:
            search_term = f"%{search.lower()}%"
            query = query.where(
                or_(
                    User.wallet_address.ilike(search_term),
                    User.ens_domain.ilike(search_term)
                )
            )

        # 전체 개수 계산 (페이지네이션을 위해)
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await db.execute(count_query)
        total = total_result.scalar() or 0

        # 정렬 및 페이지네이션
        query = query.order_by(User.created_at.desc())
        offset = (page - 1) * limit
        query = query.offset(offset).limit(limit)

        # 쿼리 실행
        result = await db.execute(query)
        users = result.scalars().all()

        # 응답 생성
        user_summaries = [
            UserSummary(
                wallet_address=user.wallet_address,
                ens_domain=user.ens_domain,
                created_at=user.created_at,
                status=user.status,
                total_purchases=user.total_purchases or Decimal('0'),
                total_sales=user.total_sales or Decimal('0'),
                strategy_count=user.strategy_count or 0
            )
            for user in users
        ]

        total_pages = (total + limit - 1) // limit

        return UserListResponse(
            users=user_summaries,
            total=total,
            page=page,
            limit=limit,
            total_pages=total_pages
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching users list: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"사용자 목록 로딩 중 오류가 발생했습니다: {str(e)}"
        )
