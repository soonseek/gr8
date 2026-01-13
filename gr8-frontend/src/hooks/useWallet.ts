/**
 * Custom Web3 Wallet Hooks
 *
 * Provides convenient wrappers around Wagmi's Web3 hooks
 * Exports useAccount, useConnect, useDisconnect, useSwitchChain
 */

import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';

/**
 * useWallet Hook
 *
 * Combines multiple Wagmi hooks into a single convenience hook
 * Returns all wallet-related state and functions
 *
 * @returns Object containing account info, connect/disconnect functions, and chain switch
 *
 * @example
 * ```tsx
 * function WalletComponent() {
 *   const { address, isConnected, connect, disconnect } = useWallet()
 *
 *   return (
 *     <div>
 *       <p>Connected: {isConnected}</p>
 *       <p>Address: {address}</p>
 *       <button onClick={() => connect()}>Connect Wallet</button>
 *       <button onClick={() => disconnect()}>Disconnect</button>
 *     </div>
 *   )
 * }
 * ```
 */
export function useWallet() {
  const account = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  return {
    // Account state
    address: account.address,
    chainId: account.chainId,
    isConnected: account.isConnected,
    isConnecting: isPending,
    isReconnecting: account.isReconnecting,
    isDisconnected: account.isDisconnected,
    connector: account.connector,

    // Functions
    connect,
    disconnect,
    switchChain,

    // Available connectors
    connectors,
  };
}

// Export individual hooks for direct use if needed
export { useAccount } from 'wagmi';
export { useConnect, type UseConnectReturnType } from 'wagmi';
export { useDisconnect } from 'wagmi';
export { useSwitchChain } from 'wagmi';

// Export types
export type UseWalletReturnType = ReturnType<typeof useWallet>;
