/**
 * Hooks module
 * Exports all custom hooks
 */

// Web3 Hooks
export {
  useWallet,
  useAccount,
  useConnect,
  useDisconnect,
  useSwitchChain,
} from './useWallet';
export type { UseWalletReturnType } from './useWallet';

// WalletConnect Hook
export { useWalletConnect } from './useWalletConnect';
