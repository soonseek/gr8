/**
 * Mobile Detection and Deep Link Utilities
 *
 * Utilities for detecting mobile devices and handling wallet deep links
 */

/**
 * Check if the current device is mobile
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;

  const userAgent = window.navigator.userAgent || window.navigator.vendor;
  return /android|iphone|ipad|ipod/i.test(userAgent);
}

/**
 * Check if the current device is iOS
 */
export function isIOS(): boolean {
  if (typeof window === 'undefined') return false;

  const userAgent = window.navigator.userAgent || window.navigator.vendor;
  return /iphone|ipad|ipod/i.test(userAgent);
}

/**
 * Check if the current device is Android
 */
export function isAndroid(): boolean {
  if (typeof window === 'undefined') return false;

  const userAgent = window.navigator.userAgent || window.navigator.vendor;
  return /android/i.test(userAgent);
}

/**
 * Wallet deep link schemes
 */
export const WALLET_DEEP_LINKS = {
  okx: {
    ios: 'okxwallet://wc?uri=',
    android: 'okxwallet://wc?uri=',
    universal: 'https://www.okx.com/web3',
  },
  trust: {
    ios: 'trust://wc?uri=',
    android: 'trust://wc?uri=',
    universal: 'https://link.trustwallet.com/wc',
  },
  coinbase: {
    ios: 'coinbase://wc?uri=',
    android: 'coinbase://wc?uri=',
    universal: 'https://go.cb-w.com/wc',
  },
  rainbow: {
    ios: 'rainbow://wc?uri=',
    android: 'rainbow://wc?uri=',
    universal: 'https://rainbow.download',
  },
  argent: {
    ios: 'argentx://wc?uri=',
    android: 'argentx://wc?uri=',
    universal: 'https://www.argent.xyz',
  },
} as const;

export type SupportedWallet = keyof typeof WALLET_DEEP_LINKS;

/**
 * Get deep link for a specific wallet
 */
export function getWalletDeepLink(
  wallet: SupportedWallet,
  uri: string
): string {
  const links = WALLET_DEEP_LINKS[wallet];

  if (isIOS()) return links.ios + encodeURIComponent(uri);
  if (isAndroid()) return links.android + encodeURIComponent(uri);

  // Fallback to universal link
  return links.universal;
}

/**
 * Get app store link for a specific wallet
 */
export function getWalletAppStoreLink(wallet: SupportedWallet): string {
  return WALLET_DEEP_LINKS[wallet].universal;
}

/**
 * Open wallet deep link and detect if app is installed
 * Returns true if app might be installed, false otherwise
 */
export function openWalletDeepLink(
  wallet: SupportedWallet,
  uri: string
): Promise<boolean> {
  return new Promise((resolve) => {
    const deepLink = getWalletDeepLink(wallet, uri);

    // Track if page is hidden (app opened)
    const clearVisibilityCheck = () => {
      clearTimeout(timeoutId);
      window.removeEventListener('visibilitychange', visibilityHandler);
    };

    const visibilityHandler = () => {
      if (document.visibilityState === 'hidden') {
        // App was opened
        clearVisibilityCheck();
        resolve(true);
      }
    };

    // Set timeout to detect if app is not installed
    const timeoutId = setTimeout(() => {
      if (document.visibilityState === 'visible') {
        // App was not installed
        clearVisibilityCheck();
        resolve(false);
      }
    }, 5000);

    // Listen for visibility change
    window.addEventListener('visibilitychange', visibilityHandler);

    // Open deep link
    window.location.href = deepLink;
  });
}
