export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import { agentGraph } from "@/lib/agent/graph";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { globalRateLimiter } from "@/lib/rate-limiter";
import { researchNode } from "@/lib/agent/nodes";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const userId = (session.user as any).id;
    const { query, force } = await req.json();

    if (!query) {
      return new Response("Missing query", { status: 400 });
    }

    const encoder = new TextEncoder();
    const targetTicker = query.trim().toUpperCase();
    
    // Check Cache first (unless forced)
    if (!force) {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const cachedResult = await prisma.researchLog.findFirst({
        where: {
          ticker: targetTicker,
          createdAt: { gte: twentyFourHoursAgo }
        },
        orderBy: { createdAt: 'desc' }
      });

      if (cachedResult) {
        const stream = new ReadableStream({
          async start(controller) {
            try {
              // We need to fetch live price/history (0 LLM calls) so the UI has the chart and price
              const researchState = await researchNode({ targetTicker, query: targetTicker } as any);
              controller.enqueue(encoder.encode(`data: {"node":"research","data":${JSON.stringify(researchState)}}\n\n`));
              
              // Send the cached decision
              const decision = JSON.parse(cachedResult.fullResult);
              controller.enqueue(encoder.encode(`data: {"node":"generate_decision","data":{"decision": ${JSON.stringify(decision)}}}\n\n`));
              
              // Send cache flag
              controller.enqueue(encoder.encode(`data: {"data": {"isCached": true, "cachedAt": "${cachedResult.createdAt.toISOString()}"}}\n\n`));
              
              controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
              controller.close();
            } catch (e) {
              controller.error(e);
            }
          }
        });
        
        return new Response(stream, {
          headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", "Connection": "keep-alive" },
        });
      }
    }
    
    // No cache: Run full graph with Rate Limiter
    const stream = new ReadableStream({
      async start(controller) {
        let finalState: any = {};
        
        try {
          await globalRateLimiter.acquire(() => {
            controller.enqueue(encoder.encode(`data: {"data": {"status": "queued", "message": "High demand — your research will start in a few seconds"}}\n\n`));
          });
          
          controller.enqueue(encoder.encode(`data: {"data": {"status": "running", "message": ""}}\n\n`));

          const streamIt = await agentGraph.stream({ query }, { streamMode: "updates" });
          
          for await (const chunk of streamIt) {
            const nodeName = Object.keys(chunk)[0];
            const stateUpdate = (chunk as any)[nodeName];
            
            finalState = { ...finalState, ...stateUpdate };
            
            const event = {
              node: nodeName,
              data: stateUpdate,
            };
            
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
          }
          
          // Auto-save to ResearchLog
          if (finalState.targetTicker && finalState.decision) {
            await prisma.researchLog.create({
              data: {
                userId,
                ticker: finalState.targetTicker,
                companyName: finalState.companyName || finalState.targetTicker,
                verdict: finalState.decision.verdict,
                confidence: finalState.decision.confidence || finalState.decision.trustScore || 0,
                thesis: finalState.decision.thesis,
                fullResult: JSON.stringify(finalState.decision),
              }
            });
          }
          
          controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
          controller.close();
        } catch (err: any) {
          console.error("Agent error:", err);
          if (err.message === "MISSING_API_KEY") {
             controller.enqueue(encoder.encode(`data: {"error": "Please add your Gemini API Key to the .env.local file to use the AI Agent."}\n\n`));
          } else if (err.message?.includes("429") || err.message?.includes("quota") || err.message?.includes("RateLimit")) {
             controller.enqueue(encoder.encode(`data: {"error": "Google Gemini API rate limit exceeded. You are making too many requests too quickly on the free tier. Please wait about 30 seconds and try again."}\n\n`));
          } else {
             controller.enqueue(encoder.encode(`data: {"error": "Agent execution failed: ${err.message || "Unknown error"}"}\n\n`));
          }
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
