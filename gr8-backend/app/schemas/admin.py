"""Admin dashboard schemas."""

from pydantic import BaseModel
from typing import List


class DailyStats(BaseModel):
    """일별 통계."""

    date: str  # YYYY-MM-DD
    users: int
    transactions: int
    revenue: float

    model_config = {"from_attributes": True}


class TopStrategy(BaseModel):
    """인기 전략."""

    id: str
    name: str
    sales: int

    model_config = {"from_attributes": True}


class AdminDashboardResponse(BaseModel):
    """운영자 대시보드 응답."""

    totalUsers: int
    activeUsers: int
    totalStrategies: int
    totalTransactions: int
    totalRevenue: float
    pendingApplications: int
    dailyStats: List[DailyStats]
    topStrategies: List[TopStrategy]

    model_config = {"from_attributes": True}
