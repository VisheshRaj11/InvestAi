import { StateGraph, Annotation } from "@langchain/langgraph";
import { intakeNode, researchNode, decisionNode } from "./nodes";
import { AgentState } from "./state";

// Define the LangGraph State Annotation
export const AgentStateAnnotation = Annotation.Root({
  query: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
  targetTicker: Annotation<string>({
    reducer: (x, y) => y ?? x,
  }),
  companyName: Annotation<string>({
    reducer: (x, y) => y ?? x,
  }),
  competitors: Annotation<string[]>({
    reducer: (x, y) => y ?? x,
  }),
  researchData: Annotation<any>({
    reducer: (x, y) => y ?? x,
  }),
  analysis: Annotation<any>({
    reducer: (x, y) => y ?? x,
  }),
  decision: Annotation<any>({
    reducer: (x, y) => y ?? x,
  }),
});

// Build the graph
const builder = new StateGraph(AgentStateAnnotation)
  .addNode("intake", intakeNode)
  .addNode("research", researchNode)
  .addNode("generate_decision", decisionNode)
  .addEdge("__start__", "intake")
  .addEdge("intake", "research")
  .addEdge("research", "generate_decision")
  .addEdge("generate_decision", "__end__");

export const agentGraph = builder.compile();
