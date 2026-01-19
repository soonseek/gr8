/**
 * UserStatusChangeModal Tests
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastProvider } from 'react-hot-toast/toaster'
import { UserStatusChangeModal } from '../UserStatusChangeModal'

// Mock hooks
vi.mock('@/hooks/useAdminUsers', () => ({
  useUpdateUserStatus: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}))

describe('UserStatusChangeModal', () => {
  const mockUser = {
    wallet_address: '0xtest123',
    ens_domain: 'test.eth',
    role: 'user' as const,
    status: 'active' as const,
    suspension_reason: null,
    suspended_at: null,
    banned_at: null,
    created_at: '2024-01-01T00:00:00',
    updated_at: '2024-01-01T00:00:00',
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
      <UserStatusChangeModal user={mockUser} isOpen={true} onClose={vi.fn()} />
    )

    expect(screen.getByText('사용자 상태 변경')).toBeInTheDocument()
  })

  it('does not render modal when closed', () => {
    const { container } = renderWithProviders(
      <UserStatusChangeModal user={mockUser} isOpen={false} onClose={vi.fn()} />
    )

    expect(container.querySelector('.fixed')).not.toBeInTheDocument()
  })

  it('renders current status', () => {
    renderWithProviders(
      <UserStatusChangeModal user={mockUser} isOpen={true} onClose={vi.fn()} />
    )

    expect(screen.getByText('현재 상태')).toBeInTheDocument()
    expect(screen.getByText('활성')).toBeInTheDocument()
  })

  it('renders all status options', () => {
    renderWithProviders(
      <UserStatusChangeModal user={mockUser} isOpen={true} onClose={vi.fn()} />
    )

    expect(screen.getByText('활성화')).toBeInTheDocument()
    expect(screen.getByText('정지')).toBeInTheDocument()
    expect(screen.getByText('차단')).toBeInTheDocument()
  })

  it('shows reason input when suspended is selected', () => {
    renderWithProviders(
      <UserStatusChangeModal user={mockUser} isOpen={true} onClose={vi.fn()} />
    )

    const suspendRadio = screen.getByLabelText('정지')
    fireEvent.click(suspendRadio)

    expect(screen.getByText('사유')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/상태 변경 사유를 최소 10자 이상/)).toBeInTheDocument()
  })

  it('shows reason input when banned is selected', () => {
    renderWithProviders(
      <UserStatusChangeModal user={mockUser} isOpen={true} onClose={vi.fn()} />
    )

    const banRadio = screen.getByLabelText('차단')
    fireEvent.click(banRadio)

    expect(screen.getByText('사유')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/상태 변경 사유를 최소 10자 이상/)).toBeInTheDocument()
  })

  it('shows ban confirmation dialog', () => {
    renderWithProviders(
      <UserStatusChangeModal user={mockUser} isOpen={true} onClose={vi.fn()} />
    )

    const banRadio = screen.getByLabelText('차단')
    fireEvent.click(banRadio)

    const reasonInput = screen.getByPlaceholderText(/상태 변경 사유를 최소 10자 이상/)
    fireEvent.change(reasonInput, {
      target: { value: 'This is a test reason for banning the user' },
    })

    const submitButton = screen.getByRole('button', { name: '변경' })
    fireEvent.click(submitButton)

    expect(screen.getByText('정말로 이 사용자를 차단하시겠습니까?')).toBeInTheDocument()
  })

  it('renders cancel and submit buttons', () => {
    renderWithProviders(
      <UserStatusChangeModal user={mockUser} isOpen={true} onClose={vi.fn()} />
    )

    expect(screen.getByRole('button', { name: '취소' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '변경' })).toBeInTheDocument()
  })
})
