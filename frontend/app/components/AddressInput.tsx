'use client';

import { useState } from 'react';
import { ethers } from 'ethers';

interface AddressInputProps {
  onCheck: (address: string) => void;
  loading: boolean;
}

export default function AddressInput({ onCheck, loading }: AddressInputProps) {
  const [inputAddress, setInputAddress] = useState('');
  const [inputError, setInputError] = useState('');

  const handleCheck = () => {
    // 清除之前的错误提示
    setInputError('');

    // 检查输入是否为空
    if (!inputAddress.trim()) {
      setInputError('please input address');
      return;
    }

    // 检查地址格式是否正确
    try {
      const formattedAddress = ethers.getAddress(inputAddress);
      onCheck(formattedAddress);
    } catch (err) {
      setInputError('please input a valid Ethereum address');
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="flex gap-4">
        <input
          type="text"
          value={inputAddress}
          onChange={(e) => setInputAddress(e.target.value)}
          placeholder="input address (0x...)"
          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleCheck}
          disabled={loading}
          className={`px-6 py-2 rounded-lg transition-all duration-200 ${
            loading 
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'checking...' : 'check'}
        </button>
      </div>
      
      {/* 错误提示 */}
      {inputError && (
        <p className="mt-2 text-red-500 text-sm">
          {inputError}
        </p>
      )}
    </div>
  );
}