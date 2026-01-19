/**
 * SessionExpiredAlert component tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { SessionExpiredAlert } from '../SessionExpiredAlert'

// Wrapper to provide router context
function renderWithRouter(component: React.ReactElement) {
  return render(
    <BrowserRouter>{component}</BrowserRouter>
  )
}

describe('SessionExpiredAlert', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // URL history 초기화
    window.history.replaceState({}, '', '/')
  })

  describe('기본 렌더링', () => {
    it('session_expired 파라미터가 없으면 알림 표시 안 함', () => {
      renderWithRouter(<SessionExpiredAlert />)

      expect(screen.queryByText('세션이 만료되었습니다')).not.toBeInTheDocument()
    })

    it('session_expired=true이면 알림 표시', () => {
      // URL 파라미터 설정
      window.history.replaceState({}, '', '/?session_expired=true')

      renderWithRouter(<SessionExpiredAlert />)

      expect(screen.getByText('세션이 만료되었습니다')).toBeInTheDocument()
      expect(screen.getByText('보안을 위해 다시 로그인해주세요.')).toBeInTheDocument()
    })

    it('session_expired=false이면 알림 표시 안 함', () => {
      window.history.replaceState({}, '', '/?session_expired=false')

      renderWithRouter(<SessionExpiredAlert />)

      expect(screen.queryByText('세션이 만료되었습니다')).not.toBeInTheDocument()
    })
  })

  describe('URL 파라미터 처리', () => {
    it('알림 표시 후 URL 파라미터 제거', async () => {
      window.history.replaceState({}, '', '/?session_expired=true')

      renderWithRouter(<SessionExpiredAlert />)

      // URL에서 파라미터가 제거되는지 확인
      await waitFor(() => {
        expect(window.location.search).toBe('')
      })
    })

    it('다른 URL 파라미터는 유지', async () => {
      window.history.replaceState({}, '', '/?foo=bar&session_expired=true&baz=qux')

      renderWithRouter(<SessionExpiredAlert />)

      await waitFor(() => {
        // session_expired만 제거되고 다른 파라미터는 유지
        expect(window.location.search).toBe('?foo=bar&baz=qux')
      })
    })
  })

  describe('닫기 기능', () => {
    it('닫기 버튼 클릭 시 알림 숨김', async () => {
      window.history.replaceState({}, '', '/?session_expired=true')

      renderWithRouter(<SessionExpiredAlert />)

      const closeButton = screen.getByRole('button', { name: '닫기' })
      closeButton.click()

      await waitFor(() => {
        expect(screen.queryByText('세션이 만료되었습니다')).not.toBeInTheDocument()
      })
    })

    it('닫기 버튼 존재 확인', () => {
      window.history.replaceState({}, '', '/?session_expired=true')

      renderWithRouter(<SessionExpiredAlert />)

      const closeButton = screen.getByRole('button', { name: '닫기' })
      expect(closeButton).toBeInTheDocument()
    })
  })

  describe('UI 요소 확인', () => {
    it('경고 아이콘 렌더링', () => {
      window.history.replaceState({}, '', '/?session_expired=true')

      renderWithRouter(<SessionExpiredAlert />)

      const icon = document.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })

    it('고정 위치 스타일 확인', () => {
      window.history.replaceState({}, '', '/?session_expired=true')

      const { container } = renderWithRouter(<SessionExpiredAlert />)

      const alertDiv = container.firstChild as HTMLElement
      expect(alertDiv).toHaveStyle({
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: '9999'
      })
    })
  })
})
