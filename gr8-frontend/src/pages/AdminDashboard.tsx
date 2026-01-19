import { useEffect, useState } from 'react'
import { DashboardSummaryCards } from '@/components/admin/DashboardSummaryCards'
import { UserGrowthChart } from '@/components/admin/UserGrowthChart'
import { TransactionVolumeChart } from '@/components/admin/TransactionVolumeChart'
import { TopStrategiesList } from '@/components/admin/TopStrategiesList'
import { AdminDashboardSkeleton } from '@/components/admin/AdminDashboardSkeleton'
import { ErrorDisplay } from '@/components/admin/ErrorDisplay'
import { useAuthContext } from '@/contexts/AuthContext'

interface DailyStats {
  date: string
  users: number
  transactions: number
  revenue: number
}

interface TopStrategy {
  id: string
  name: string
  sales: number
}

interface DashboardData {
  totalUsers: number
  activeUsers: number
  totalStrategies: number
  totalTransactions: number
  totalRevenue: number
  pendingApplications: number
  dailyStats: DailyStats[]
  topStrategies: TopStrategy[]
}

export function AdminDashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuthContext()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // 인증 확인
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setError('로그인이 필요합니다')
    } else if (isAuthenticated && user?.role !== 'admin') {
      setError('운영자만 접근할 수 있습니다')
    }
  }, [authLoading, isAuthenticated, user])

  // 초기 데이터 로드
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchDashboard()
    }
  }, [isAuthenticated, user])

  // 5초마다 데이터 업데이트 (폴링)
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      const interval = setInterval(() => {
        fetchDashboard(true) // Silent refresh for polling
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [isAuthenticated, user])

  async function fetchDashboard(isSilent: boolean = false) {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        throw new Error('No token found')
      }

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const response = await fetch(`${API_URL}/api/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('접근 권한이 없습니다')
        }
        if (response.status >= 500) {
          throw new Error(`서버 오류: ${response.status}`)
        }
        throw new Error(`Failed to fetch dashboard data: ${response.status}`)
      }

      const data = await response.json()
      setDashboardData(data)
      setLastUpdate(new Date())
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      console.error('[AdminDashboard] Error loading dashboard:', {
        message: errorMessage,
        timestamp: new Date().toISOString(),
        isSilent,
      })

      // Only set error state for non-silent requests
      if (!isSilent) {
        setError(errorMessage)
      }
    } finally {
      if (!isSilent) {
        setIsLoading(false)
      }
    }
  }

  function formatRelativeTime(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

    if (seconds < 60) return `${seconds}초 전`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}분 전`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}시간 전`
    return `${Math.floor(seconds / 86400)}일 전`
  }

  // 로딩 상태 - Skeleton UI 사용
  if (authLoading || isLoading) {
    return <AdminDashboardSkeleton />
  }

  // 에러 상태 - ErrorDisplay 컴포넌트 사용
  if (error) {
    return (
      <ErrorDisplay
        error={error}
        onRetry={() => {
          setIsLoading(true)
          setError(null)
          fetchDashboard()
        }}
        onNavigateHome={() => (window.location.href = '/')}
      />
    )
  }

  // 데이터 없음
  if (!dashboardData) {
    return (
      <ErrorDisplay
        error="대시보드 데이터를 불러올 수 없습니다"
        onRetry={() => {
          setIsLoading(true)
          fetchDashboard()
        }}
        onNavigateHome={() => (window.location.href = '/')}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">운영 대시보드</h1>
            <p className="text-gray-400">플랫폼의 핵심 지표를 한눈에 확인하세요</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-sm text-gray-400">실시간</span>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">마지막 업데이트</p>
              <p className="text-sm font-medium">{formatRelativeTime(lastUpdate)}</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <DashboardSummaryCards data={dashboardData} />

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <UserGrowthChart data={dashboardData.dailyStats} />
          <TransactionVolumeChart data={dashboardData.dailyStats} />
        </div>

        {/* Top Strategies */}
        <div className="mt-8">
          <TopStrategiesList strategies={dashboardData.topStrategies} />
        </div>
      </div>
    </div>
  )
}
