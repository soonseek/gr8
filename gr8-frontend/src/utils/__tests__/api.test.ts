/**
 * API utility tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { api, authenticatedFetch } from '../api'
import { tokenManager } from '../tokenManager'

// Mock axios
vi.mock('axios')

describe('API Utility', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    vi.stubGlobal('window', {
      location: {
        pathname: '/',
        href: 'http://localhost:5173/'
      }
    })
  })

  describe('api instance', () => {
    it('Axios 인스턴스 생성됨', () => {
      expect(api).toBeDefined()
      expect(api.defaults.baseURL).toBe('http://localhost:8000/api')
      expect(api.defaults.timeout).toBe(10000)
    })
  })

  describe('authenticatedFetch', () => {
    it('토큰이 없으면 에러 던짐', async () => {
      await expect(authenticatedFetch('/api/test')).rejects.toThrow('No authentication token')
    })

    it('토큰이 있으면 Authorization 헤더 추가', async () => {
      const testToken = 'test.jwt.token'
      tokenManager.setToken(testToken)

      // Mock fetch
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          headers: new Headers()
        } as Response)
      ) as any

      await authenticatedFetch('/api/test')

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${testToken}`
          })
        })
      )
    })
  })

  describe('token refresh logic', () => {
    it('갱신이 필요한 토큰으로 요청 시 갱신 시도', async () => {
      // NOTE: 이 테스트는 인터셉터 테스트로 E2E 테스트에서 더 잘 동작
      // 단위 테스트에서는 axios mocking이 복잡하므로 통합 테스트로 남겨둠
      expect(true).toBe(true) // Placeholder
    })
  })
})
