/**
 * SessionExpiredAlert - 세션 만료 알림 컴포넌트
 *
 * URL 파라미터 ?session_expired=true 감지 시
 * 사용자에게 세션 만료 메시지를 표시
 */

import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export function SessionExpiredAlert() {
  const [searchParams] = useSearchParams()
  const isExpired = searchParams.get('session_expired') === 'true'

  const [show, setShow] = useState(isExpired)

  useEffect(() => {
    if (isExpired) {
      setShow(true)
      // URL 파라미터 제거 (사용자가 새로고침해도 알림이 다시 나타나지 않도록)
      // 다른 파라미터는 유지
      const params = new URLSearchParams(window.location.search)
      params.delete('session_expired')
      const newSearch = params.toString()
      const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : '')
      window.history.replaceState({}, '', newUrl)
    }
  }, [isExpired])

  if (!show) return null

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      maxWidth: '400px',
      zIndex: 9999,
      backgroundColor: '#fef3c7',
      border: '1px solid #f59e0b',
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        {/* 경고 아이콘 */}
        <div style={{ flexShrink: 0, marginRight: '12px' }}>
          <svg
            style={{ width: '24px', height: '24px', color: '#d97706' }}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* 메시지 내용 */}
        <div style={{ flex: 1 }}>
          <h3 style={{
            margin: '0 0 4px 0',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#92400e'
          }}>
            세션이 만료되었습니다
          </h3>
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: '#b45309'
          }}>
            보안을 위해 다시 로그인해주세요.
          </p>
        </div>

        {/* 닫기 버튼 */}
        <button
          onClick={() => setShow(false)}
          style={{
            background: 'none',
            border: 'none',
            color: '#d97706',
            cursor: 'pointer',
            fontSize: '20px',
            lineHeight: 1,
            padding: '4px',
            marginLeft: '8px',
            flexShrink: 0
          }}
          aria-label="닫기"
        >
          ×
        </button>
      </div>
    </div>
  )
}
