'use client';

interface ClaimCardProps {
  address: string;
  amount: string;
  onClaim: () => void;
  loading: boolean;
}

export default function ClaimCard({ address, amount, onClaim, loading }: ClaimCardProps) {
  return (
    <div className="bg-gray-900 border border-blue-500 rounded-lg p-6 max-w-md w-full">
      <h2 className="text-xl font-semibold mb-4 text-blue-400">Congratulations! You are qualified!</h2>
      
      <div className="space-y-4 mb-6">
        <div>
          <p className="text-gray-400 text-sm">wallet address</p>
          <p className="font-mono">{address.slice(0, 10)}...{address.slice(-8)}</p>
        </div>
        
        <div>
          <p className="text-gray-400 text-sm">amount</p>
          <p className="text-2xl font-bold text-blue-400">{amount}</p>
        </div>
      </div>
      
      <button
        onClick={onClaim}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
      >
        {loading ? 'processing...' : 'Claim'}
      </button>
    </div>
  );
}