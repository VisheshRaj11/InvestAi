import YahooFinance from "yahoo-finance2";
const yahooFinance = new YahooFinance();

export async function getCompanyData(ticker: string) {
  try {
    const quote = await yahooFinance.quote(ticker);
    const summary = await yahooFinance.quoteSummary(ticker, { modules: ["financialData", "defaultKeyStatistics", "summaryProfile"] });
    return { quote, summary };
  } catch (error) {
    console.error(`Error fetching data for ${ticker}:`, error);
    return null;
  }
}

export async function getCompanyNews(ticker: string) {
  try {
    const news = await yahooFinance.search(ticker, { newsCount: 5 });
    return news.news;
  } catch (error) {
    console.error(`Error fetching news for ${ticker}:`, error);
    return [];
  }
}

export async function getHistoricalData(ticker: string, period: "1W" | "1M" | "1Y" = "1Y") {
  try {
    const periodMap = {
      "1W": { period1: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
      "1M": { period1: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
      "1Y": { period1: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
    };
    
    const queryOptions = {
      ...periodMap[period],
      interval: period === "1W" ? "1d" : period === "1M" ? "1d" : "1wk" as const,
    };
    
    const result = await yahooFinance.chart(ticker, queryOptions);
    return result?.quotes ? result.quotes.map((r: any) => ({ date: r.date.toISOString(), close: r.close })) : [];
  } catch (error) {
    console.error(`Error fetching historical data for ${ticker}:`, error);
    return [];
  }
}
