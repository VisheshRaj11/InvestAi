import { getFastLLM, getReasoningLLM } from "../providers/llm";
import { AgentState } from "./state";
import { getCompanyData, getCompanyNews, getHistoricalData } from "./tools";
import { z } from "zod";

const SYSTEM_PROMPT = `You are a professional financial research analyst. Be precise, cite specific facts, avoid speculation not grounded in the retrieved data, and never use casual language. Do not use filler phrases.`;

export async function intakeNode(state: AgentState): Promise<Partial<AgentState>> {
  // Since the UI passes the ticker directly as the query, we can bypass the LLM here
  // to save 50% of our API quota and avoid hitting rate limits.
  const targetTicker = state.query.trim().toUpperCase();

  return {
    targetTicker,
    companyName: targetTicker,
    competitors: [],
  };
}

export async function researchNode(state: AgentState): Promise<Partial<AgentState>> {
  const target = state.targetTicker!;
  const competitors = state.competitors || [];
  const tickersToFetch = [target, ...competitors];
  
  const researchData: any = {};

  await Promise.all(tickersToFetch.map(async (ticker) => {
    const [data, news, history] = await Promise.all([
      getCompanyData(ticker),
      getCompanyNews(ticker),
      getHistoricalData(ticker, "1Y"),
    ]);
    
    researchData[ticker] = {
      price: data?.quote?.regularMarketPrice,
      financials: data?.summary?.financialData,
      news: news.map((n: any) => ({ title: n.title, publisher: n.publisher, link: n.link })),
      history,
    };
  }));

  return { researchData };
}



export async function decisionNode(state: AgentState): Promise<Partial<AgentState>> {
  const llm = getReasoningLLM();
  
  const schema = z.object({
    verdict: z.enum(["invest", "pass", "watch"]).describe("The final investment verdict."),
    confidence: z.number().min(0).max(100).describe("Confidence score (0-100)."),
    thesis: z.string().describe("2-3 sentences. Specific, analyst-toned investment thesis."),
    reasoning_steps: z.array(z.object({ 
      step: z.string(), 
      finding: z.string() 
    })).describe("Step-by-step logical deductions leading to the verdict. Must cite specific data."),
    green_flags: z.array(z.string()).describe("Positive factors citing specific metrics/news."),
    red_flags: z.array(z.string()).describe("Negative factors or risks citing specific metrics/news."),
    key_metrics: z.array(z.object({ 
      label: z.string(), 
      value: z.string() 
    })).describe("Important financial metrics extracted from the data."),
    sources: z.array(z.object({ 
      title: z.string(), 
      url: z.string() 
    })).describe("News articles or data sources referenced."),
  });

  const structuredLlm = llm.withStructuredOutput(schema, { name: "decision_report" });
  
  // Condense the data payload to avoid exceeding token limits
  const targetData = state.researchData?.[state.targetTicker!];
  const condensedData = {
    target: state.targetTicker,
    price: targetData?.price,
    financials: targetData?.financials,
    news: targetData?.news?.slice(0, 5),
    competitors: state.competitors?.map(c => ({
      ticker: c,
      price: state.researchData?.[c]?.price,
      revenue: state.researchData?.[c]?.financials?.totalRevenue,
    }))
  };

  const context = JSON.stringify(condensedData);

  const prompt = `${SYSTEM_PROMPT}
  
You are tasked with providing a final investment decision report based on the provided JSON data context.
Every claim must reference a concrete data point (an actual number, a dated headline, a named competitor).
Do NOT use casual language, emoji, or vague hedging.

Data Context:
${context}
`;

  const response = await structuredLlm.invoke(prompt);

  // Some versions of LangChain or the LLM itself wrap the output in the name provided or a generic key.
  let finalDecision = response;
  if (response?.decision_report) finalDecision = response.decision_report;
  else if (response?.decision) finalDecision = response.decision;

  return {
    decision: finalDecision
  };
}