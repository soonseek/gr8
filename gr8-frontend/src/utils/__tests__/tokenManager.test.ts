/**
 * TokenManager tests
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { tokenManager } from '../tokenManager'

describe('TokenManager', () => {
  beforeEach(() => {
    // localStorage 초기화
    localStorage.clear()
  })

  describe('getToken', () => {
    it('토큰이 없으면 null 반환', () => {
      expect(tokenManager.getToken()).toBeNull()
    })

    it('저장된 토큰 반환', () => {
      const testToken = 'test.jwt.token'
      localStorage.setItem('access_token', testToken)

      expect(tokenManager.getToken()).toBe(testToken)
    })
  })

  describe('setToken', () => {
    it('토큰을 localStorage에 저장', () => {
      const testToken = 'new.jwt.token'
      tokenManager.setToken(testToken)

      expect(localStorage.getItem('access_token')).toBe(testToken)
    })

    it('기존 토큰을 덮어쓰기', () => {
      tokenManager.setToken('old.token')
      tokenManager.setToken('new.token')

      expect(localStorage.getItem('access_token')).toBe('new.token')
    })
  })

  describe('clearToken', () => {
    it('토큰 삭제', () => {
      localStorage.setItem('access_token', 'some.token')
      tokenManager.clearToken()

      expect(localStorage.getItem('access_token')).toBeNull()
    })

    it('토큰이 없어도 에러 없이 처리', () => {
      expect(() => tokenManager.clearToken()).not.toThrow()
    })
  })

  describe('getTimeUntilExpiry', () => {
    it('유효한 JWT 토큰의 남은 시간 계산', () => {
      // 1시간 후 만료되는 토큰 생성
      const oneHourFromNow = Math.floor(Date.now() / 1000) + 3600
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
      const payload = btoa(JSON.stringify({ exp: oneHourFromNow, wallet_address: '0x123' }))
      const signature = 'signature'
      const token = `${header}.${payload}.${signature}`

      const timeLeft = tokenManager.getTimeUntilExpiry(token)

      // 1시간 = 3600초 = 3,600,000밀리초 (약간 오차 허용)
      expect(timeLeft).toBeGreaterThan(3500 * 1000) // 58분 이상
      expect(timeLeft).toBeLessThan(3700 * 1000)  // 62분 이하
    })

    it('만료된 토큰은 음수 반환', () => {
      // 1시간 전에 만료된 토큰
      const oneHourAgo = Math.floor(Date.now() / 1000) - 3600
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
      const payload = btoa(JSON.stringify({ exp: oneHourAgo }))
      const signature = 'signature'
      const token = `${header}.${payload}.${signature}`

      const timeLeft = tokenManager.getTimeUntilExpiry(token)

      expect(timeLeft).toBeLessThan(0)
    })

    it('잘못된 형식의 토큰은 0 반환', () => {
      const timeLeft = tokenManager.getTimeUntilExpiry('invalid.token')

      expect(timeLeft).toBe(0)
    })

    it('빈 토큰은 0 반환', () => {
      const timeLeft = tokenManager.getTimeUntilExpiry('')

      expect(timeLeft).toBe(0)
    })
  })

  describe('shouldRefresh', () => {
    it('만료 30분 전이면 갱신 필요 (true)', () => {
      // 30분 후 만료
      const thirtyMinutesFromNow = Math.floor(Date.now() / 1000) + 1800
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
      const payload = btoa(JSON.stringify({ exp: thirtyMinutesFromNow }))
      const signature = 'signature'
      const token = `${header}.${payload}.${signature}`

      expect(tokenManager.shouldRefresh(token)).toBe(true)
    })

    it('만료 2시간 전이면 갱신 불필요 (false)', () => {
      // 2시간 후 만료
      const twoHoursFromNow = Math.floor(Date.now() / 1000) + 7200
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
      const payload = btoa(JSON.stringify({ exp: twoHoursFromNow }))
      const signature = 'signature'
      const token = `${header}.${payload}.${signature}`

      expect(tokenManager.shouldRefresh(token)).toBe(false)
    })

    it('이미 만료된 토큰은 갱신 불필요 (false)', () => {
      // 1시간 전 만료
      const oneHourAgo = Math.floor(Date.now() / 1000) - 3600
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
      const payload = btoa(JSON.stringify({ exp: oneHourAgo }))
      const signature = 'signature'
      const token = `${header}.${payload}.${signature}`

      expect(tokenManager.shouldRefresh(token)).toBe(false)
    })

    it('null 토큰은 false 반환', () => {
      expect(tokenManager.shouldRefresh(null)).toBe(false)
    })
  })

  describe('isExpired', () => {
    it('만료된 토큰은 true', () => {
      // 1시간 전 만료
      const oneHourAgo = Math.floor(Date.now() / 1000) - 3600
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
      const payload = btoa(JSON.stringify({ exp: oneHourAgo }))
      const signature = 'signature'
      const token = `${header}.${payload}.${signature}`

      expect(tokenManager.isExpired(token)).toBe(true)
    })

    it('유효한 토큰은 false', () => {
      // 1시간 후 만료
      const oneHourFromNow = Math.floor(Date.now() / 1000) + 3600
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
      const payload = btoa(JSON.stringify({ exp: oneHourFromNow }))
      const signature = 'signature'
      const token = `${header}.${payload}.${signature}`

      expect(tokenManager.isExpired(token)).toBe(false)
    })

    it('null 토큰은 true (만료로 간주)', () => {
      expect(tokenManager.isExpired(null)).toBe(true)
    })

    it('빈 토큰은 true', () => {
      expect(tokenManager.isExpired('')).toBe(true)
    })

    it('잘못된 형식의 토큰은 true', () => {
      expect(tokenManager.isExpired('invalid.token')).toBe(true)
    })
  })

  describe('getPayload', () => {
    it('토큰 payload 추출', () => {
      const exp = Math.floor(Date.now() / 1000) + 3600
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
      const payload = btoa(JSON.stringify({
        exp: exp,
        wallet_address: '0xABCDEF1234567890',
        role: 'admin'
      }))
      const signature = 'signature'
      const token = `${header}.${payload}.${signature}`

      const decoded = tokenManager.getPayload(token)

      expect(decoded).not.toBeNull()
      expect(decoded?.wallet_address).toBe('0xABCDEF1234567890')
      expect(decoded?.role).toBe('admin')
    })

    it('잘못된 토큰은 null 반환', () => {
      expect(tokenManager.getPayload('invalid.token')).toBeNull()
    })

    it('빈 토큰은 null 반환', () => {
      expect(tokenManager.getPayload('')).toBeNull()
    })
  })
})
