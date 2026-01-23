import { createContext, useContext } from 'react'
import { useAuth } from '@/hooks'

// Create context type
interface AuthContextType {
  isAuthenticated: boolean
  token: string | null
  user: {
    walletAddress: string
    role: 'user' | 'admin'
  } | null
  isLoading: boolean
  isLoggingIn: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
}

// Create context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth()

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

// Custom hook to use the auth context
export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
