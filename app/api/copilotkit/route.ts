import {
  CopilotRuntime,
  GroqAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { Groq } from "groq-sdk";
import { NextRequest } from "next/server";

// const genAI = new ChatGoogleGenerativeAI({
//   apiKey: process.env.GOOGLE_API_KEY,
//   model: "gemini-1.5-flash",
// });

// const langServiceAdapter = new LangChainAdapter({
//   chainFn: async ({ messages, tools }) => {
//     return genAI.stream(messages, { tools });
//   },
// });
// langServiceAdapter
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const serviceAdapter = new GroqAdapter({ groq, model: "llama-3.1-8b-instant" });

const runtime = new CopilotRuntime();

export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    endpoint: "/api/copilotkit",
    serviceAdapter,
  });
  return handleRequest(req);
};
