import { NextRequest } from "next/server";
import YahooFinance from "yahoo-finance2";
const yahooFinance = new YahooFinance();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q) {
    return new Response("Missing query", { status: 400 });
  }

  try {
    const [quote, summary, chart] = await Promise.all([
      yahooFinance.quote(q),
      yahooFinance.quoteSummary(q, { modules: ["financialData"] }).catch(() => null),
      yahooFinance.chart(q, { period1: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], interval: "1wk" }).catch(() => null)
    ]);

    const formattedHistory = chart?.quotes ? chart.quotes.map((r: any) => ({ date: r.date.toISOString(), close: r.close })) : [];

    return Response.json({
      targetTicker: q,
      companyName: quote?.longName || quote?.shortName || q,
      researchData: {
        [q]: {
          price: quote?.regularMarketPrice,
          financials: summary?.financialData,
          history: formattedHistory
        }
      }
    });
  } catch (error) {
    console.error("Data API error:", error);
    return new Response("Data error", { status: 500 });
  }
}
