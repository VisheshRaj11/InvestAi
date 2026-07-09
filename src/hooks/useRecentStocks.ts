import { useState, useEffect } from "react";

export interface RecentStock {
  symbol: string;
  name?: string;
  lastVisited: number;
}

export function useRecentStocks() {
  const [recent, setRecent] = useState<RecentStock[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("investai_recent");
      if (stored) setRecent(JSON.parse(stored));
    } catch (e) {
      console.error("Error reading recent stocks", e);
    }
  }, []);

  const addRecent = (symbol: string, name?: string) => {
    let current = [...recent];
    // Remove if already exists to move it to the front
    current = current.filter(s => s.symbol !== symbol);
    current.unshift({ symbol, name, lastVisited: Date.now() });
    
    // Keep only top 8
    if (current.length > 8) {
      current = current.slice(0, 8);
    }
    
    setRecent(current);
    localStorage.setItem("investai_recent", JSON.stringify(current));
  };

  return { recent, addRecent };
}
