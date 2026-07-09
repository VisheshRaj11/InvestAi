"use client";

import { useState, useEffect } from "react";
import { Sparkles, Activity } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DiscoverPage() {
  const [trending, setTrending] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/trending').then(res => res.json()).then(setTrending).catch(() => {});
  }, []);

  const analyzeStock = (symbol: string) => {
    router.push(`/dashboard?q=${symbol}`);
  };

  return (
    <div className="w-full h-full p-4 lg:p-8 pb-10">
      <div className="max-w-6xl mx-auto space-y-8 pb-10">
        <div className="bg-gradient-to-br from-indigo-900 to-[#1A1A2E] rounded-3xl p-8 lg:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Discover Market Movers</h2>
            <p className="text-indigo-200 text-lg">Explore today's top gaining stocks. Click on any ticker to immediately run a comprehensive AI analysis.</p>
          </div>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <Activity className="absolute right-12 bottom-12 w-32 h-32 text-white/5" />
        </div>

        <div>
          <h3 className="font-bold text-xl mb-4 px-1">Top Gainers Today</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trending.length > 0 ? trending.map((stock, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-indigo-300 transition-all cursor-pointer group" onClick={() => analyzeStock(stock.symbol)}>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center font-bold text-indigo-700">{stock.symbol[0]}</div>
                  <div className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${stock.change >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                  </div>
                </div>
                <div className="font-bold text-lg mb-1">{stock.symbol}</div>
                <div className="text-sm text-gray-500 truncate mb-4">{stock.name}</div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="font-bold text-lg">${stock.price?.toFixed(2)}</span>
                  <span className="text-xs text-indigo-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center bg-indigo-50 px-2 py-1 rounded-md">Analyze <Sparkles className="w-3 h-3 ml-1"/></span>
                </div>
              </div>
            )) : (
              [1,2,3,4,5,6,7,8].map(i => <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 h-44 animate-pulse flex flex-col justify-between"><div className="w-10 h-10 bg-gray-100 rounded-full"></div><div className="w-1/2 h-4 bg-gray-100 rounded mb-2"></div><div className="w-full h-8 bg-gray-50 rounded mt-4"></div></div>)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}