"use client";

import { useState, useEffect } from "react";
import { Bookmark, BookmarkX, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/watchlist')
      .then(r => r.json())
      .then(data => {
        setWatchlist(data);
        setLoading(false);
      })
      .catch(() => { setLoading(false); });
  }, []);

  const removeStock = async (ticker: string) => {
    try {
      await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker, action: 'remove' })
      });
      setWatchlist(prev => prev.filter(s => s.ticker !== ticker));
    } catch (e) {}
  };

  const analyzeStock = (symbol: string) => {
    router.push(`/dashboard/stocks/${symbol}`);
  };

  return (
    <div className="w-full h-full p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8 pb-10">
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-3 text-black">
          <Bookmark className="w-8 h-8" /> Your Watchlist
        </h2>

        <div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-5 bg-gray-100 rounded w-1/3"></div>
                      <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-100 rounded w-1/4 mb-6 mt-6"></div>
                  <div className="h-12 bg-gray-100 rounded-xl w-full"></div>
                </div>
              ))}
            </div>
          ) : watchlist.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                <Bookmark className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">No stocks saved yet</h3>
              <p className="text-gray-500 mb-6">Search for a stock on the dashboard and click the bookmark icon to save it here.</p>
              <button 
                onClick={() => router.push('/dashboard')}
                className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {watchlist.map((stock) => (
                <div key={stock.ticker} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden group hover:border-black transition-colors">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center font-bold text-xl text-white">
                          {stock.ticker[0]}
                        </div>
                        <div>
                          <div className="font-bold text-lg">{stock.ticker}</div>
                          <div className="text-sm text-gray-500 truncate max-w-[120px]">{stock.companyName || 'Equity'}</div>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeStock(stock.ticker); }}
                        className="p-2 text-gray-400 hover:bg-gray-100 hover:text-black rounded-full transition-colors"
                        title="Remove from Watchlist"
                      >
                        <BookmarkX className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="text-xs text-gray-400 mb-6">
                      Added {new Date(stock.addedAt).toLocaleDateString()}
                    </div>

                    <button 
                      onClick={() => analyzeStock(stock.ticker)}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 text-black font-bold rounded-xl group-hover:bg-black group-hover:text-white transition-colors"
                    >
                      <Sparkles className="w-4 h-4" /> View Analysis
                    </button>
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