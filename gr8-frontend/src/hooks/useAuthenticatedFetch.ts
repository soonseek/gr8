/**
 * useAuthenticatedFetch Hook
 *
 * Provides a fetch wrapper that automatically includes JWT token in Authorization header
 * Handles 401 errors when token is missing or invalid
 */

export function useAuthenticatedFetch() {
  const getToken = () => localStorage.getItem('access_token')

  return async (url: string, options?: RequestInit) => {
    const token = getToken()

    const headers = {
      ...options?.headers,
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      })

      // Handle 401 Unauthorized
      if (response.status === 401) {
        console.error('Authentication failed - token may be expired')
        // Optionally trigger re-authentication flow here
      }

      return response
    } catch (error) {
      console.error('Fetch error:', error)
      throw error
    }
  }
}
