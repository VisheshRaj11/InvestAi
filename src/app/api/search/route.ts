import { NextRequest } from "next/server";
import YahooFinance from "yahoo-finance2";
const yahooFinance = new YahooFinance();

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q) {
    return new Response("Missing query", { status: 400 });
  }

  try {
    const results = await yahooFinance.search(q, { quotesCount: 5, newsCount: 0 });
    
    if (!results || !results.quotes) {
      return Response.json([]);
    }
    
    const formatted = results.quotes
      .filter((q: any) => q.isYahooFinance && ['EQUITY', 'ETF'].includes(q.quoteType)) // Only get valid assets
      .map((q: any) => ({
        symbol: q.symbol,
        name: q.shortname || q.longname || q.symbol,
        exchange: q.exchange,
      }));
    
    return Response.json(formatted);
  } catch (error) {
    console.error("Search API error:", error);
    return Response.json([]); // Fail gracefully so it doesn't crash the autocomplete
  }
}
