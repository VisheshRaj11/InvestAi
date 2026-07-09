import { useState, useEffect } from "react";

export interface SavedStock {
  symbol: string;
  name?: string;
  savedAt: number;
}

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<SavedStock[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("investai_watchlist");
      if (stored) setWatchlist(JSON.parse(stored));
    } catch (e) {
      console.error("Error reading watchlist", e);
    }
  }, []);

  const saveWatchlist = (newList: SavedStock[]) => {
    setWatchlist(newList);
    localStorage.setItem("investai_watchlist", JSON.stringify(newList));
  };

  const addStock = (symbol: string, name?: string) => {
    if (watchlist.some(s => s.symbol === symbol)) return;
    saveWatchlist([...watchlist, { symbol, name, savedAt: Date.now() }]);
  };

  const removeStock = (symbol: string) => {
    saveWatchlist(watchlist.filter(s => s.symbol !== symbol));
  };

  const isSaved = (symbol: string) => {
    return watchlist.some(s => s.symbol === symbol);
  };

  return { watchlist, addStock, removeStock, isSaved };
}
