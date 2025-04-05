'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ClaimCard from './ClaimCard';
import { useWallet } from '../contexts/WalletContext';
import SuccessModal from './SuccessModal';

const CONTRACT_ADDRESS = '0x83e7E5b5607CdC2a2E6fd023036BD3C678B6A3f2';
const CONTRACT_ABI = [
  "function isEligible(address) view returns (bool)",
  "function claim() external",
  "function claimed(address) view returns (bool)"  
];

export default function AirdropChecker() {
  const { address: walletAddress } = useWallet();
  const [address, setAddress] = useState('');
  const [isEligible, setIsEligible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [claimLoading, setClaimLoading] = useState(false);
  const [successTx, setSuccessTx] = useState<string | null>(null);
  const [hasClaimed, setHasClaimed] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  // 当钱包地址改变时，更新输入框
  useEffect(() => {
    if (walletAddress) {
      setAddress(walletAddress);
    }
  }, [walletAddress]);

  const checkEligibility = async (address: string) => {
    setLoading(true);
    setError('');
    setHasClaimed(false);
    setHasChecked(false);

    try {
      const ethereum = (window as any).ethereum;
      if (!ethereum) {
        throw new Error('Please install MetaMask or other Ethereum wallet');
      }
      const provider = new ethers.BrowserProvider(ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      
      // 同时查询资格和是否已领取
      const [eligible, claimed] = await Promise.all([
        contract.isEligible(address),
        contract.claimed(address)
      ]);
      
      setIsEligible(eligible);
      setHasClaimed(claimed);
      setHasChecked(true);  // 查询完成后设置状态
    } catch (err) {
      setError('Error checking eligibility');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    if (!walletAddress) {
      setError('Please connect wallet first');
      return;
    }

    setClaimLoading(true);
    try {
      const ethereum = (window as any).ethereum;
      if (!ethereum) {
        throw new Error('Please install MetaMask or other Ethereum wallet');
      }
      const provider = new ethers.BrowserProvider(ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tx = await contract.claim();
      const receipt = await tx.wait();
      setSuccessTx(receipt.hash);
    } catch (err) {
      console.error(err);
      alert('Claim failed, please try again');
    } finally {
      setClaimLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter Ethereum Address"
          className="flex-1 p-2 rounded border border-gray-300 bg-gray-800 text-white"
        />
        <button
          onClick={() => checkEligibility(address)}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
        >
          {loading ? 'Checking...' : 'Check'}
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      
      {isEligible && !error && !hasClaimed && !loading && (
        <ClaimCard
          address={address}
          amount="100 TOKEN"
          onClaim={handleClaim}
          loading={claimLoading}
        />
      )}

      {isEligible && hasClaimed && !error && !loading && (
        <div className="bg-gray-900 border border-yellow-500 rounded-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-semibold mb-4 text-yellow-400">This address has already claimed</h2>
          <p className="text-gray-400">Each address can only claim the airdrop once.</p>
        </div>
      )}

      {!isEligible && hasChecked && !loading && address && !error && (
        <p className="text-red-500">Sorry, this address is not eligible for the airdrop.</p>
      )}

      {successTx && (
        <SuccessModal 
          txHash={successTx} 
          onClose={() => {
            setSuccessTx(null);
            setIsEligible(false);
            setAddress('');
          }} 
        />
      )}
    </div>
  );
}