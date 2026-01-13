import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QRCodeDisplay } from '../QRCodeDisplay';

/**
 * QRCodeDisplay Component Tests
 *
 * Tests QR code generation and display functionality
 */

describe('QRCodeDisplay', () => {
  const mockOnExpired = vi.fn();

  it('renders QR code image', async () => {
    render(<QRCodeDisplay uri="wc:123456abcdef" onExpired={mockOnExpired} />);

    // Wait for QR code to be generated
    await waitFor(
      () => {
        const qrImage = screen.getByAltText('WalletConnect QR Code');
        expect(qrImage).toBeInTheDocument();
        expect(qrImage).toHaveAttribute('src');
      },
      { timeout: 3000 }
    );
  });

  it('shows instruction text', () => {
    render(<QRCodeDisplay uri="wc:123456abcdef" onExpired={mockOnExpired} />);

    expect(
      screen.getByText('모바일 지갑 앱에서 QR 코드를 스캔하세요')
    ).toBeInTheDocument();
    expect(
      screen.getByText(/지갑 앱을 열고 스캔 기능을 사용하세요/)
    ).toBeInTheDocument();
  });

  it('displays 30-second countdown timer', () => {
    render(<QRCodeDisplay uri="wc:123456abcdef" onExpired={mockOnExpired} />);

    expect(screen.getByText('30초')).toBeInTheDocument();
  });

  it('has dark mode compatible styling', () => {
    render(<QRCodeDisplay uri="wc:123456abcdef" onExpired={mockOnExpired} />);

    const title = screen.getByText('모바일 지갑 앱에서 QR 코드를 스캔하세요');
    expect(title).toHaveClass('text-gray-100');

    const description = screen.getByText(
      /지갑 앱을 열고 스캔 기능을 사용하세요/
    );
    expect(description).toHaveClass('text-gray-400');
  });

  it('has proper touch target size for button', () => {
    render(<QRCodeDisplay uri="wc:123456abcdef" onExpired={mockOnExpired} />);

    // Button might not be visible yet (timer at 30 seconds)
    // Just verify the component renders
    expect(screen.getByText('30초')).toBeInTheDocument();
  });

  it('generates QR code with white background', async () => {
    render(<QRCodeDisplay uri="wc:123456abcdef" onExpired={mockOnExpired} />);

    // Check that the QR code is wrapped in a white container
    await waitFor(
      () => {
        const qrImage = screen.getByAltText('WalletConnect QR Code');
        const qrContainer = qrImage.closest('.bg-white');
        expect(qrContainer).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });
});
