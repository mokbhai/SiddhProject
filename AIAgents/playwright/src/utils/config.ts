import dotenv from "dotenv";
import { tr } from "zod/v4/locales";

// Load environment variables
dotenv.config();

export const config = {
  llm: {
    apiKey: process.env.LLM_API_KEY || "",
    baseUrl: process.env.LLM_API_BASE_URL || "https://api.llm.ai/v1",
    model: process.env.LLM_API_MODEL || "llama3",
    provider: process.env.LLM_API_PROVIDER || "openai", // openai, azure, anthropic, google, openrouter
    temperature: 0.8,
    ...JSON.parse(process.env.LLM_API_EXTRA_OPTIONS || "{}"),
  },
  mcp: {
    serverUrl: process.env.MCP_SERVER_URL || "http://localhost:3000",
    playwright: {
      command: "npx",
      args: [
        "@playwright/mcp@latest",
        "--browser=chrome",
        "--user-data-dir=/tmp/playwright-job-applier",
        "--save-session",
        "--save-trace",
        "--save-video=800x600",
        "--output-dir=/tmp/playwright-job-applier/output",
      ],
      transport: "stdio" as const,
      // transport: "http" as const,
      // url: "http://localhost:8080/mcp",
    },
  },
};

export function validateConfig() {
  const missing = [];

  if (!config.llm.apiKey) {
    missing.push("LLM_API_KEY");
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
}

export function getLLMApiKey(): string {
  if (!config.llm.apiKey) {
    throw new Error("LLM_API_KEY is not set in environment variables");
  }
  return config.llm.apiKey;
}
