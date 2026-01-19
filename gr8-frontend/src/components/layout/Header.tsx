/**
 * Header - Top header bar component
 */

import { useDisconnect } from 'wagmi';
import { LogOut } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { disconnect } = useDisconnect();
  const { address } = useAccount();
  const navigate = useNavigate();

  const handleDisconnect = async () => {
    try {
      await disconnect();
      // Redirect to landing page after disconnect
      navigate('/');
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };

  // Shorten wallet address for display
  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 sticky top-0 z-30">
      {/* Left: Hamburger Menu Button (Mobile) - Will be implemented with Sidebar toggle */}
      <div className="w-10" />

      {/* Center: Page Title */}
      <h1 className="text-lg font-semibold text-gray-100">{title}</h1>

      {/* Right: Wallet Address & Logout */}
      <div className="flex items-center gap-3">
        {address && (
          <div className="text-sm text-gray-400 bg-gray-900 px-3 py-1.5 rounded-lg">
            {shortenAddress(address)}
          </div>
        )}
        <button
          onClick={handleDisconnect}
          className="p-2 text-gray-400 hover:text-gray-100 hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="로그아웃"
          title="로그아웃"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
