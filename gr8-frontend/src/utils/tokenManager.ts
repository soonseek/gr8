/**
 * TokenManager - JWT 토큰 관리 유틸리티
 *
 * 토큰 저장, 만료 확인, 갱신 필요 여부 확인 등의 기능 제공
 */

export class TokenManager {
  private readonly TOKEN_KEY = 'access_token'
  private readonly REFRESH_THRESHOLD = 60 * 60 * 1000  // 1시간 (밀리초)

  /**
   * localStorage에서 토큰 가져오기
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  /**
   * localStorage에 토큰 저장
   */
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token)
  }

  /**
   * localStorage에서 토큰 삭제
   */
  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY)
  }

  /**
   * 토큰 만료까지 남은 시간 (밀리초)
   * @param token JWT 토큰
   * @returns 밀리초 단위의 남은 시간 (음수이면 이미 만료)
   */
  getTimeUntilExpiry(token: string): number {
    try {
      // JWT 토큰 파싱: payload 부분 디코딩
      const payloadBase64 = token.split('.')[1]
      const payloadJson = atob(payloadBase64)
      const payload = JSON.parse(payloadJson)

      // exp는 초 단위의 Unix timestamp
      const exp = payload.exp * 1000  // 밀리초로 변환
      const now = Date.now()

      return exp - now
    } catch (error) {
      console.error('Failed to parse token:', error)
      return 0  // 파싱 실패 = 만료로 간주
    }
  }

  /**
   * 갱신 필요 여부 확인 (만료 1시간 전)
   * @param token JWT 토큰
   * @returns 갱신이 필요하면 true
   */
  shouldRefresh(token: string | null): boolean {
    if (!token) return false

    const timeLeft = this.getTimeUntilExpiry(token)

    // 0 < timeLeft < REFRESH_THRESHOLD (1시간)이면 갱신 필요
    return timeLeft > 0 && timeLeft < this.REFRESH_THRESHOLD
  }

  /**
   * 토큰 만료 여부 확인
   * @param token JWT 토큰
   * @returns 만료되었으면 true
   */
  isExpired(token: string | null): boolean {
    if (!token) return true

    const timeLeft = this.getTimeUntilExpiry(token)
    return timeLeft <= 0
  }

  /**
   * 토큰의 payload 디코딩 (지갑 주소 등 추출용)
   * @param token JWT 토큰
   * @returns 토큰 payload 또는 null
   */
  getPayload(token: string): Record<string, any> | null {
    try {
      const payloadBase64 = token.split('.')[1]
      const payloadJson = atob(payloadBase64)
      return JSON.parse(payloadJson)
    } catch (error) {
      console.error('Failed to decode token payload:', error)
      return null
    }
  }
}

// 싱글톤 인스턴스 export
export const tokenManager = new TokenManager()
