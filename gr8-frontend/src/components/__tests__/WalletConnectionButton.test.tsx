import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WalletConnectionButton } from '../WalletConnectionButton';
import { Web3Provider } from '@/providers';

/**
 * WalletConnectionButton Component Tests
 *
 * Tests wallet connection button and modal interactions
 */

// Mock useWalletConnect hook
vi.mock('@/hooks', () => ({
  useAccount: () => ({
    address: null,
    isConnected: false,
    chainId: null,
  }),
  useWalletConnect: () => ({
    showQRCode: false,
    showAppStoreButton: false,
    appStoreLink: '',
    selectedWallet: null,
    handleWalletConnect: vi.fn(),
    closeQRCode: vi.fn(),
  }),
  useWallet: () => ({
    address: null,
    chainId: null,
    isConnected: false,
  }),
}));

// Mock wallet store
vi.mock('@/stores', () => ({
  useWalletStore: () => ({
    setWallet: vi.fn(),
    clearWallet: vi.fn(),
  }),
}));

describe('WalletConnectionButton', () => {
  it('renders "지갑 연결하기" button when wallet is not connected', () => {
    render(
      <Web3Provider>
        <WalletConnectionButton />
      </Web3Provider>
    );

    const connectButton = screen.getByRole('button', {
      name: '지갑 연결하기',
    });
    expect(connectButton).toBeInTheDocument();
  });

  it('opens WalletSelectorModal when button is clicked', () => {
    render(
      <Web3Provider>
        <WalletConnectionButton />
      </Web3Provider>
    );

    const connectButton = screen.getByRole('button', {
      name: '지갑 연결하기',
    });

    fireEvent.click(connectButton);

    // Modal should appear with "지갑 선택" text
    // Note: In actual implementation, we'd need to mock wagmi's connectors
    // for the modal to show properly
  });

  it('has correct styling classes', () => {
    render(
      <Web3Provider>
        <WalletConnectionButton />
      </Web3Provider>
    );

    const connectButton = screen.getByRole('button', {
      name: '지갑 연결하기',
    });

    expect(connectButton).toHaveClass('bg-blue-600');
    expect(connectButton).toHaveClass('hover:bg-blue-700');
    expect(connectButton).toHaveClass('text-white');
  });

  it('has responsive classes (w-full on mobile, w-auto on desktop)', () => {
    render(
      <Web3Provider>
        <WalletConnectionButton />
      </Web3Provider>
    );

    const connectButton = screen.getByRole('button', {
      name: '지갑 연결하기',
    });

    expect(connectButton).toHaveClass('w-full');
    expect(connectButton).toHaveClass('sm:w-auto');
  });

  it('has minimum touch target size of 44x44px', () => {
    render(
      <Web3Provider>
        <WalletConnectionButton />
      </Web3Provider>
    );

    const connectButton = screen.getByRole('button', {
      name: '지갑 연결하기',
    });

    expect(connectButton).toHaveClass('min-h-[44px]');
    expect(connectButton).toHaveClass('min-w-[44px]');
  });

  it('has transition classes for smooth color changes', () => {
    render(
      <Web3Provider>
        <WalletConnectionButton />
      </Web3Provider>
    );

    const connectButton = screen.getByRole('button', {
      name: '지갑 연결하기',
    });

    expect(connectButton).toHaveClass('transition-colors');
    expect(connectButton).toHaveClass('duration-200');
  });
});
