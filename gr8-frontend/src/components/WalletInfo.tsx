/**
 * WalletInfo Component
 *
 * Displays connected wallet information with logout button
 * Shows wallet address (truncated), role, and connection status
 */

import { useAuthContext } from '@/contexts/AuthContext'
import { useAccount } from 'wagmi'

export function WalletInfo() {
  const { user, logout, isAuthenticated } = useAuthContext()
  const { address } = useAccount()

  if (!isAuthenticated || !address) {
    return null
  }

  // Truncate address for display
  const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`

  return (
    <div className="flex items-center gap-3">
      {/* Connection Badge */}
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
        <span className="text-sm text-gray-400">연결됨</span>
      </div>

      {/* Wallet Address */}
      <div className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
        <span className="text-sm text-gray-300">{truncatedAddress}</span>
        {user?.role === 'admin' && (
          <span className="ml-2 text-xs bg-purple-600 text-white px-2 py-1 rounded">
            Admin
          </span>
        )}
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg
                   transition-colors duration-200 text-sm"
      >
        로그아웃
      </button>
    </div>
  )
}
