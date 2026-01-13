/**
 * WalletConnectButton Component
 *
 * "지갑 연결하기" 버튼 - MetaMask 지갑 연결 UI
 * MetaMask 미설치 안내, 로딩 상태, 반응형 디자인 포함
 */

import { useState, useEffect, useRef } from 'react';
import { useConnect, useAccount } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useWalletStore } from '@/stores';

/**
 * Loading Spinner Component
 */
function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

/**
 * Toast Message Component
 */
function Toast({
  message,
  type,
  onRetry,
}: {
  message: string;
  type: 'success' | 'error';
  onRetry?: () => void;
}) {
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
 * WalletConnectButton Component
 *
 * Displays "Connect Wallet" button when not connected
 * Handles MetaMask installation detection
 * Shows loading state during connection
 *
 * @example
 * ```tsx
 * <WalletConnectButton />
 * ```
 */
export function WalletConnectButton() {
  const { connect, isPending } = useConnect();
  const { address, isConnected, chainId } = useAccount();
  const { setWallet } = useWalletStore();
  const [showMetaMaskModal, setShowMetaMaskModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  // Track previous connection state to detect when user approves
  const wasConnected = useRef(false);

  // MetaMask 설치 감지
  const hasMetaMask =
    typeof window !== 'undefined' &&
    (window.ethereum?.isMetaMask ||
      window.ethereum?.providers?.some(
        (p: { isMetaMask?: boolean }) => p.isMetaMask
      ));

  /**
   * Handle wallet connection
   */
  const handleConnect = async () => {
    if (!hasMetaMask) {
      setShowMetaMaskModal(true);
      return;
    }

    setIsLoading(true);
    setToast(null);

    try {
      await connect({ connector: injected() });
      // Don't show toast here - wait for useEffect to detect actual connection
    } catch (error: unknown) {
      console.error('Wallet connection failed:', error);

      // 에러 메시지 결정
      let errorMessage = '지갑 연결에 실패했습니다';

      if (error instanceof Error) {
        // User rejected request (error code 4001)
        if (error.message.includes('4001')) {
          errorMessage = '연결이 거부되었습니다';
        } else {
          errorMessage = error.message;
        }
      }

      setToast({
        message: errorMessage,
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 연결 상태가 변경되면 store 업데이트
  useEffect(() => {
    if (address && isConnected) {
      setWallet({ address, chainId: chainId || 4348 });

      // Show success toast only when transitioning from not connected to connected
      if (!wasConnected.current) {
        setToast({
          message: '지갑이 연결되었습니다',
          type: 'success',
        });
        setTimeout(() => setToast(null), 3000);
        wasConnected.current = true;
      }
    } else {
      // Reset when disconnected
      wasConnected.current = false;
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

      <button
        onClick={handleConnect}
        disabled={isLoading || isPending}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg
                   w-full sm:w-auto min-h-[44px] min-w-[44px]
                   transition-colors duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading || isPending ? (
          <span className="flex items-center justify-center">
            <Spinner />
            <span className="ml-2">연결 중...</span>
          </span>
        ) : (
          '지갑 연결하기'
        )}
      </button>

      {showMetaMaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowMetaMaskModal(false)}
          />

          {/* Modal */}
          <div
            className="relative bg-gray-800 text-gray-100 rounded-lg p-6
                          max-w-md w-full mx-4 shadow-xl"
          >
            <h3 className="text-xl font-bold mb-4">
              MetaMask 확장프로그램을 설치해주세요
            </h3>

            <p className="text-gray-300 mb-6">
              gr8에서 Web3 지갑을 사용하려면 MetaMask 브라우저 확장프로그램이
              필요합니다.
            </p>

            <div className="flex flex-col gap-3">
              <a
                href="https://metamask.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg
                           text-center transition-colors"
              >
                설치하러 가기
              </a>

              <button
                onClick={() => setShowMetaMaskModal(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg
                           transition-colors"
              >
                나중에 하기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
