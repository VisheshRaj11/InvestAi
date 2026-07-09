import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const getFastLLM = () => {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    throw new Error("MISSING_API_KEY");
  }
  return new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0.1,
    maxOutputTokens: 1024,
    maxRetries: 2,
    apiKey: process.env.GEMINI_API_KEY,
  });
};

export const getReasoningLLM = () => {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    throw new Error("MISSING_API_KEY");
  }
  return new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0.2,
    maxOutputTokens: 4096,
    maxRetries: 2,
    apiKey: process.env.GEMINI_API_KEY,
  });
};
