import { Web3Debug, WalletConnectButton } from './components';

export function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">gr8</h1>
        <p className="text-xl text-gray-400">
          Decentralized Automated Trading Platform
        </p>
        <p className="mt-8 text-sm text-gray-500">
          Frontend starter template initialized successfully
        </p>

        {/* Wallet Connect Button */}
        <div className="mt-8 flex justify-center">
          <WalletConnectButton />
        </div>
      </div>

      {/* Web3 Debug Component (for development) */}
      <Web3Debug />
    </div>
  );
}
