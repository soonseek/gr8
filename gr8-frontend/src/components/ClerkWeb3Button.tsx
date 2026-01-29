/**
 * ClerkWeb3Button - Clerk + Web3 Wallet Integration
 * 
 * Uses Clerk for authentication while maintaining Web3 wallet connection
 * Keeps decentralization: wallet address = user identity
 */

import { useClerk, useUser } from '@clerk/clerk-react';
import { useAccount } from 'wagmi';
import { useConnect, useDisconnect } from 'wagmi';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { WalletSelectorModal } from './WalletSelectorModal';

export function ClerkWeb3Button() {
  const { signIn, signOut, user: clerkUser } = useClerk();
  const { user } = useUser();
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  
  const [showWalletSelector, setShowWalletSelector] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Auto-authenticate with Clerk when wallet connects
  useEffect(() => {
    if (isConnected && address && !user && !isAuthenticating) {
      handleClerkAuth();
    }
  }, [isConnected, address, user]);

  const handleClerkAuth = async () => {
    if (!address) return;
    
    setIsAuthenticating(true);
    try {
      // Create Clerk session with Web3 wallet address
      // Clerk will handle the session management
      await signIn?.create({
        identifier: address,
        strategy: 'web3_metamask_signature',
      });
      
      toast.success('로그인 완료!');
    } catch (error) {
      console.error('Clerk auth failed:', error);
      // Fallback: Continue without Clerk session (still connected to wallet)
      toast('지갑은 연결되었으나 세션 생성에 실패했습니다', { icon: 'ℹ️' });
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleConnect = () => {
    setShowWalletSelector(true);
  };

  const handleDisconnect = async () => {
    try {
      await signOut?.();
      disconnect();
      toast.success('로그아웃되었습니다');
    } catch (error) {
      console.error('Disconnect failed:', error);
      disconnect(); // Force disconnect even if Clerk fails
      toast.success('로그아웃되었습니다');
    }
  };

  const handleWalletConnectSelect = async () => {
    setShowWalletSelector(false);
    const connector = connectors.find((c) => c.id === 'walletConnect');
    if (connector) {
      try {
        await connect({ connector });
      } catch (error) {
        console.error('Connection failed:', error);
        toast.error('연결에 실패했습니다');
      }
    }
  };

  // Show user info if connected
  if (isConnected && address) {
    const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
    
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
          {user?.publicMetadata?.role === 'admin' && (
            <span className="ml-2 text-xs bg-purple-600 text-white px-2 py-1 rounded">
              Admin
            </span>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleDisconnect}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm"
        >
          로그아웃
        </button>
      </div>
    );
  }

  // Show connect button
  return (
    <>
      <button
        onClick={handleConnect}
        disabled={isAuthenticating}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg w-full sm:w-auto min-h-[44px] transition-colors duration-200 disabled:opacity-50"
      >
        {isAuthenticating ? '인증 중...' : '지갑 연결하기'}
      </button>

      {showWalletSelector && (
        <WalletSelectorModal
          onClose={() => setShowWalletSelector(false)}
          onWalletConnectSelect={handleWalletConnectSelect}
          onTrustWalletSelect={handleWalletConnectSelect}
        />
      )}
    </>
  );
}
