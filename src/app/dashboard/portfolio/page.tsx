"use client";

import { useState, useEffect } from "react";
import { Wallet, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PortfolioPage() {
  const [data, setData] = useState<{holdings: any[], walletBalance: number} | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/portfolio').then(r => r.json()).then(setData).catch(() => {});
  }, []);

  if (!data) return (
    <div className="w-full h-full p-4 lg:p-8 animate-pulse">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-100 rounded-3xl p-8 h-48"></div>
          <div className="bg-gray-100 rounded-3xl p-8 h-48"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded w-40 mt-8 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="bg-gray-100 rounded-2xl h-32"></div>)}
        </div>
      </div>
    </div>
  );

  const totalInvested = data.holdings.reduce((sum, h) => sum + (h.shares * h.avgBuyPrice), 0);

  return (
    <div className="w-full h-full p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h2 className="text-3xl font-bold mb-8">Portfolio & Wallet</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black text-white rounded-3xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-2 text-gray-400">
              <Wallet className="w-5 h-5" /> Available Cash
            </div>
            <div className="text-4xl font-bold mb-8">${data.walletBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              Simulated paper trading balance
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-2 text-gray-500">
              <TrendingUp className="w-5 h-5" /> Total Invested
            </div>
            <div className="text-4xl font-bold mb-8">${totalInvested.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-xl mb-4">Current Holdings</h3>
          {data.holdings.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-500">
              You have no active holdings. Search for a stock to buy shares.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.holdings.map((h, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:border-black cursor-pointer transition-colors" onClick={() => router.push(`/dashboard/stocks/${h.ticker}`)}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="font-bold text-xl">{h.ticker}</div>
                      <div className="text-sm text-gray-500 truncate">{h.companyName}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{h.shares} sh</div>
                      <div className="text-xs text-gray-400">@ ${h.avgBuyPrice.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-gray-500 text-sm">Position Value</span>
                    <span className="font-bold">${(h.shares * h.avgBuyPrice).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}