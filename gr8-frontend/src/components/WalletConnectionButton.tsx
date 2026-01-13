/**
 * WalletConnectionButton Component
 *
 * "지갑 연결하기" 버튼 - 지갑 연결 UI
 * MetaMask, WalletConnect 등 다양한 지갑 연결 지원
 * WalletSelectorModal, QR 코드 표시 포함
 */

import { useState, useRef, useEffect } from 'react';
import { useAccount } from '@/hooks';
import { useWalletStore } from '@/stores';
import { WalletSelectorModal } from './WalletSelectorModal';
import { useConnect } from 'wagmi';

/**
 * Toast Message Component
 */
interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onRetry?: () => void;
}

function Toast({ message, type, onRetry }: ToastProps) {
  const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3`}
    >
      <span>{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-sm transition-colors"
        >
          재시도
        </button>
      )}
    </div>
  );
}

/**
 * WalletConnectionButton Component
 *
 * Displays "Connect Wallet" button when not connected
 * Opens wallet selector modal when clicked
 * Shows QR code for WalletConnect on desktop
 *
 * @example
 * ```tsx
 * <WalletConnectionButton />
 * ```
 */
export function WalletConnectionButton() {
  const { address, isConnected, chainId } = useAccount();
  const { setWallet } = useWalletStore();
  const { connectors, connect } = useConnect();

  const [showWalletSelector, setShowWalletSelector] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  // Track previous connection state to detect when user approves
  const wasConnected = useRef(false);

  /**
   * Handle wallet connection
   */
  const handleConnect = () => {
    setShowWalletSelector(true);
    setToast(null);
  };

  /**
   * Handle WalletConnect selection
   * For MVP: Use wagmi's built-in WalletConnect handling
   * wagmi will automatically show the WalletConnect modal with QR code
   */
  const handleWalletConnectSelect = async () => {
    // Close wallet selector
    setShowWalletSelector(false);

    // Find the walletConnect connector
    const walletConnectConnector = connectors.find(
      (c) => c.id === 'walletConnect'
    );

    if (!walletConnectConnector) {
      console.error(
        'WalletConnect connector not found. Check VITE_WC_PROJECT_ID env variable.'
      );
      setToast({
        message:
          'WalletConnect이 설정되지 않았습니다. VITE_WC_PROJECT_ID 환경변수를 확인해주세요.',
        type: 'error',
      });
      setTimeout(() => setToast(null), 5000);
      return;
    }

    // For MVP: Let wagmi handle WalletConnect QR code natively
    // This will automatically open the WalletConnect modal with QR code
    try {
      await connect({ connector: walletConnectConnector });
      // If connection succeeds, wallet store will be updated
      // If user needs to scan QR code, wagmi will show it automatically
    } catch (error: unknown) {
      console.error('WalletConnect connection failed:', error);

      let errorMessage = '지갑 연결에 실패했습니다';
      if (error instanceof Error) {
        if (error.message.includes('4001')) {
          errorMessage = '연결이 거부되었습니다';
        }
      }

      setToast({
        message: errorMessage,
        type: 'error',
      });
      setTimeout(() => setToast(null), 3000);
    }
  };

  /**
   * Handle Trust Wallet selection
   * For MVP: Use wagmi's built-in WalletConnect handling
   */
  const handleTrustWalletSelect = async () => {
    // Close wallet selector
    setShowWalletSelector(false);

    // Find the walletConnect connector
    const walletConnectConnector = connectors.find(
      (c) => c.id === 'walletConnect'
    );

    if (!walletConnectConnector) {
      console.error(
        'WalletConnect connector not found. Check VITE_WC_PROJECT_ID env variable.'
      );
      setToast({
        message:
          'WalletConnect이 설정되지 않았습니다. VITE_WC_PROJECT_ID 환경변수를 확인해주세요.',
        type: 'error',
      });
      setTimeout(() => setToast(null), 5000);
      return;
    }

    // For MVP: Let wagmi handle WalletConnect QR code natively
    // Users can select Trust Wallet from the WalletConnect modal
    try {
      await connect({ connector: walletConnectConnector });
    } catch (error: unknown) {
      console.error('WalletConnect connection failed:', error);

      let errorMessage = '지갑 연결에 실패했습니다';
      if (error instanceof Error) {
        if (error.message.includes('4001')) {
          errorMessage = '연결이 거부되었습니다';
        }
      }

      setToast({
        message: errorMessage,
        type: 'error',
      });
      setTimeout(() => setToast(null), 3000);
    }
  };

  // Show success toast when connecting
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (address && isConnected && !wasConnected.current) {
      setToast({
        message: '지갑이 연결되었습니다',
        type: 'success',
      });
      setTimeout(() => setToast(null), 3000);
      wasConnected.current = true;
    }

    // Reset when disconnected
    if (!isConnected) {
      wasConnected.current = false;
    }
  }, [address, isConnected]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // 연결 상태가 변경되면 store 업데이트
  useEffect(() => {
    if (address && isConnected) {
      setWallet({ address, chainId: chainId || 4348 });
    }
  }, [address, isConnected, chainId, setWallet]);

  // 연결되지 않은 상태에서만 버튼 표시
  if (isConnected) {
    return null; // Story 2.5에서 지갑 주소 표시
  }

  return (
    <>
      {/* Toast Message */}
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Connect Button */}
      <button
        onClick={handleConnect}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg
                   w-full sm:w-auto min-h-[44px] min-w-[44px]
                   transition-colors duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        지갑 연결하기
      </button>

      {/* Wallet Selector Modal */}
      {showWalletSelector && (
        <WalletSelectorModal
          onClose={() => setShowWalletSelector(false)}
          onWalletConnectSelect={handleWalletConnectSelect}
          onTrustWalletSelect={handleTrustWalletSelect}
        />
      )}
    </>
  );
}
