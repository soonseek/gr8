import { describe, it, expect, afterEach } from 'vitest';
import {
  isMobile,
  isIOS,
  isAndroid,
  getWalletDeepLink,
  getWalletAppStoreLink,
} from '../mobile';

/**
 * Mobile Detection and Deep Link Utilities Tests
 */

describe('Mobile Detection Utils', () => {
  const originalUserAgent = window.navigator.userAgent;
  const originalVendor = window.navigator.vendor;

  afterEach(() => {
    // Restore original user agent
    Object.defineProperty(window.navigator, 'userAgent', {
      value: originalUserAgent,
      configurable: true,
    });
    Object.defineProperty(window.navigator, 'vendor', {
      value: originalVendor,
      configurable: true,
    });
  });

  describe('isMobile', () => {
    it('returns true for iPhone user agent', () => {
      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true,
      });

      expect(isMobile()).toBe(true);
    });

    it('returns true for Android user agent', () => {
      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Linux; Android 10)',
        configurable: true,
      });

      expect(isMobile()).toBe(true);
    });

    it('returns true for iPad user agent', () => {
      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)',
        configurable: true,
      });

      expect(isMobile()).toBe(true);
    });

    it('returns false for desktop user agent', () => {
      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        configurable: true,
      });

      expect(isMobile()).toBe(false);
    });
  });

  describe('isIOS', () => {
    it('returns true for iPhone user agent', () => {
      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true,
      });

      expect(isIOS()).toBe(true);
    });

    it('returns true for iPad user agent', () => {
      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)',
        configurable: true,
      });

      expect(isIOS()).toBe(true);
    });

    it('returns false for Android user agent', () => {
      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Linux; Android 10)',
        configurable: true,
      });

      expect(isIOS()).toBe(false);
    });
  });

  describe('isAndroid', () => {
    it('returns true for Android user agent', () => {
      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Linux; Android 10)',
        configurable: true,
      });

      expect(isAndroid()).toBe(true);
    });

    it('returns false for iOS user agent', () => {
      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true,
      });

      expect(isAndroid()).toBe(false);
    });
  });
});

describe('Wallet Deep Link Utils', () => {
  describe('getWalletDeepLink', () => {
    it('returns iOS deep link for iPhone', () => {
      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true,
      });

      const deepLink = getWalletDeepLink('okx', 'wc:test-uri');
      expect(deepLink).toBe('okxwallet://wc?uri=wc%3Atest-uri');
    });

    it('returns Android deep link for Android', () => {
      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Linux; Android 10)',
        configurable: true,
      });

      const deepLink = getWalletDeepLink('trust', 'wc:test-uri');
      expect(deepLink).toBe('trust://wc?uri=wc%3Atest-uri');
    });

    it('returns universal link for desktop', () => {
      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        configurable: true,
      });

      const deepLink = getWalletDeepLink('coinbase', 'wc:test-uri');
      expect(deepLink).toBe('https://go.cb-w.com/wc');
    });
  });

  describe('getWalletAppStoreLink', () => {
    it('returns correct app store link for each wallet', () => {
      expect(getWalletAppStoreLink('okx')).toBe('https://www.okx.com/web3');
      expect(getWalletAppStoreLink('trust')).toBe(
        'https://link.trustwallet.com/wc'
      );
      expect(getWalletAppStoreLink('coinbase')).toBe('https://go.cb-w.com/wc');
      expect(getWalletAppStoreLink('rainbow')).toBe('https://rainbow.download');
      expect(getWalletAppStoreLink('argent')).toBe('https://www.argent.xyz');
    });
  });
});
