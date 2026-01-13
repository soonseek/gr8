/**
 * Wagmi Configuration for gr8
 * Sets up Web3 providers with Monad Testnet support
 */

import { createConfig, http } from 'wagmi';
import { injected, coinbaseWallet, walletConnect } from 'wagmi/connectors';

/**
 * Monad Testnet Chain Configuration
 *
 * Chain ID: 4348
 * Network: Monad Testnet
 * RPC: https://testnet-rpc.monad.xyz
 * Explorer: https://testnet-explorer.monad.xyz
 */
export const monadTestnet = {
  id: 4348,
  name: 'Monad Testnet',
  network: 'monad testnet',
  nativeCurrency: {
    name: 'MON',
    symbol: 'MON',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.monad.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Monad Explorer',
      url: 'https://testnet-explorer.monad.xyz',
    },
  },
  testnet: true,
} as const;

/**
 * WalletConnect Project ID
 * Get your Project ID at https://cloud.walletconnect.com/
 */
const WC_PROJECT_ID = import.meta.env.VITE_WC_PROJECT_ID;

/**
 * App metadata for WalletConnect
 * Used when WalletConnect is enabled
 * Must be declared before createConfig() to avoid Temporal Dead Zone error
 */
export const appMetadata = {
  name: 'gr8',
  description: 'Decentralized automated trading platform',
  url:
    typeof window !== 'undefined' ? window.location.origin : 'https://gr8.baby',
  icons: ['https://gr8.baby/logo.png'],
};

/**
 * Wagmi Config
 *
 * Configures Web3 providers with:
 * - Monad Testnet chain
 * - MetaMask & other injected wallets
 * - Coinbase Wallet
 * - WalletConnect (optional, requires VITE_WC_PROJECT_ID)
 */
export const config = createConfig({
  chains: [monadTestnet],
  connectors: [
    injected({
      shimDisconnect: true,
    }),
    coinbaseWallet({
      appName: 'gr8',
      appLogoUrl: 'https://gr8.baby/logo.png',
    }),
    // WalletConnect connector (only if project ID is configured)
    ...(WC_PROJECT_ID && WC_PROJECT_ID !== 'your_walletconnect_project_id_here'
      ? [
          walletConnect({
            projectId: WC_PROJECT_ID,
            metadata: appMetadata,
          }),
        ]
      : []),
  ],
  ssr: true, // Enable Server-Side Rendering support
  transports: {
    [monadTestnet.id]: http(),
  },
});
