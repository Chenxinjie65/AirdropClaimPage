'use client';

interface SuccessModalProps {
  txHash: string;
  onClose: () => void;
}

export default function SuccessModal({ txHash, onClose }: SuccessModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-blue-500 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center">
          <h3 className="text-xl font-bold text-green-400 mb-4">领取成功！</h3>
          <p className="text-gray-300 mb-2">交易已确认</p>
          <div className="bg-gray-800 p-3 rounded-lg mb-4">
            <p className="text-sm text-gray-400">交易哈希:</p>
            <a 
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 break-all"
            >
              {txHash}
            </a>
          </div>
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            close
          </button>
        </div>
      </div>
    </div>
  );
}