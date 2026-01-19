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

// Auth Hook
export { useAuth } from './useAuth';

// Authenticated Fetch Hook
export { useAuthenticatedFetch } from './useAuthenticatedFetch';

// Admin Users Hook
export {
  useAdminUsers,
  useAdminUserDetail,
  useAdminUserActivity,
  useAdminUserStrategies,
  useAdminUserAuditLogs,
  useUpdateUserStatus,
} from './useAdminUsers';
