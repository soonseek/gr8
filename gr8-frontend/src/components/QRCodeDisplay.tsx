/**
 * QRCodeDisplay Component
 *
 * Displays QR code for WalletConnect connection
 * Shows 30-second expiration timer
 * Handles QR code regeneration
 */

import { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCodeDisplayProps {
  uri: string;
  onExpired: () => void;
}

/**
 * QRCodeDisplay Component
 *
 * Generates and displays QR code from WalletConnect URI
 * Shows countdown timer and handles expiration
 *
 * @example
 * ```tsx
 * <QRCodeDisplay
 *   uri={walletConnectUri}
 *   onExpired={() => generateNewURI()}
 * />
 * ```
 */
export function QRCodeDisplay({ uri, onExpired }: QRCodeDisplayProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(30);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Reset timer when URI changes
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setTimeLeft(30);
  }, [uri]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Generate QR code when URI changes
  useEffect(() => {
    if (!uri) return;

    const generateQRCode = async () => {
      try {
        // Create QR code as data URL
        const dataUrl = await QRCode.toDataURL(uri, {
          width: 256,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
          errorCorrectionLevel: 'M',
        });
        setQrCodeDataUrl(dataUrl);
      } catch (error) {
        console.error('Failed to generate QR code:', error);
      }
    };

    generateQRCode();
  }, [uri]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* QR Code */}
      <div className="bg-white p-4 rounded-lg">
        {qrCodeDataUrl ? (
          <img
            src={qrCodeDataUrl}
            alt="WalletConnect QR Code"
            className="w-64 h-64"
          />
        ) : (
          <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded">
            <div className="text-gray-400">QR 코드 생성 중...</div>
          </div>
        )}
      </div>

      {/* Instruction Text */}
      <div className="text-center space-y-2">
        <p className="text-lg font-semibold text-gray-100">
          모바일 지갑 앱에서 QR 코드를 스캔하세요
        </p>
        <p className="text-sm text-gray-400">
          지갑 앱을 열고 스캔 기능을 사용하세요
        </p>
      </div>

      {/* Timer */}
      <div
        className={`text-2xl font-bold ${
          timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-gray-100'
        }`}
      >
        {timeLeft > 0 ? `${timeLeft}초` : '만료됨'}
      </div>

      {/* Regenerate Button (when expired) */}
      {timeLeft === 0 && (
        <button
          onClick={onExpired}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg
                     transition-colors min-h-[44px] min-w-[44px]
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          새 QR 코드 생성
        </button>
      )}

      {/* Hidden canvas for QR code generation */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
