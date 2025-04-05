'use client';

import { useWallet } from '../contexts/WalletContext';

export default function ConnectButton() {
  const { address, connect, disconnect, isConnected } = useWallet();

  const handleClick = async () => {
    try {
      if (isConnected) {
        disconnect();
      } else {
        await connect();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      {isConnected ? 
        `${address.slice(0, 6)}...${address.slice(-4)}` : 
        'connect wallet'
      }
    </button>
  );
}