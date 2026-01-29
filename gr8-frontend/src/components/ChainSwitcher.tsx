/**
 * ChainSwitcher Component
 * 
 * Detects wrong chain and prompts user to switch to Monad L1
 */

import { useEffect, useState } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import { toast } from 'react-hot-toast';

const MONAD_CHAIN_ID = 4348; // Monad L1 testnet chain ID

export function ChainSwitcher() {
  const { chainId, isConnected } = useAccount();
  const { switchChain } = useSwitchChain();
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (isConnected && chainId && chainId !== MONAD_CHAIN_ID) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  }, [chainId, isConnected]);

  if (!showWarning) return null;

  const handleSwitch = async () => {
    try {
      await switchChain?.({ chainId: MONAD_CHAIN_ID });
      toast.success('Monad L1으로 전환되었습니다');
      setShowWarning(false);
    } catch (error) {
      console.error('Chain switch failed:', error);
      toast.error('체인 전환에 실패했습니다');
    }
  };

  const handleDismiss = () => {
    setShowWarning(false);
    toast('일부 기능이 제한될 수 있습니다', { icon: '⚠️' });
  };

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-yellow-900/90 border border-yellow-700 text-yellow-100 px-6 py-4 rounded-lg shadow-xl z-50 max-w-md">
      <div className="flex items-start gap-3">
        <span className="text-2xl">⚠️</span>
        <div className="flex-1">
          <h3 className="font-bold text-sm mb-1">잘못된 체인에 연결되어 있습니다</h3>
          <p className="text-xs mb-3">
            gr8은 Monad L1 체인이 필요합니다. 현재 체인: {chainId}
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleSwitch}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
            >
              Monad L1로 전환
            </button>
            <button
              onClick={handleDismiss}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm transition-colors"
            >
              나중에
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
