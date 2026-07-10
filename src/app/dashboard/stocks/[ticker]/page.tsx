"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Target, Wallet, ShieldAlert, Check, Loader2, ArrowUpRight } from "lucide-react";
import { TrendChart } from "@/components/ui/trend-chart";
import { AgentState } from "@/lib/agent/state";
import { toast } from "sonner";

export default function StockDetailPage() {
  const { ticker } = useParams();
  const router = useRouter();
  
  const [state, setState] = useState<Partial<AgentState> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState("");
  
  const [buyAmount, setBuyAmount] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);

  const hasFetched = useRef(false);
  useEffect(() => {
    if (ticker && !hasFetched.current) {
      hasFetched.current = true;
      runAnalysis(ticker as string);
    }
  }, [ticker]);

  const runAnalysis = async (symbol: string, force = false) => {
    setLoading(true);
    setStatusMsg("");
    setError(null);
    if (force) setState(null);
    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: symbol, force }),
      });
      if (!res.body) throw new Error("No stream");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.slice(6);
            if (dataStr === "[DONE]") {
              setLoading(false);
              return;
            }
            try {
              const event = JSON.parse(dataStr);
              if (event.error) {
                setError(event.error);
                setLoading(false);
                return;
              }
              if (event.data) {
                if (event.data.status) {
                  setStatusMsg(event.data.message);
                } else {
                  setState(prev => ({ ...prev, ...event.data }));
                }
              }
            } catch (e) {}
          }
        }
      }
    } catch (err) {
      setError("Analysis failed");
      setLoading(false);
    }
  };

  const handleTransaction = async (action: "buy" | "sell") => {
    setActionLoading(true);
    try {
      const price = state?.researchData?.[ticker as string]?.price;
      if (!price) throw new Error("Price not available");
      
      const res = await fetch('/api/portfolio', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticker,
          companyName: state?.companyName || ticker,
          shares: buyAmount,
          price: price,
          action
        })
      });
      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(`Successfully ${action === 'buy' ? 'bought' : 'sold'} ${buyAmount} shares of ${ticker}!`);
      }
    } catch (e) {
      toast.error("Transaction failed");
    }
    setActionLoading(false);
  };

  const handleWatchlist = async () => {
    try {
      await fetch('/api/watchlist', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker, companyName: state?.companyName || ticker, action: "add" })
      });
      toast.success("Added to watchlist!");
    } catch (e) {
      toast.error("Failed to add to watchlist");
    }
  };

  const d = state?.decision;
  const p = state?.researchData?.[ticker as string]?.price;

  return (
    <div className="w-full h-full bg-[#F8F9FA] overflow-y-auto">
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-20 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full cursor-pointer"><ArrowLeft className="w-5 h-5" /></button>
          <div className="font-bold text-xl">{ticker}</div>
          {(state as any)?.isCached && (
            <div className="ml-2 flex items-center gap-3">
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded font-medium">
                Cached {new Date((state as any).cachedAt).toLocaleTimeString()}
              </span>
              <button 
                onClick={() => runAnalysis(ticker as string, true)}
                className="text-xs text-blue-600 hover:underline font-medium cursor-pointer"
              >
                Re-run
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 lg:p-8 space-y-6">
        {statusMsg && <div className="text-blue-600 font-medium flex items-center justify-center p-3 bg-blue-50 rounded-lg border border-blue-100">{statusMsg}</div>}
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Loader2 className="w-12 h-12 text-black animate-spin mb-4" />
            <div className="text-xl font-bold text-gray-800">Agent Researching...</div>
            <div className="text-sm text-gray-500 mt-2">Analyzing real-time financial data and news.</div>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500 font-bold">{error}</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Price & Actions */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center font-bold text-xl text-white">{String(ticker)[0]}</div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold border ${d?.verdict === 'invest' ? 'border-black text-black' : d?.verdict === 'pass' ? 'border-gray-300 text-gray-500 border-dashed' : 'border-gray-400 text-gray-600'}`}>
                    Verdict: {d?.verdict?.toUpperCase()}
                  </div>
                </div>
                <h1 className="text-2xl font-bold mb-1">{state?.companyName || ticker}</h1>
                <div className="text-4xl font-bold mb-6">${p?.toFixed(2) || "0.00"}</div>

                <div className="space-y-4 border-t border-gray-100 pt-6">
                  <div className="flex items-center gap-3">
                    <input type="number" min="1" value={buyAmount} onChange={(e) => setBuyAmount(parseInt(e.target.value) || 1)} className="w-20 px-3 py-2 border border-gray-200 rounded-lg focus:ring-black" />
                    <span className="text-sm text-gray-500">Shares</span>
                  </div>
                  <div className="flex flex-col xl:flex-row gap-3">
                    <Button onClick={() => handleTransaction('buy')} disabled={actionLoading} className="flex-1 bg-black text-white hover:bg-gray-800 rounded-lg">
                      {actionLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null} Buy
                    </Button>
                    <Button onClick={() => handleTransaction('sell')} disabled={actionLoading} variant="outline" className="flex-1 rounded-lg">
                      {actionLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null} Sell
                    </Button>
                  </div>
                  <Button onClick={handleWatchlist} variant="outline" className="w-full rounded-lg text-gray-600 border-dashed border-gray-300">
                    Add to Watchlist
                  </Button>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h3 className="font-bold text-lg mb-4 text-gray-800">Trade on Platform</h3>
                <div className="space-y-3">
                  <a href={`https://kite.zerodha.com/chart/web/tvc/NSE/${ticker}`} target="_blank" className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-black hover:bg-gray-50 transition-colors group">
                    <span className="font-medium text-sm text-gray-700 group-hover:text-black">Zerodha Kite</span>
                    <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
                  </a>
                  <a href={`https://groww.in/stocks/${String(ticker).toLowerCase()}`} target="_blank" className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-black hover:bg-gray-50 transition-colors group">
                    <span className="font-medium text-sm text-gray-700 group-hover:text-black">Groww</span>
                    <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
                  </a>
                  <a href={`https://indmoney.com/stocks/${String(ticker).toLowerCase()}`} target="_blank" className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-black hover:bg-gray-50 transition-colors group">
                    <span className="font-medium text-sm text-gray-700 group-hover:text-black">INDmoney</span>
                    <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
                  </a>
                  <a href={`https://pro.upstox.com/`} target="_blank" className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-black hover:bg-gray-50 transition-colors group">
                    <span className="font-medium text-sm text-gray-700 group-hover:text-black">Upstox</span>
                    <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: AI Analysis */}
            <div className="lg:col-span-9 space-y-6">
              
              {/* Historical Price Chart */}
              {state?.researchData?.[ticker as string]?.history && (
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm h-80">
                  <h3 className="font-bold text-xl mb-4 flex items-center gap-2">Historical Performance (1Y)</h3>
                  <div className="h-[220px]">
                     <TrendChart data={(state.researchData[ticker as string].history || []) as any} />
                  </div>
                </div>
              )}

              {/* Key Metrics */}
              {d?.key_metrics && d.key_metrics.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
                  {d.key_metrics.map((m: any, i: number) => (
                    <div key={i} className="bg-white rounded-2xl p-4 lg:p-6 border border-gray-200 shadow-sm flex flex-col justify-center text-center overflow-hidden">
                      <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1 truncate" title={m.label}>{m.label}</div>
                      <div className="text-lg font-bold truncate" title={m.value}>{m.value}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5" /> Executive Summary</h3>
                <p className="text-gray-700 leading-relaxed text-lg mb-6">{d?.thesis}</p>
                <div className="flex items-center gap-3 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="text-sm font-bold text-gray-500 uppercase">Analyst Confidence</div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-black" style={{ width: `${d?.confidence}%` }}></div>
                  </div>
                  <div className="font-bold">{d?.confidence}%</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <h4 className="font-bold mb-4 flex items-center gap-2 text-black"><Check className="w-4 h-4" /> Green Flags</h4>
                  <ul className="space-y-3">
                    {d?.green_flags?.map((f: string, i: number) => <li key={i} className="text-sm text-gray-600 flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-black mt-1.5 shrink-0"></div> {f}</li>)}
                  </ul>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <h4 className="font-bold mb-4 flex items-center gap-2 text-gray-600"><ShieldAlert className="w-4 h-4" /> Red Flags</h4>
                  <ul className="space-y-3">
                    {d?.red_flags?.map((f: string, i: number) => <li key={i} className="text-sm text-gray-500 flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 shrink-0"></div> {f}</li>)}
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h3 className="font-bold text-lg mb-4">Reasoning Trail</h3>
                <div className="space-y-4">
                  {d?.reasoning_steps?.map((r: any, i: number) => (
                    <div key={i} className="pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                      <div className="font-bold text-sm mb-1">{r.step}</div>
                      <div className="text-sm text-gray-600">{r.finding}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sources */}
              {d?.sources && d.sources.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-lg mb-4">Sources</h3>
                  <ul className="space-y-2">
                    {d.sources.map((s: any, i: number) => (
                      <li key={i}><a href={s.url} target="_blank" rel="noopener" className="text-sm text-blue-600 hover:underline flex items-center gap-1">↳ {s.title}</a></li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}