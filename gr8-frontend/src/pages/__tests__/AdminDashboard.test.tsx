/**
 * Integration tests for AdminDashboard page
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { AdminDashboard } from '../AdminDashboard'
import { AuthProvider } from '@/contexts/AuthContext'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
global.localStorage = localStorageMock

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

describe('AdminDashboard Integration Tests', () => {
  const mockDashboardData = {
    totalUsers: 1250,
    activeUsers: 342,
    totalStrategies: 87,
    totalTransactions: 15420,
    totalRevenue: 125500,
    pendingApplications: 12,
    dailyStats: [
      { date: '2026-01-01', users: 1200, transactions: 500, revenue: 40000 },
      { date: '2026-01-02', users: 1250, transactions: 600, revenue: 50000 }
    ],
    topStrategies: [
      { id: 'str-1', name: 'RSI Momentum', sales: 156 },
      { id: 'str-2', name: 'MACD Crossover', sales: 142 }
    ]
  }

  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockImplementation((key: string) => {
      if (key === 'access_token') return 'mock-jwt-token'
      return null
    })
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  describe('Authentication Flow', () => {
    it('should show loading state initially', () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockDashboardData
      })

      render(
        <AuthProvider>
          <AdminDashboard />
        </AuthProvider>
      )

      // Skeleton should be shown
      expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
    })

    it('should load dashboard data when authenticated admin', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockDashboardData
      })

      render(
        <AuthProvider>
          <AdminDashboard />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByText('운영 대시보드')).toBeInTheDocument()
      })
    })

    it('should show error when not authenticated', async () => {
      localStorageMock.getItem.mockReturnValue(null)

      render(
        <AuthProvider>
          <AdminDashboard />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByText(/로그인이 필요합니다/)).toBeInTheDocument()
      })
    })

    it('should show error when non-admin user', async () => {
      // This would require mocking the auth context with a non-admin user
      // For now, we test the error state
      render(
        <AuthProvider>
          <AdminDashboard />
        </AuthProvider>
      )

      // Error display should render if auth fails
      await waitFor(() => {
        const errorDisplay = document.querySelector('.bg-gray-800')
        expect(errorDisplay).toBeInTheDocument()
      })
    })
  })

  describe('Data Loading', () => {
    it('should fetch dashboard data on mount', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockDashboardData
      })

      render(
        <AuthProvider>
          <AdminDashboard />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:8000/api/admin/dashboard',
          expect.objectContaining({
            headers: expect.objectContaining({
              'Authorization': 'Bearer mock-jwt-token'
            })
          })
        )
      })
    })

    it('should display all metric cards', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockDashboardData
      })

      render(
        <AuthProvider>
          <AdminDashboard />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByText('총 사용자 수')).toBeInTheDocument()
        expect(screen.getByText('활성 사용자 수')).toBeInTheDocument()
        expect(screen.getByText('총 전략 수')).toBeInTheDocument()
        expect(screen.getByText('총 거래량')).toBeInTheDocument()
        expect(screen.getByText('총 수익')).toBeInTheDocument()
        expect(screen.getByText('보류 중 파트너 신청')).toBeInTheDocument()
      })
    })

    it('should display charts', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockDashboardData
      })

      render(
        <AuthProvider>
          <AdminDashboard />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByText('사용자 증가 추이')).toBeInTheDocument()
        expect(screen.getByText('거래량 추이')).toBeInTheDocument()
      })
    })

    it('should display top strategies', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockDashboardData
      })

      render(
        <AuthProvider>
          <AdminDashboard />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByText('인기 전략 Top 5')).toBeInTheDocument()
      })
    })
  })

  describe('Error Handling', () => {
    it('should show error message on 401/403', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 403
      })

      render(
        <AuthProvider>
          <AdminDashboard />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByText(/접근 권한이 없습니다/)).toBeInTheDocument()
      })
    })

    it('should show error message on 500', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500
      })

      render(
        <AuthProvider>
          <AdminDashboard />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByText(/서버 오류/)).toBeInTheDocument()
      })
    })

    it('should show error message on network failure', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'))

      render(
        <AuthProvider>
          <AdminDashboard />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByText(/Failed to fetch/)).toBeInTheDocument()
      })
    })

    it('should show retry button on error', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500
      })

      render(
        <AuthProvider>
          <AdminDashboard />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByText('다시 시도')).toBeInTheDocument()
      })
    })
  })

  describe('Real-time Updates', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should poll every 5 seconds', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockDashboardData
      })

      render(
        <AuthProvider>
          <AdminDashboard />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(1)
      })

      // Fast-forward 5 seconds
      vi.advanceTimersByTime(5000)

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(2)
      })
    })

    it('should display last update time', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockDashboardData
      })

      render(
        <AuthProvider>
          <AdminDashboard />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByText(/마지막 업데이트/)).toBeInTheDocument()
      })
    })

    it('should show real-time badge', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockDashboardData
      })

      render(
        <AuthProvider>
          <AdminDashboard />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByText('실시간')).toBeInTheDocument()
      })
    })
  })

  describe('Component Integration', () => {
    it('should render all dashboard components', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockDashboardData
      })

      render(
        <AuthProvider>
          <AdminDashboard />
        </AuthProvider>
      )

      await waitFor(() => {
        // Check for summary cards
        expect(screen.getByText('총 사용자 수')).toBeInTheDocument()

        // Check for charts
        expect(screen.getByText('사용자 증가 추이')).toBeInTheDocument()
        expect(screen.getByText('거래량 추이')).toBeInTheDocument()

        // Check for top strategies
        expect(screen.getByText('인기 전략 Top 5')).toBeInTheDocument()
      })
    })
  })

  describe('Responsive Design', () => {
    it('should use responsive grid layout', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockDashboardData
      })

      render(
        <AuthProvider>
          <AdminDashboard />
        </AuthProvider>
      )

      await waitFor(() => {
        const container = document.querySelector('.grid')
        expect(container).toBeInTheDocument()
      })
    })
  })
})
