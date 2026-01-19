/**
 * Web3Debug Component
 *
 * Development component for displaying Web3 wallet connection state
 * Shows connection status, wallet address, and current chain ID
 *
 * This component is intended for development purposes only
 * and should be removed or disabled in production
 */

import { useWallet } from '@/hooks';
import { useState } from 'react';
import { ChevronUp, Bug } from 'lucide-react';

/**
 * Shorten wallet address for display
 * Converts 0x1234567890123456789012345678901234567890 to 0x1234...7890
 */
function shortenAddress(address?: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Web3Debug Component
 *
 * Displays:
 * - Connection status (Connected/Disconnected)
 * - Wallet address (shortened format)
 * - Current chain ID
 * - Connector name
 *
 * Collapsed by default to avoid being intrusive during development
 *
 * @example
 * ```tsx
 * <Web3Debug />
 * ```
 */
export function Web3Debug() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { address, chainId, isConnected, isConnecting, connector } =
    useWallet();

  return (
    <div className="fixed top-4 right-4 z-50 font-mono text-sm">
      {/* Collapsed state - Small button */}
      {isCollapsed ? (
        <button
          onClick={() => setIsCollapsed(false)}
          className="bg-gray-800 hover:bg-gray-700 text-gray-100 p-2 rounded-lg shadow-lg border border-gray-700 transition-colors"
          title="Web3 Debug 정보 보기"
          aria-label="Web3 Debug 확장"
        >
          <Bug className="w-5 h-5" />
        </button>
      ) : (
        <div className="bg-gray-800 dark:bg-gray-900 text-gray-100 dark:text-gray-100 p-4 rounded-lg shadow-lg border border-gray-700 dark:border-gray-700 max-w-xs">
          {/* Header with collapse button */}
          <div className="flex items-center justify-between mb-3 border-b border-gray-600 pb-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Bug className="w-5 h-5" />
              Web3 Debug
            </h3>
            <button
              onClick={() => setIsCollapsed(true)}
              className="text-gray-400 hover:text-gray-100 transition-colors"
              title="접기"
              aria-label="Web3 Debug 접기"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
          </div>

      <div className="space-y-2">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Status:</span>
          <span
            className={`px-2 py-1 rounded ${
              isConnected ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
            }`}
          >
            {isConnecting
              ? 'Connecting...'
              : isConnected
                ? 'Connected'
                : 'Disconnected'}
          </span>
        </div>

        {/* Wallet Address */}
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Address:</span>
          <span className="text-white">
            {address ? shortenAddress(address) : 'Not connected'}
          </span>
        </div>

        {/* Chain ID */}
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Chain ID:</span>
          <span className="text-white">
            {chainId ?? 'N/A'}
            {chainId === 4348 && ' (Monad Testnet)'}
          </span>
        </div>

        {/* Connector */}
        {connector && (
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Connector:</span>
            <span className="text-white">{connector.name}</span>
          </div>
        )}
      </div>

      {/* Full Address (copyable) */}
      {address && (
        <div className="mt-3 pt-3 border-t border-gray-600">
          <div className="text-gray-400 text-xs mb-1">Full Address:</div>
          <div className="text-white text-xs break-all">{address}</div>
        </div>
      )}

          {/* Info Badge */}
          <div className="mt-3 pt-3 border-t border-gray-600">
            <div className="text-yellow-400 text-xs">
              ℹ️ Development only - Remove in production
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
