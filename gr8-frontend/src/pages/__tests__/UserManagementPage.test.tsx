/**
 * UserManagementPage Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastProvider } from 'react-hot-toast'
import { UserManagementPage } from '../UserManagementPage'

// Mock contexts
vi.mock('@/contexts/AuthContext', () => ({
  useAuthContext: () => ({
    user: { walletAddress: '0x123', role: 'admin' },
    isAuthenticated: true,
    isLoading: false,
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

// Mock hooks
vi.mock('@/hooks/useAdminUsers', () => ({
  useAdminUsers: () => ({
    data: {
      users: [
        {
          wallet_address: '0xabc123',
          ens_domain: 'test.eth',
          created_at: '2024-01-01T00:00:00',
          status: 'active',
          total_purchases: '100.5',
          total_sales: '50.25',
          strategy_count: 3,
        },
        {
          wallet_address: '0xdef456',
          ens_domain: null,
          created_at: '2024-01-02T00:00:00',
          status: 'suspended',
          total_purchases: '0',
          total_sales: '0',
          strategy_count: 0,
        },
      ],
      total: 2,
      page: 1,
      limit: 50,
      total_pages: 1,
    },
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  }),
}))

describe('UserManagementPage', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
  })

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <BrowserRouter>{component}</BrowserRouter>
        </ToastProvider>
      </QueryClientProvider>
    )
  }

  it('renders user list correctly', async () => {
    renderWithProviders(<UserManagementPage />)

    await waitFor(() => {
      expect(screen.getByText('사용자 관리')).toBeInTheDocument()
      expect(screen.getByText('전체 사용자: 2명')).toBeInTheDocument()
    })
  })

  it('renders search bar', () => {
    renderWithProviders(<UserManagementPage />)

    expect(screen.getByPlaceholderText('지갑 주소 또는 ENS 검색...')).toBeInTheDocument()
  })

  it('renders status filter dropdown', () => {
    renderWithProviders(<UserManagementPage />)

    const filter = screen.getByRole('combobox')
    expect(filter).toBeInTheDocument()
  })

  it('renders user table with correct data', async () => {
    renderWithProviders(<UserManagementPage />)

    await waitFor(() => {
      expect(screen.getByText('0xabc123')).toBeInTheDocument()
      expect(screen.getByText('test.eth')).toBeInTheDocument()
      expect(screen.getByText('0xdef456')).toBeInTheDocument()
    })
  })

  it('renders status badges correctly', async () => {
    renderWithProviders(<UserManagementPage />)

    await waitFor(() => {
      expect(screen.getByText('활성')).toBeInTheDocument()
      expect(screen.getByText('정지')).toBeInTheDocument()
    })
  })
})
