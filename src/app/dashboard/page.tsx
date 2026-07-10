"use client";

import { useState, useEffect } from "react";
import { Search, Clock, Bookmark, ChevronRight, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";

const Sparkline = ({ data, positive }: { data: any[], positive: boolean }) => (
  <div className="h-24 w-full mt-4 opacity-50 group-hover:opacity-100 transition-opacity">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <YAxis domain={['dataMin', 'dataMax']} hide />
        <Area 
          type="monotone" 
          dataKey="price" 
          stroke={positive ? "#16a34a" : "#dc2626"} 
          fill={positive ? "#16a34a" : "#dc2626"} 
          fillOpacity={0.08} 
          strokeWidth={3}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default function DashboardPage() {
  const [query, setQuery] = useState("");
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [trendingStocks, setTrendingStocks] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [loadingWatchlist, setLoadingWatchlist] = useState(true);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/trending').then(r => r.json()).then(d => { setTrendingStocks(d); setLoadingTrending(false); }).catch(() => { setLoadingTrending(false); });
    fetch('/api/research-logs').then(r => r.json()).then(d => { setRecentLogs(d); setLoadingLogs(false); }).catch(() => { setLoadingLogs(false); });
    fetch('/api/watchlist').then(r => r.json()).then(d => { setWatchlist(d); setLoadingWatchlist(false); }).catch(() => { setLoadingWatchlist(false); });
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length > 0) {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data && data.length > 0 && data[0].symbol) {
          router.push(`/dashboard/stocks/${data[0].symbol.toUpperCase()}`);
        } else {
          router.push(`/dashboard/stocks/${query.toUpperCase()}`);
        }
      } catch (err) {
        router.push(`/dashboard/stocks/${query.toUpperCase()}`);
      }
    }
  };

  const dummyChartData = [
    { price: 100 }, { price: 105 }, { price: 102 }, { price: 110 }, { price: 115 }, { price: 112 }, { price: 120 }
  ];

  return (
    <div className="w-full h-full p-4 lg:p-8 bg-gradient-radial">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header / Search */}
        <div className="text-center space-y-6 max-w-2xl mx-auto pt-10">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">InvestAI Workspace</h1>
          <p className="text-gray-500 text-lg">Search a company ticker to generate a professional AI equity research report.</p>
          <form onSubmit={handleSearch} className="relative w-full shadow-lg rounded-2xl overflow-hidden">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="e.g. AAPL, TSLA, NVDA..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 pr-4 py-4 w-full border-2 border-transparent focus:border-black rounded-2xl focus:outline-none text-lg font-medium bg-white transition-all"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors">
              Analyze
            </button>
          </form>
        </div>

        {/* Trending Stocks Grid */}
        {loadingTrending ? (
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800"><TrendingUp className="w-5 h-5" /> Market Leaders</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="bg-white rounded-[2rem] h-[340px] border border-gray-200 animate-pulse"></div>)}
            </div>
          </div>
        ) : trendingStocks.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800"><TrendingUp className="w-5 h-5" /> Market Leaders</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trendingStocks.map((stock, i) => {
                const isPositive = stock.change >= 0;
                return (
                  <div key={i} onClick={() => router.push(`/dashboard/stocks/${stock.ticker}`)} className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-[0_8px_40px_-12px_rgba(168,85,247,0.3)] hover:border-purple-200 cursor-pointer transition-all duration-300 flex flex-col justify-between group min-h-[340px] relative overflow-hidden">
                    <div className="flex justify-between items-center w-full gap-4">
                      <div className="h-10 px-4 rounded-xl bg-black flex items-center text-white font-medium text-sm shadow-sm truncate flex-1 max-w-fit">
                        <span className="truncate">{stock.companyName}</span>
                      </div>
                      <div className={`text-sm font-semibold px-4 py-2 rounded-full whitespace-nowrap shrink-0 ${isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {isPositive ? '▲' : '▼'} {Math.abs(stock.changePercent || 0).toFixed(2)}%
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <div className="font-bold text-3xl text-gray-900 tracking-tight">{stock.ticker}</div>
                    </div>
                    
                    <div className="mt-6 flex items-end justify-between z-10 relative">
                      <div>
                        <div className="text-sm text-gray-400 font-medium mb-1">Current Price</div>
                        <div className="text-3xl font-bold text-gray-900">${stock.price?.toFixed(2) || "0.00"}</div>
                      </div>
                    </div>

                    <div className="absolute inset-x-0 bottom-24 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                      <Sparkline data={dummyChartData} positive={isPositive} />
                    </div>

                    <button className="w-full bg-gray-50 text-gray-700 border border-gray-100 group-hover:bg-black group-hover:text-white group-hover:border-black rounded-xl py-4 mt-8 text-center font-semibold text-sm transition-colors duration-300 flex justify-center items-center gap-2 z-10">
                      See Analysis <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent Researches Grid */}
        {loadingLogs ? (
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800"><Clock className="w-5 h-5" /> Recently Researched</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => <div key={i} className="bg-white rounded-2xl h-40 border border-gray-200 animate-pulse"></div>)}
            </div>
          </div>
        ) : recentLogs.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800"><Clock className="w-5 h-5" /> Recently Researched</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recentLogs.slice(0, 4).map((log, i) => {
                const verdict = log.verdict?.toLowerCase();
                return (
                  <div key={i} onClick={() => router.push(`/dashboard/stocks/${log.ticker}`)} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:border-black cursor-pointer group transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-bold text-lg">{log.ticker}</div>
                      <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${verdict === 'invest' ? 'border-black text-black' : verdict === 'pass' ? 'border-gray-300 text-gray-500 border-dashed' : 'border-gray-400 text-gray-600'}`}>
                        {verdict}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 truncate mb-2">{log.companyName}</div>
                    <div className="text-xs text-gray-400 font-medium">Confidence: {log.confidence}%</div>
                    <Sparkline data={dummyChartData} positive={verdict === 'invest'} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Watchlist Grid */}
        {loadingWatchlist ? (
          <div className="space-y-4 pb-20">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800"><Bookmark className="w-5 h-5" /> Your Watchlist</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => <div key={i} className="bg-white rounded-2xl h-32 border border-gray-200 animate-pulse"></div>)}
            </div>
          </div>
        ) : watchlist.length > 0 && (
          <div className="space-y-4 pb-20">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800"><Bookmark className="w-5 h-5" /> Your Watchlist</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {watchlist.map((item, i) => (
                <div key={i} onClick={() => router.push(`/dashboard/stocks/${item.ticker}`)} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:border-black cursor-pointer group transition-colors flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-bold text-lg">{item.ticker}</div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-black transition-colors" />
                    </div>
                    <div className="text-xs text-gray-500 truncate">{item.companyName}</div>
                  </div>
                  <Sparkline data={dummyChartData} positive={true} />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}