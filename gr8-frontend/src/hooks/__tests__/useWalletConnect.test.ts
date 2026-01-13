import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWalletConnect } from '../useWalletConnect';
import * as mobileUtils from '@/utils/mobile';

/**
 * useWalletConnect Hook Tests
 *
 * Tests WalletConnect connection flow
 */

// Mock mobile utils
vi.mock('@/utils/mobile', () => ({
  isMobile: vi.fn(),
  isIOS: vi.fn(),
  isAndroid: vi.fn(),
  openWalletDeepLink: vi.fn(),
  getWalletAppStoreLink: vi.fn(() => 'https://example.com'),
  getWalletDeepLink: vi.fn(() => 'https://example.com'),
}));

// Mock wagmi
vi.mock('wagmi', () => ({
  useAccount: () => ({
    isConnected: false,
  }),
}));

describe('useWalletConnect', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useWalletConnect());

    expect(result.current.showQRCode).toBe(false);
    expect(result.current.showAppStoreButton).toBe(false);
    expect(result.current.selectedWallet).toBe(null);
    expect(result.current.appStoreLink).toBe('');
  });

  it('shows QR code on desktop when handleWalletConnect is called', async () => {
    vi.mocked(mobileUtils.isMobile).mockReturnValue(false);

    const { result } = renderHook(() => useWalletConnect());

    await act(async () => {
      result.current.handleWalletConnect('okx');
    });

    expect(result.current.showQRCode).toBe(true);
    expect(result.current.showAppStoreButton).toBe(false);
  });

  it('opens deep link on mobile when handleWalletConnect is called', async () => {
    vi.mocked(mobileUtils.isMobile).mockReturnValue(true);
    vi.mocked(mobileUtils.openWalletDeepLink).mockResolvedValue(true);

    const { result } = renderHook(() => useWalletConnect());

    await act(async () => {
      result.current.handleWalletConnect('okx');
    });

    expect(mobileUtils.openWalletDeepLink).toHaveBeenCalledWith(
      'okx',
      expect.any(String)
    );
    expect(result.current.selectedWallet).toBe('okx');
  });

  it('shows app store button when wallet app is not installed', async () => {
    vi.mocked(mobileUtils.isMobile).mockReturnValue(true);
    vi.mocked(mobileUtils.openWalletDeepLink).mockResolvedValue(false);
    vi.mocked(mobileUtils.getWalletAppStoreLink).mockReturnValue(
      'https://okx.com/download'
    );

    const { result } = renderHook(() => useWalletConnect());

    await act(async () => {
      result.current.handleWalletConnect('okx');
    });

    expect(result.current.showAppStoreButton).toBe(true);
    expect(result.current.appStoreLink).toBe('https://okx.com/download');
  });

  it('closes QR code and resets state', async () => {
    vi.mocked(mobileUtils.isMobile).mockReturnValue(false);

    const { result } = renderHook(() => useWalletConnect());

    // Open QR code
    await act(async () => {
      result.current.handleWalletConnect('okx');
    });

    expect(result.current.showQRCode).toBe(true);

    // Close QR code
    act(() => {
      result.current.closeQRCode();
    });

    expect(result.current.showQRCode).toBe(false);
    expect(result.current.selectedWallet).toBe(null);
    expect(result.current.showAppStoreButton).toBe(false);
  });

  it('defaults to OKX wallet when no wallet specified', async () => {
    vi.mocked(mobileUtils.isMobile).mockReturnValue(false);

    const { result } = renderHook(() => useWalletConnect());

    await act(async () => {
      result.current.handleWalletConnect();
    });

    expect(result.current.showQRCode).toBe(true);
  });
});
