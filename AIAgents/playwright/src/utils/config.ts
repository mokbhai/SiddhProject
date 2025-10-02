import dotenv from "dotenv";
import { tr } from "zod/v4/locales";

// Load environment variables
dotenv.config();

export const config = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY || "",
    baseUrl: process.env.OPENAI_API_BASE_URL || "https://api.openai.com/v1",
    model: process.env.OPENAI_API_MODEL || "gpt-4.1-mini",
    temperature: 0,
  },
  gemini: {
    apiKey: process.env.GOOGLE_API_KEY || "",
    model: process.env.GOOGLE_MODEL || "gemini-2.0-flash",
    temperature: 0,
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

  if (!config.openai.apiKey) {
    missing.push("OPENAI_API_KEY");
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
}

export function getOpenAIApiKey(): string {
  if (!config.openai.apiKey) {
    throw new Error("OPENAI_API_KEY is not set in environment variables");
  }
  return config.openai.apiKey;
}

export const getGeminiApiKey = (): string => {
  if (!config.gemini.apiKey) {
    throw new Error("GOOGLE_API_KEY is not set in environment variables");
  }
  return config.gemini.apiKey;
};
