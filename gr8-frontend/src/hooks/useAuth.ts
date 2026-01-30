import { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
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
const API_URL = import.meta.env.VITE_API_URL || '/api'

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
  const navigate = useNavigate()
  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { disconnect } = useDisconnect()

  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    token: localStorage.getItem('access_token'),
    user: null
  })

  const [isLoading, setIsLoading] = useState(true)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const loginInProgressRef = useRef(false)
  const isLoggingOutRef = useRef(false)

  // Load user data from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    const userStr = localStorage.getItem('user')

    console.log('useAuth init:', { hasToken: !!token, hasUser: !!userStr, userStr })

    if (token && userStr) {
      try {
        const rawData = JSON.parse(userStr)

        // Handle both snake_case (old) and camelCase (new) formats
        const userData: User = {
          walletAddress: rawData.wallet_address || rawData.walletAddress,
          role: rawData.role
        }

        console.log('Setting authenticated state:', userData)

        setAuthState((prev) => ({
          ...prev,
          token: token,
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

  // Reset login in progress flag when disconnected
  useEffect(() => {
    if (!isConnected) {
      loginInProgressRef.current = false
      isLoggingOutRef.current = false
    }
  }, [isConnected])

  const login = useCallback(async () => {
    if (!address) {
      toast.error('지갑이 연결되지 않았습니다.')
      return
    }

    // 로그아웃 중이면 로그인 시도 중단
    if (isLoggingOutRef.current) {
      loginInProgressRef.current = false
      return
    }

    // 이미 로그인 진행 중이면 중복 실행 방지
    if (loginInProgressRef.current || isLoggingIn) {
      return
    }

    loginInProgressRef.current = true
    setIsLoggingIn(true)

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
      setIsLoggingIn(false)

      // 7. Force page reload to ensure authentication state is reflected across all components
      window.location.href = '/workspace'
    } catch (error) {
      console.error('Login failed:', error)

      // Show error message to user (with i18n support)
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage, { id: 'login-error' }) // Prevent duplicate toasts

      // Clear invalid state and reset login attempt
      setAuthState({
        isAuthenticated: false,
        token: null,
        user: null
      })
      loginInProgressRef.current = false
      setIsLoggingIn(false)
      throw error // Re-throw to allow caller to handle
    }
  }, [address, signMessageAsync, isLoggingIn])

  const logout = useCallback(async () => {
    // 1. Set logout flag to prevent auto-login attempts
    isLoggingOutRef.current = true

    // 2. Clear localStorage immediately
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')

    // 3. Clear state immediately
    setAuthState({
      isAuthenticated: false,
      token: null,
      user: null
    })

    // 4. Reset login attempt flags
    loginInProgressRef.current = false
    setIsLoggingIn(false)

    // 5. Disconnect wallet (async, but UI already updated)
    try {
      await disconnect()
    } catch (error) {
      console.error('Disconnect failed:', error)
    }

    // 6. Force page reload to ensure logout state is reflected
    window.location.href = '/'
  }, [disconnect])

  return {
    ...authState,
    isLoading,
    isLoggingIn,
    login,
    logout
  }
}
