import { useState, useCallback, useEffect, useRef } from 'react'
import { useSignMessage, useAccount, useDisconnect } from 'wagmi'
import toast from 'react-hot-toast'

interface User {
  walletAddress: string
  role: 'user' | 'admin'
}

interface AuthState {
  isAuthenticated: boolean
  token: string | null
  user: User | null
}

const AUTH_MESSAGE = 'Sign this message to authenticate with gr8 platform'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Error message mapping function
function getErrorMessage(error: unknown): string {
  // If it's already a Korean error message from our frontend
  if (error instanceof Error && error.message.includes('로그인')) {
    return error.message
  }

  // If it's a backend error, try to provide a user-friendly message
  const errorMessage = error instanceof Error ? error.message : String(error)

  // Map common backend errors to Korean messages
  if (errorMessage.includes('Invalid signature')) {
    return '서명 검증에 실패했습니다. 다시 시도해주세요.'
  }
  if (errorMessage.includes('Invalid or expired token')) {
    return '세션이 만료되었습니다. 다시 로그인해주세요.'
  }
  if (errorMessage.includes('Unauthorized') || errorMessage.includes('401')) {
    return '인증에 실패했습니다. 다시 시도해주세요.'
  }
  if (errorMessage.includes('not found') || errorMessage.includes('404')) {
    return '사용자를 찾을 수 없습니다.'
  }

  // Default fallback
  return '로그인에 실패했습니다. 다시 시도해주세요.'
}

export function useAuth() {
  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { disconnect } = useDisconnect()

  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    token: localStorage.getItem('access_token'),
    user: null
  })

  const [isLoading, setIsLoading] = useState(true)
  const [loginAttempted, setLoginAttempted] = useState(false)
  const loginInProgressRef = useRef(false)
  const isLoggingOutRef = useRef(false) // 로그아웃 중인지 확인하는 플래그

  // Load user data from localStorage on mount
  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const rawData = JSON.parse(userStr)

        // Handle both snake_case (old) and camelCase (new) formats
        const userData: User = {
          walletAddress: rawData.wallet_address || rawData.walletAddress,
          role: rawData.role
        }

        setAuthState((prev) => ({
          ...prev,
          user: userData,
          isAuthenticated: true
        }))
      } catch (error) {
        console.error('Failed to parse user data:', error)
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')
      }
    }
    setIsLoading(false)
  }, [])

  // Auto-login when wallet connects
  useEffect(() => {
    const hasToken = !!localStorage.getItem('access_token')

    // 로그아웃 중이면 자동 로그인 시도하지 않음
    if (isLoggingOutRef.current) {
      return
    }

    if (isConnected && address && !hasToken && !isLoading && !loginAttempted && !loginInProgressRef.current) {
      setLoginAttempted(true)
      loginInProgressRef.current = true
      handleAutoLogin()
    }

    // Reset loginAttempted when disconnected
    if (!isConnected) {
      setLoginAttempted(false)
      loginInProgressRef.current = false
      isLoggingOutRef.current = false // 로그아웃 플래그 초기화
    }
  }, [isConnected, address, isLoading, loginAttempted])

  const handleAutoLogin = async () => {
    if (!address) return

    // 로그아웃 중이면 로그인 시도 중단
    if (isLoggingOutRef.current) {
      loginInProgressRef.current = false
      return
    }

    try {
      // 1. Create signature
      const signature = await signMessageAsync({ message: AUTH_MESSAGE })

      // 2. Call backend login API
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet_address: address,
          message: AUTH_MESSAGE,
          signature: signature
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Login failed' }))
        throw new Error(errorData.detail || 'Login failed')
      }

      const data = await response.json()

      // 3. Save token
      localStorage.setItem('access_token', data.access_token)

      // 4. Save user data (convert from backend snake_case to frontend camelCase)
      const userData: User = {
        walletAddress: data.wallet_address,
        role: data.role
      }
      localStorage.setItem('user', JSON.stringify(userData))

      // 5. Show first user admin notification
      if (data.is_first_user) {
        toast.success('축하합니다! 첫 번째 사용자이므로 운영자로 지정되었습니다.', {
          duration: 5000,
          icon: '🎉',
        })
      }

      // 6. Update state
      setAuthState({
        isAuthenticated: true,
        token: data.access_token,
        user: userData
      })
      loginInProgressRef.current = false
    } catch (error) {
      console.error('Auto login failed:', error)

      // Show error message to user (with i18n support)
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage, { id: 'login-error' }) // Prevent duplicate toasts

      // Clear invalid state and reset login attempt
      setAuthState({
        isAuthenticated: false,
        token: null,
        user: null
      })
      setLoginAttempted(false)
      loginInProgressRef.current = false
    }
  }

  const logout = useCallback(async () => {
    // 1. Set logout flag to prevent auto-login attempts
    isLoggingOutRef.current = true

    // 2. Clear localStorage immediately
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')

    // 3. Clear state immediately (this will trigger UI update)
    setAuthState({
      isAuthenticated: false,
      token: null,
      user: null
    })

    // 4. Reset login attempt flags
    setLoginAttempted(false)
    loginInProgressRef.current = false

    // 5. Disconnect wallet (async, but UI already updated)
    try {
      await disconnect()
    } catch (error) {
      console.error('Disconnect failed:', error)
    }
  }, [disconnect])

  return {
    ...authState,
    isLoading,
    logout
  }
}
