/**
 * useAuthenticatedFetch Hook Tests
 */

import { renderHook } from '@testing-library/react'
import { useAuthenticatedFetch } from '../useAuthenticatedFetch'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

// Mock fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: 'test' })
  })
) as any

describe('useAuthenticatedFetch Hook', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('Authorization header', () => {
    it('should include token in Authorization header when token exists', async () => {
      const mockToken = 'test-jwt-token'
      localStorage.setItem('access_token', mockToken)

      const { result } = renderHook(() => useAuthenticatedFetch())
      const authenticatedFetch = result.current

      await authenticatedFetch('http://localhost:8000/api/test')

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockToken}`
          })
        })
      )
    })

    it('should not include Authorization header when no token', async () => {
      const { result } = renderHook(() => useAuthenticatedFetch())
      const authenticatedFetch = result.current

      await authenticatedFetch('http://localhost:8000/api/test')

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/test',
        expect.objectContaining({
          headers: expect.not.objectContaining({
            'Authorization': expect.any(String)
          })
        })
      )
    })

    it('should merge custom headers with Authorization header', async () => {
      const mockToken = 'test-jwt-token'
      localStorage.setItem('access_token', mockToken)

      const { result } = renderHook(() => useAuthenticatedFetch())
      const authenticatedFetch = result.current

      await authenticatedFetch('http://localhost:8000/api/test', {
        headers: {
          'Content-Type': 'application/json',
          'X-Custom-Header': 'custom-value'
        }
      })

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockToken}`,
            'Content-Type': 'application/json',
            'X-Custom-Header': 'custom-value'
          })
        })
      )
    })
  })

  describe('Request options', () => {
    it('should pass through method, body, and other options', async () => {
      localStorage.setItem('access_token', 'test-token')

      const { result } = renderHook(() => useAuthenticatedFetch())
      const authenticatedFetch = result.current

      await authenticatedFetch('http://localhost:8000/api/test', {
        method: 'POST',
        body: JSON.stringify({ test: 'data' }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/test',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ test: 'data' })
        })
      )
    })
  })

  describe('Error handling', () => {
    it('should handle 401 Unauthorized responses', async () => {
      localStorage.setItem('access_token', 'expired-token')

      // Mock 401 response
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: 'Unauthorized' })
      } as any)

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const { result } = renderHook(() => useAuthenticatedFetch())
      const authenticatedFetch = result.current

      await authenticatedFetch('http://localhost:8000/api/test')

      expect(consoleSpy).toHaveBeenCalledWith(
        'Authentication failed - token may be expired'
      )

      consoleSpy.mockRestore()
    })

    it('should handle network errors', async () => {
      localStorage.setItem('access_token', 'test-token')

      // Mock network error
      vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'))

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const { result } = renderHook(() => useAuthenticatedFetch())
      const authenticatedFetch = result.current

      await expect(authenticatedFetch('http://localhost:8000/api/test')).rejects.toThrow(
        'Network error'
      )

      expect(consoleSpy).toHaveBeenCalledWith('Fetch error:', expect.any(Error))

      consoleSpy.mockRestore()
    })
  })

  describe('Response handling', () => {
    it('should return fetch response object', async () => {
      localStorage.setItem('access_token', 'test-token')

      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ success: true })
      }

      vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse as any)

      const { result } = renderHook(() => useAuthenticatedFetch())
      const authenticatedFetch = result.current

      const response = await authenticatedFetch('http://localhost:8000/api/test')

      expect(response).toBe(mockResponse)
    })
  })
})
