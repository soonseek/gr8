/**
 * Web3Debug Component
 *
 * Development component for displaying Web3 wallet connection state
 * Shows connection status, wallet address, and current chain ID
 *
 * This component is intended for development purposes only
 * and should be removed or disabled in production
 */

import { useWallet, useAuth } from '@/hooks';
import { useState, useEffect } from 'react';
import { ChevronUp, Bug, Copy, Check, RefreshCw, AlertCircle } from 'lucide-react';

/**
 * Shorten wallet address for display
 * Converts 0x1234567890123456789012345678901234567890 to 0x1234...7890
 */
function shortenAddress(address?: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Copy text to clipboard and show feedback
 */
async function copyToClipboard(text: string, onCopyStart: () => void, onCopyEnd: () => void) {
  try {
    await navigator.clipboard.writeText(text);
    onCopyStart();
    setTimeout(onCopyEnd, 2000); // Reset after 2 seconds
  } catch (error) {
    console.error('Failed to copy:', error);
  }
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
  const [copiedToken, setCopiedToken] = useState(false);
  const [tokenStatus, setTokenStatus] = useState<'valid' | 'expired' | 'unknown'>('unknown');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { address, chainId, isConnected, isConnecting, connector } =
    useWallet();
  const { token, logout } = useAuth();

  // Check token status when component mounts or token changes
  useEffect(() => {
    if (!token) {
      setTokenStatus('unknown');
      return;
    }

    try {
      // Decode JWT to check expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp;
      const now = Math.floor(Date.now() / 1000);

      if (exp < now) {
        setTokenStatus('expired');
      } else {
        setTokenStatus('valid');
      }
    } catch (error) {
      setTokenStatus('unknown');
    }
  }, [token]);

  // Handle token refresh (logout to trigger re-login)
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await logout();
      // Force page reload to trigger fresh login
      window.location.reload();
    } catch (error) {
      console.error('Failed to refresh token:', error);
      setIsRefreshing(false);
    }
  };

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

      {/* Bearer Token (copyable) */}
      {token && (
        <div className="mt-3 pt-3 border-t border-gray-600">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="text-gray-400 text-xs">Bearer Token:</div>
              {/* Token Status Badge */}
              {tokenStatus === 'valid' && (
                <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded">
                  유효함
                </span>
              )}
              {tokenStatus === 'expired' && (
                <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  만료됨
                </span>
              )}
              {tokenStatus === 'unknown' && (
                <span className="text-xs bg-yellow-600 text-white px-2 py-0.5 rounded">
                  확인 불가
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 text-xs disabled:opacity-50"
                title={tokenStatus === 'expired' ? "토큰 재발급 (재로그인)" : "토큰 갱신"}
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? '갱신 중...' : '갱신'}
              </button>
              {/* Copy Button */}
              <button
                onClick={() => copyToClipboard(token, () => setCopiedToken(true), () => setCopiedToken(false))}
                className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 text-xs"
                title="클립보드에 복사"
              >
                {copiedToken ? (
                  <>
                    <Check className="w-3 h-3" />
                    복사됨
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    복사
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="bg-gray-900 p-2 rounded border border-gray-700 max-h-20 overflow-y-auto">
            <code className="text-green-400 text-xs break-all block">{token}</code>
          </div>
          <div className="text-gray-500 text-xs mt-1">
            💡 Swagger에서 <code className="text-gray-400">Authorization: Bearer &lt;token&gt;</code>으로 사용
          </div>
          {/* Expired Warning */}
          {tokenStatus === 'expired' && (
            <div className="mt-2 p-2 bg-red-900/30 border border-red-700 rounded">
              <div className="text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>토큰이 만료되었습니다. '갱신' 버튼을 클릭하여 재로그인하세요.</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Logout Button (if logged in) */}
      {isConnected && token && (
        <div className="mt-3 pt-3 border-t border-gray-600">
          <button
            onClick={logout}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            로그아웃
          </button>
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
