export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";
const yahooFinance = new YahooFinance();

const TRENDING_SYMBOLS = ['AAPL', 'MSFT', 'NVDA', 'AMZN', 'META', 'GOOGL', 'TSLA', 'NFLX', 'AMD', 'INTC', 'CRM', 'ADBE'];

export async function GET() {
  try {
    const quotes = await Promise.all(TRENDING_SYMBOLS.map(sym => yahooFinance.quote(sym).catch(() => null)));
    const validQuotes = quotes.filter(q => q !== null);
    
    const trending = validQuotes.map((q: any) => ({
      ticker: q.symbol,
      companyName: q.shortName || q.longName || q.symbol,
      price: q.regularMarketPrice,
      change: q.regularMarketChange,
      changePercent: q.regularMarketChangePercent,
    }));
    
    return NextResponse.json(trending);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch trending stocks" }, { status: 500 });
  }
}
