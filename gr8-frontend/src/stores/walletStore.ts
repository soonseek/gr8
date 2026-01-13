/**
 * Wallet Store (Zustand)
 *
 * Manages Web3 wallet connection state
 * Persists to localStorage for session recovery
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Wallet State Interface
 */
interface WalletState {
  /** Connected wallet address (0x...) */
  address: string | null;
  /** Current blockchain chain ID */
  chainId: number | null;
  /** Whether wallet is connected */
  isConnected: boolean;
  /** Update wallet state with address and chain ID */
  setWallet: (data: { address: string; chainId: number }) => void;
  /** Clear wallet state (disconnect) */
  clearWallet: () => void;
}

/**
 * Wallet Store
 *
 * Uses persist middleware to save state to localStorage
 * This allows wallet connection to survive page refreshes
 */
export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      // Initial state
      address: null,
      chainId: null,
      isConnected: false,

      // Actions
      setWallet: (data) =>
        set({
          address: data.address,
          chainId: data.chainId,
          isConnected: true,
        }),

      clearWallet: () =>
        set({
          address: null,
          chainId: null,
          isConnected: false,
        }),
    }),
    {
      name: 'gr8-wallet-storage', // localStorage key
    }
  )
);
