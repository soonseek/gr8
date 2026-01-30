/**
 * WalletSelectorModal Component
 *
 * Modal for selecting wallet connection method
 * Shows MetaMask, WalletConnect, and other available wallets
 * Supports QR code and deep link connections
 */

import { useState } from 'react';
import { useConnect } from 'wagmi';
import { toast } from 'react-hot-toast';

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

interface WalletSelectorModalProps {
  onClose: () => void;
  onWalletConnectSelect: () => void; // Callback when WalletConnect is selected
  onTrustWalletSelect?: () => void; // Callback when Trust Wallet is selected (mobile deep link)
}

/**
 * WalletSelectorModal Component
 *
 * Displays available wallet connection options
 * MetaMask is shown at the top, followed by WalletConnect
 *
 * @example
 * ```tsx
 * <WalletSelectorModal
 *   onClose={() => setShowModal(false)}
 *   onWalletConnectSelect={() => setShowQRCode(true)}
 * />
 * ```
 */
export function WalletSelectorModal({
  onClose,
  onWalletConnectSelect,
  onTrustWalletSelect,
}: WalletSelectorModalProps) {
  const { connect, connectors, isPending } = useConnect();
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  // Debug: Log connectors when modal opens
  console.log('=== WalletSelectorModal Rendered ===');
  console.log('Available connectors:', connectors.map(c => ({ 
    id: c.id, 
    name: c.name, 
    type: c.type,
    ready: c.ready 
  })));
  console.log('isPending:', isPending);
  console.log('Total connectors:', connectors.length);

  // Check if MetaMask is installed
  const hasMetaMask = typeof window !== 'undefined' && window.ethereum?.isMetaMask;
  console.log('MetaMask installed:', hasMetaMask);

  // Explicit wallet list - only show 3 wallets: MetaMask, Trust Wallet, WalletConnect
  // Don't use wagmi's connectors list to avoid duplicates and unwanted wallets
  const availableWallets = [
    {
      id: 'injected',
      name: 'MetaMask',
      description: '브라우저 확장프로그램',
      icon: '🦊',
      disabled: !hasMetaMask,
    },
    {
      id: 'trust',
      name: 'Trust Wallet',
      description: '모바일 앱 (WalletConnect)',
      icon: '🛡️',
      disabled: false,
    },
    {
      id: 'walletConnect',
      name: 'WalletConnect',
      description: '100+ 지갑 지원 (OKX, Coinbase, Rainbow 등)',
      icon: '🔗',
      disabled: false,
    },
  ];

  const handleWalletSelect = async (walletType: string) => {
    console.log('🔵 handleWalletSelect called with:', walletType);
    setSelectedWallet(walletType);
    
    console.log('🔵 Available connectors:', connectors.map(c => ({ id: c.id, name: c.name })));

    // Case 3: Trust Wallet (WalletConnect only - mobile app)
    if (walletType === 'trust') {
      console.log('🔵 Trust Wallet selected, calling onTrustWalletSelect');
      if (onTrustWalletSelect) {
        onTrustWalletSelect();
      }
      return;
    }

    // Find connector for wagmi wallets
    let connector = connectors.find((c) => c.id === walletType);
    
    console.log('🔵 Connector found:', connector?.id, connector?.name);
    
    if (!connector) {
      console.log('🔴 Connector not found for', walletType);
      console.log('🔵 Trying alternative connectors...');
      
      // Try alternative connector names
      connector = connectors.find((c) => 
        c.id === 'io.metamask' || 
        c.id === 'metaMask' ||
        c.id === 'metaMaskSDK' ||
        c.type === 'injected' ||
        c.name?.toLowerCase().includes('metamask')
      );
      
      if (connector) {
        console.log('✅ Found alternative connector:', { id: connector.id, name: connector.name, type: connector.type });
      } else {
        console.log('🔴 No alternative connector found');
        console.log('🔵 All available connectors:', connectors);
        toast.error('MetaMask connector를 찾을 수 없습니다. MetaMask가 설치되어 있는지 확인해주세요.');
        return;
      }
    }

    try {
      // WalletConnect connection - delegate to parent
      if (walletType === 'walletConnect') {
        console.log('🔵 WalletConnect selected, calling onWalletConnectSelect');
        onWalletConnectSelect();
        return;
      }

      // MetaMask and other injected wallets
      console.log('🔵 Connecting with connector:', connector.id, connector.name);
      const result = await connect({ connector });
      console.log('✅ Connection successful:', result);
      onClose();
      toast.success('지갑 연결 성공!');
    } catch (error: unknown) {
      console.error('🔴 Wallet connection failed:', error);

      // 에러 메시지 결정
      let errorMessage = '지갑 연결에 실패했습니다';

      if (error instanceof Error) {
        console.error('🔴 Error message:', error.message);
        // User rejected request (error code 4001)
        if (error.message.includes('4001')) {
          errorMessage = '연결이 거부되었습니다';
        }
      }

      toast.error(errorMessage);
      setSelectedWallet(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative bg-gray-800 text-gray-100 rounded-lg p-6
                      max-w-[600px] w-full mx-4 shadow-xl
                      max-sm:max-w-full max-sm:h-full max-sm:rounded-none
                      max-sm:inset-0 max-sm:m-0 max-sm:relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200
                     transition-colors p-2 rounded-lg hover:bg-gray-700"
          aria-label="닫기"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Header */}
        <h3 className="text-xl font-bold mb-4 pr-12">지갑 선택</h3>

        {/* Wallet List */}
        <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]">
          {availableWallets.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => {
                console.log('🔵 Button clicked for wallet:', wallet.id);
                handleWalletSelect(wallet.id);
              }}
              disabled={isPending || wallet.disabled}
              className="w-full flex items-center gap-3 p-4 rounded-lg
                       bg-gray-700 hover:bg-gray-600
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors min-h-[60px]"
            >
              {/* Wallet Icon */}
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-2xl flex-shrink-0">
                {wallet.icon}
              </div>

              {/* Wallet Info */}
              <div className="flex-1 text-left">
                <div className="font-semibold text-base">
                  {wallet.name}
                  {wallet.disabled && <span className="ml-2 text-xs text-red-400">(미설치)</span>}
                </div>
                <div className="text-sm text-gray-400">
                  {wallet.description}
                </div>
              </div>

              {/* Loading Spinner */}
              {isPending && selectedWallet === wallet.id && <Spinner />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
