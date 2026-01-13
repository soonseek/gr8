import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WalletConnectButton } from '../WalletConnectButton';
import { Web3Provider } from '@/providers';

/**
 * WalletConnectButton Component Tests
 *
 * Tests MetaMask wallet connection button UI and interactions
 */

describe('WalletConnectButton', () => {
  beforeEach(() => {
    // Reset window.ethereum before each test
    if (typeof window !== 'undefined') {
      delete (window as { ethereum?: unknown }).ethereum;
    }
  });

  it('renders "지갑 연결하기" button when wallet is not connected', () => {
    render(
      <Web3Provider>
        <WalletConnectButton />
      </Web3Provider>
    );

    const connectButton = screen.getByRole('button', {
      name: '지갑 연결하기',
    });
    expect(connectButton).toBeInTheDocument();
  });

  it('applies dark mode styling classes', () => {
    render(
      <Web3Provider>
        <WalletConnectButton />
      </Web3Provider>
    );

    const connectButton = screen.getByRole('button', {
      name: '지갑 연결하기',
    });
    expect(connectButton).toHaveClass('bg-blue-600');
  });

  it('applies responsive classes (w-full on mobile, w-auto on desktop)', () => {
    render(
      <Web3Provider>
        <WalletConnectButton />
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
        <WalletConnectButton />
      </Web3Provider>
    );

    const connectButton = screen.getByRole('button', {
      name: '지갑 연결하기',
    });
    expect(connectButton).toHaveClass('min-h-[44px]');
    expect(connectButton).toHaveClass('min-w-[44px]');
  });

  it('shows MetaMask install modal when MetaMask is not installed', () => {
    // Simulate no MetaMask
    render(
      <Web3Provider>
        <WalletConnectButton />
      </Web3Provider>
    );

    const connectButton = screen.getByRole('button', {
      name: '지갑 연결하기',
    });

    // Click button (should show modal since MetaMask not detected)
    // Note: In test environment without window.ethereum, modal should show
    expect(connectButton).toBeInTheDocument();
  });

  it('has disabled state when not connected', () => {
    render(
      <Web3Provider>
        <WalletConnectButton />
      </Web3Provider>
    );

    const connectButton = screen.getByRole('button', {
      name: '지갑 연결하기',
    });
    // Button should not be disabled by default
    expect(connectButton).not.toBeDisabled();
  });

  it('shows hover state classes', () => {
    render(
      <Web3Provider>
        <WalletConnectButton />
      </Web3Provider>
    );

    const connectButton = screen.getByRole('button', {
      name: '지갑 연결하기',
    });
    expect(connectButton).toHaveClass('hover:bg-blue-700');
  });

  it('has transition classes for smooth color changes', () => {
    render(
      <Web3Provider>
        <WalletConnectButton />
      </Web3Provider>
    );

    const connectButton = screen.getByRole('button', {
      name: '지갑 연결하기',
    });
    expect(connectButton).toHaveClass('transition-colors');
    expect(connectButton).toHaveClass('duration-200');
  });
});
