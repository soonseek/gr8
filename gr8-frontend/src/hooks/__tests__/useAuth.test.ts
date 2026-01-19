/**
 * useAuth Hook Tests
 */

import { renderHook, act, waitFor } from '@testing-library/react'
import { useAuth } from '../useAuth'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

// Mock wagmi hooks
vi.mock('wagmi', () => ({
  useAccount: () => ({
    address: '0x1234567890123456789012345678901234567890',
    isConnected: true
  }),
  useSignMessage: () => ({
    signMessageAsync: vi.fn(async () => '0xabc123')
  }),
  useDisconnect: () => ({
    disconnect: vi.fn(async () => {})
  })
}))

// Mock fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        access_token: 'test-jwt-token',
        wallet_address: '0x1234567890123456789012345678901234567890',
        role: 'user'
      })
  })
) as any

describe('useAuth Hook', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('Initial State', () => {
    it('should initialize with no authentication', () => {
      const { result } = renderHook(() => useAuth())

      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.token).toBeNull()
      expect(result.current.user).toBeNull()
      expect(result.current.isLoading).toBe(true)
    })

    it('should load existing user from localStorage', async () => {
      const mockUser = {
        wallet_address: '0x1234567890123456789012345678901234567890',
        role: 'user' as const
      }

      localStorage.setItem('access_token', 'existing-token')
      localStorage.setItem('user', JSON.stringify(mockUser))

      const { result } = renderHook(() => useAuth())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.token).toBe('existing-token')
      expect(result.current.user).toEqual(mockUser)
    })
  })

  describe('Auto-login on wallet connection', () => {
    it('should call login API when wallet connects', async () => {
      const { result } = renderHook(() => useAuth())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Verify fetch was called with login data
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/auth/login',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: expect.stringContaining('wallet_address')
        })
      )
    })

    it('should save token and user to localStorage after successful login', async () => {
      const { result } = renderHook(() => useAuth())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Check localStorage
      expect(localStorage.getItem('access_token')).toBe('test-jwt-token')

      const storedUser = localStorage.getItem('user')
      expect(storedUser).toBeTruthy()
      expect(JSON.parse(storedUser!)).toEqual({
        wallet_address: '0x1234567890123456789012345678901234567890',
        role: 'user'
      })
    })

    it('should update auth state after successful login', async () => {
      const { result } = renderHook(() => useAuth())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.token).toBe('test-jwt-token')
      expect(result.current.user).toEqual({
        wallet_address: '0x1234567890123456789012345678901234567890',
        role: 'user'
      })
    })
  })

  describe('Logout functionality', () => {
    it('should clear localStorage on logout', async () => {
      localStorage.setItem('access_token', 'test-token')
      localStorage.setItem('user', JSON.stringify({ wallet_address: '0x123', role: 'user' }))

      const { result } = renderHook(() => useAuth())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      act(() => {
        result.current.logout()
      })

      expect(localStorage.getItem('access_token')).toBeNull()
      expect(localStorage.getItem('user')).toBeNull()
    })

    it('should clear auth state on logout', async () => {
      const { result } = renderHook(() => useAuth())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.isAuthenticated).toBe(true)

      act(() => {
        result.current.logout()
      })

      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.token).toBeNull()
      expect(result.current.user).toBeNull()
    })
  })

  describe('Error handling', () => {
    it('should handle login API failure gracefully', async () => {
      // Mock failed fetch
      vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Login failed'))

      const { result } = renderHook(() => useAuth())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Should remain unauthenticated
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.token).toBeNull()
      expect(result.current.user).toBeNull()
    })

    it('should clear invalid data from localStorage', async () => {
      localStorage.setItem('user', 'invalid-json')

      const { result } = renderHook(() => useAuth())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(localStorage.getItem('user')).toBeNull()
      expect(localStorage.getItem('access_token')).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
    })
  })
})
