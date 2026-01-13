/**
 * useWalletConnect Hook
 *
 * Hook for handling WalletConnect connections
 * Supports both QR codes (desktop) and deep links (mobile)
 */

import { useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import {
  isMobile,
  openWalletDeepLink,
  getWalletAppStoreLink,
  type SupportedWallet,
} from '@/utils/mobile';

interface UseWalletConnectReturn {
  showQRCode: boolean;
  showAppStoreButton: boolean;
  appStoreLink: string;
  selectedWallet: SupportedWallet | null;
  handleWalletConnect: (wallet?: SupportedWallet) => void;
  closeQRCode: () => void;
}

/**
 * Hook for managing WalletConnect connection flow
 *
 * @example
 * ```tsx
 * const { showQRCode, handleWalletConnect, closeQRCode } = useWalletConnect();
 *
 * // Desktop: Show QR code
 * if (showQRCode) {
 *   return <QRCodeDisplay uri={uri} onExpired={handleExpired} />;
 * }
 *
 * // Mobile: Open deep link
 * <button onClick={() => handleWalletConnect('okx')}>
 *   Connect OKX Wallet
 * </button>
 * ```
 */
export function useWalletConnect(): UseWalletConnectReturn {
  const [showQRCode, setShowQRCode] = useState(false);
  const [showAppStoreButton, setShowAppStoreButton] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<SupportedWallet | null>(
    null
  );
  const [appStoreLink, setAppStoreLink] = useState('');

  const { isConnected } = useAccount();

  /**
   * Handle WalletConnect connection
   * For MVP: This hook is simplified - WalletConnect is now handled directly
   * by wagmi's connect() function in WalletConnectionButton component
   *
   * Mobile deep links for specific wallets can still be handled if needed,
   * but the recommended approach is to let wagmi's WalletConnect modal
   * handle all wallet selection and connection flow.
   */
  const handleWalletConnect = useCallback(
    async (wallet?: SupportedWallet) => {
      // If already connected, don't show QR code
      if (isConnected) {
        return;
      }

      // If specific wallet is requested and on mobile, open that wallet's deep link
      if (wallet && isMobile()) {
        setSelectedWallet(wallet);
        // Note: For real URI, you would need to get it from wagmi's WalletConnect connector
        // For MVP, we're using wagmi's native handling, so deep links are not needed
        const placeholderUri = 'wc:placeholder-uri';
        const appInstalled = await openWalletDeepLink(wallet, placeholderUri);

        if (!appInstalled) {
          setAppStoreLink(getWalletAppStoreLink(wallet));
          setShowAppStoreButton(true);
        }
        return;
      }

      // Default: Show QR code for WalletConnect (works on both desktop and mobile)
      setShowQRCode(true);
    },
    [isConnected]
  );

  /**
   * Close QR code display
   */
  const closeQRCode = useCallback(() => {
    setShowQRCode(false);
    setShowAppStoreButton(false);
    setSelectedWallet(null);
    setAppStoreLink('');
  }, []);

  return {
    showQRCode,
    showAppStoreButton,
    appStoreLink,
    selectedWallet,
    handleWalletConnect,
    closeQRCode,
  };
}
