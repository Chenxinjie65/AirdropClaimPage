'use client';

import { WalletProvider } from './contexts/WalletContext';
import AirdropChecker from './components/AirdropChecker';
import ConnectButton from './components/ConnectButton';

export default function Page() {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col">
        {/* 顶部导航栏 */}
        <header className="border-b border-blue-900/30">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-400">Airdrop Claim</h1>
            <ConnectButton />
          </div>
        </header>

        {/* 主内容区 */}
        <main className="container mx-auto px-4 py-12 flex-grow">
          {/* 分割线设计 */}
          <div className="relative mb-24">  
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-blue-900/30"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gray-900 px-4 text-lg text-blue-400">This is a demo contract: addresses are eligible when their first digit is less than 8</span>
            </div>
          </div>

          {/* 中央内容 */}
          <div className="max-w-4xl mx-auto mt-16"> 
            <div className="flex flex-col items-center mb-12">
              <p className="mb-8 text-center text-gray-300">  
                Enter Ethereum address or connect wallet to check eligibility
              </p>
              <AirdropChecker />
            </div>
          </div>
        </main>

        {/* 页脚 */}
        <footer className="border-t border-blue-900/30 py-8 mt-auto">  {/* 增加 padding */}
          <div className="container mx-auto px-4 text-center text-gray-500">
            &copy; {new Date().getFullYear()} Airdrop Claim. All rights reserved.
          </div>
        </footer>
      </div>
    </WalletProvider>
  );
}