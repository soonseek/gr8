/**
 * API utility with Axios interceptors for automatic token refresh
 */

import axios, { AxiosError } from 'axios'
import { tokenManager } from './tokenManager'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Axios 인스턴스 생성
export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000
})

// 진행 중인 갱신 요청 추적 (중복 갱신 방지)
let refreshPromise: Promise<string> | null = null

/**
 * 토큰 갱신 함수
 */
async function refreshToken(): Promise<string> {
  const oldToken = tokenManager.getToken()

  if (!oldToken) {
    throw new Error('No token to refresh')
  }

  const response = await axios.post(`${API_URL}/auth/refresh`, {
    token: oldToken
  })

  return response.data.access_token
}

// 요청 인터셉터 (토큰 자동 갱신)
api.interceptors.request.use(
  async (config) => {
    const token = tokenManager.getToken()

    // 토큰이 있고 갱신이 필요하면 먼저 갱신
    if (token && tokenManager.shouldRefresh(token)) {
      // 이미 진행 중인 갱신이 있으면 재사용
      if (!refreshPromise) {
        refreshPromise = refreshToken()
          .then((newToken) => {
            tokenManager.setToken(newToken)
            return newToken
          })
          .finally(() => {
            refreshPromise = null // 갱신 완료 후 초기화
          })
      }

      try {
        const newToken = await refreshPromise
        config.headers['Authorization'] = `Bearer ${newToken}`
      } catch (error) {
        // 갱신 실패 시 토큰 삭제 및 에러 던짐
        tokenManager.clearToken()
        window.location.href = '/?session_expired=true'
        return Promise.reject(error)
      }
    } else if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

// 응답 인터셉터 (만료 처리)
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // 401 에러 처리
    if (error.response?.status === 401) {
      tokenManager.clearToken()

      // 현재 페이지가 /login이 아니면 리디렉션
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/?session_expired=true'
      }
    }

    return Promise.reject(error)
  }
)

/**
 * 인증된 API 요청 wrapper (fetch 대신 사용)
 */
export async function authenticatedFetch(
  url: string,
  options?: RequestInit
): Promise<Response> {
  const token = tokenManager.getToken()

  if (!token) {
    throw new Error('No authentication token')
  }

  return fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      'Authorization': `Bearer ${token}`
    }
  })
}
