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
 * @example
 * ```tsx
 * <Web3Debug />
 * ```
 */
export function Web3Debug() {
  const { address, chainId, isConnected, isConnecting, connector } =
    useWallet();

  return (
    <div className="fixed top-4 right-4 bg-gray-800 dark:bg-gray-900 text-gray-100 dark:text-gray-100 p-4 rounded-lg shadow-lg border border-gray-700 dark:border-gray-700 z-50 font-mono text-sm max-w-xs">
      <h3 className="text-lg font-bold mb-3 text-white border-b border-gray-600 pb-2">
        Web3 Debug
      </h3>

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
  );
}
