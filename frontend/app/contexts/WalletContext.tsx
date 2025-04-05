'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { ethers } from 'ethers';

interface WalletContextType {
  address: string;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnected: boolean;
}

const WalletContext = createContext<WalletContextType>({
  address: '',
  connect: async () => {},
  disconnect: () => {},
  isConnected: false,
});

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState('');

  const connect = async () => {
    try {
      const ethereum = (window as any).ethereum;
      if (!ethereum) {
        throw new Error('Please install MetaMask or other Ethereum wallet');
      }
      const provider = new ethers.BrowserProvider(ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAddress(address);
    } catch (err) {
      console.error('Failed to connect wallet:', err);
      throw err;
    }
  };

  const disconnect = () => {
    setAddress('');
  };

  return (
    <WalletContext.Provider value={{
      address,
      connect,
      disconnect,
      isConnected: !!address
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);