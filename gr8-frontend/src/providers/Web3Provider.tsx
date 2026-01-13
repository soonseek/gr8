/**
 * Web3Provider Component
 *
 * Wraps the application with WagmiProvider and React Query's QueryClientProvider
 * Enables Web3 functionality throughout the app
 */

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '@/config/wagmi';
import type { ReactNode } from 'react';

/**
 * React Query Client for managing server state
 * Configured with sensible defaults for Web3 apps
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
      staleTime: 30000, // 30 seconds
    },
  },
});

/**
 * Web3Provider Component
 *
 * @param children - React components to be wrapped
 *
 * @example
 * ```tsx
 * <Web3Provider>
 *   <App />
 * </Web3Provider>
 * ```
 */
export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
