/**
 * Wagmi Configuration for gr8
 * Sets up Web3 providers with Monad Testnet support
 */

import { createConfig, http } from 'wagmi';
import { injected, coinbaseWallet } from 'wagmi/connectors';

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
  ],
  ssr: true, // Enable Server-Side Rendering support
  transports: {
    [monadTestnet.id]: http(),
  },
});

/**
 * App metadata for WalletConnect
 * Used when WalletConnect is enabled
 */
export const appMetadata = {
  name: 'gr8',
  description: 'Decentralized automated trading platform',
  url:
    typeof window !== 'undefined' ? window.location.origin : 'https://gr8.baby',
  icons: ['https://gr8.baby/logo.png'],
} as const;
