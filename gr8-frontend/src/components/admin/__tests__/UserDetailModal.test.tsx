/**
 * UserDetailModal Tests
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastProvider } from 'react-hot-toast/toaster'
import { UserDetailModal } from '../UserDetailModal'

// Mock hooks
vi.mock('@/hooks/useAdminUsers', () => ({
  useAdminUserDetail: () => ({
    data: {
      wallet_address: '0xtest123',
      ens_domain: 'test.eth',
      role: 'user',
      status: 'active',
      suspension_reason: null,
      suspended_at: null,
      banned_at: null,
      created_at: '2024-01-01T00:00:00',
      updated_at: '2024-01-01T00:00:00',
      total_purchases: '100.5',
      total_sales: '50.25',
      strategy_count: 3,
    },
    isLoading: false,
  }),
  useAdminUserActivity: () => ({
    data: {
      activities: [
        {
          type: 'purchase',
          description: 'Purchased strategy',
          amount: '10.0',
          created_at: '2024-01-01T00:00:00',
        },
      ],
      total: 1,
    },
    isLoading: false,
  }),
  useAdminUserStrategies: () => ({
    data: {
      strategies: [
        {
          id: 'strategy_1',
          name: 'Test Strategy',
          description: 'Test description',
          is_published: true,
          created_at: '2024-01-01T00:00:00',
        },
      ],
      total: 1,
    },
    isLoading: false,
  }),
  useAdminUserAuditLogs: () => ({
    data: {
      logs: [],
      total: 0,
    },
    isLoading: false,
  }),
}))

describe('UserDetailModal', () => {
  const mockUser = {
    wallet_address: '0xtest123',
    ens_domain: 'test.eth',
    created_at: '2024-01-01T00:00:00',
    status: 'active' as const,
    total_purchases: '100.5',
    total_sales: '50.25',
    strategy_count: 3,
  }

  const renderWithProviders = (component: React.ReactElement) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })

    return render(
      <QueryClientProvider client={queryClient}>
        <ToastProvider>{component}</ToastProvider>
      </QueryClientProvider>
    )
  }

  it('renders modal when open', () => {
    renderWithProviders(
      <UserDetailModal user={mockUser} isOpen={true} onClose={vi.fn()} />
    )

    expect(screen.getByText('사용자 상세 정보')).toBeInTheDocument()
  })

  it('does not render modal when closed', () => {
    const { container } = renderWithProviders(
      <UserDetailModal user={mockUser} isOpen={false} onClose={vi.fn()} />
    )

    expect(container.querySelector('.fixed')).not.toBeInTheDocument()
  })

  it('renders all tabs', () => {
    renderWithProviders(
      <UserDetailModal user={mockUser} isOpen={true} onClose={vi.fn()} />
    )

    expect(screen.getByText('기본 정보')).toBeInTheDocument()
    expect(screen.getByText('활동 내역')).toBeInTheDocument()
    expect(screen.getByText('전략')).toBeInTheDocument()
    expect(screen.getByText('감사 로그')).toBeInTheDocument()
  })

  it('renders close button', () => {
    renderWithProviders(
      <UserDetailModal user={mockUser} isOpen={true} onClose={vi.fn()} />
    )

    const closeButton = screen.getByRole('button', { name: /닫기/ })
    expect(closeButton).toBeInTheDocument()
  })

  it('renders status change button', () => {
    renderWithProviders(
      <UserDetailModal user={mockUser} isOpen={true} onClose={vi.fn()} />
    )

    const statusButton = screen.getByRole('button', { name: '상태 변경' })
    expect(statusButton).toBeInTheDocument()
  })
})
