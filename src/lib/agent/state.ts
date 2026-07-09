export interface AgentState {
  query: string;
  targetTicker?: string;
  companyName?: string;
  competitors?: string[];
  
  researchData?: {
    [ticker: string]: {
      price?: any;
      financials?: any;
      news?: any[];
      history?: any[];
    };
  };

  decision?: {
    verdict: "invest" | "pass" | "watch";
    confidence: number;
    thesis: string;
    reasoning_steps: { step: string; finding: string }[];
    green_flags: string[];
    red_flags: string[];
    key_metrics: { label: string; value: string }[];
    sources: { title: string; url: string }[];
  };

  messages?: any[];
}