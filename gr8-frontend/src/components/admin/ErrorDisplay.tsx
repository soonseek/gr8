/**
 * ErrorDisplay Component
 *
 * Displays error messages with retry button
 * Provides user-friendly error messages based on error type
 */

import { useEffect } from 'react'

interface ErrorDisplayProps {
  error: string
  onRetry?: () => void
  onNavigateHome?: () => void
}

export function ErrorDisplay({ error, onRetry, onNavigateHome }: ErrorDisplayProps) {
  // Get user-friendly error message
  const getErrorMessage = (error: string): string => {
    if (error.includes('접근 권한이 없습니다') || error.includes('401') || error.includes('403')) {
      return '운영자 권한이 필요합니다'
    }
    if (error.includes('로그인이 필요합니다')) {
      return '로그인이 필요합니다'
    }
    if (error.includes('Failed to fetch') || error.includes('NetworkError')) {
      return '서버에 연결할 수 없습니다'
    }
    if (error.includes('timeout')) {
      return '요청 시간이 초과되었습니다'
    }
    // Default error message
    return error || '알 수 없는 오류가 발생했습니다'
  }

  const friendlyMessage = getErrorMessage(error)

  // Log error for debugging (could be sent to monitoring service)
  useEffect(() => {
    console.error('[AdminDashboard Error]:', {
      message: error,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    })
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-center bg-gray-800 p-8 rounded-lg border border-gray-700 max-w-md">
        {/* Error Icon */}
        <div className="mx-auto w-16 h-16 mb-4 text-red-400">
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Error Message */}
        <h2 className="text-xl font-semibold text-white mb-2">오류 발생</h2>
        <p className="text-red-400 text-lg mb-6">{friendlyMessage}</p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              다시 시도
            </button>
          )}
          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              홈으로 이동
            </button>
          )}
        </div>

        {/* Error Details (for debugging) */}
        {process.env.NODE_ENV === 'development' && error !== friendlyMessage && (
          <details className="mt-4 text-left">
            <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-400">
              상세 오류 정보
            </summary>
            <pre className="mt-2 text-xs text-gray-600 bg-gray-900 p-2 rounded overflow-auto max-h-32">
              {error}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}
