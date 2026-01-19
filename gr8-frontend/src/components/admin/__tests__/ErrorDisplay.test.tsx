import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ErrorDisplay } from '../ErrorDisplay'

/**
 * ErrorDisplay Component Tests
 */

describe('ErrorDisplay', () => {
  it('renders error message correctly', () => {
    render(<ErrorDisplay error="Test error message" />)
    expect(screen.getByText('Test error message')).toBeInTheDocument()
  })

  it('renders retry button when onRetry is provided', () => {
    const onRetry = vi.fn()
    render(<ErrorDisplay error="Test error" onRetry={onRetry} />)
    expect(screen.getByRole('button', { name: '다시 시도' })).toBeInTheDocument()
  })

  it('renders navigate home button when onNavigateHome is provided', () => {
    const onNavigateHome = vi.fn()
    render(<ErrorDisplay error="Test error" onNavigateHome={onNavigateHome} />)
    expect(screen.getByRole('button', { name: '홈으로 이동' })).toBeInTheDocument()
  })

  it('calls onRetry when retry button is clicked', () => {
    const onRetry = vi.fn()
    render(<ErrorDisplay error="Test error" onRetry={onRetry} />)

    const retryButton = screen.getByRole('button', { name: '다시 시도' })
    retryButton.click()

    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('calls onNavigateHome when home button is clicked', () => {
    const onNavigateHome = vi.fn()
    render(<ErrorDisplay error="Test error" onNavigateHome={onNavigateHome} />)

    const homeButton = screen.getByRole('button', { name: '홈으로 이동' })
    homeButton.click()

    expect(onNavigateHome).toHaveBeenCalledTimes(1)
  })

  it('translates authentication errors to user-friendly messages', () => {
    render(<ErrorDisplay error="접근 권한이 없습니다" />)
    expect(screen.getByText('운영자 권한이 필요합니다')).toBeInTheDocument()
  })

  it('translates login errors to user-friendly messages', () => {
    render(<ErrorDisplay error="로그인이 필요합니다" />)
    expect(screen.getByText('로그인이 필요합니다')).toBeInTheDocument()
  })

  it('translates network errors to user-friendly messages', () => {
    render(<ErrorDisplay error="Failed to fetch" />)
    expect(screen.getByText('서버에 연결할 수 없습니다')).toBeInTheDocument()
  })

  it('translates timeout errors to user-friendly messages', () => {
    render(<ErrorDisplay error="timeout error" />)
    expect(screen.getByText('요청 시간이 초과되었습니다')).toBeInTheDocument()
  })

  it('logs error to console on mount', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(<ErrorDisplay error="Test error" />)

    expect(consoleSpy).toHaveBeenCalledWith(
      '[AdminDashboard Error]:',
      expect.objectContaining({
        message: 'Test error',
        timestamp: expect.any(String),
        userAgent: expect.any(String),
      })
    )

    consoleSpy.mockRestore()
  })
})
