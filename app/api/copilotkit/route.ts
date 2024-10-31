import {
  CopilotRuntime,
  LangChainAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { NextRequest } from "next/server";

const genAI = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-1.5-flash",
});
const serviceAdapter = new LangChainAdapter({
  chainFn: async ({ messages, tools }) => {
    return genAI.stream(messages, { tools });
  },
});

const runtime = new CopilotRuntime();

export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    endpoint: "/api/copilotkit",
    serviceAdapter,
  });
  return handleRequest(req);
};
