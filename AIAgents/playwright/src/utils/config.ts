import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: 'gpt-4.1-mini',
    temperature: 0,
  },
  mcp: {
    serverUrl: process.env.MCP_SERVER_URL || 'http://localhost:3000',
  },
};

export function validateConfig() {
  const missing = [];

  if (!config.openai.apiKey) {
    missing.push('OPENAI_API_KEY');
  }

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

export function getOpenAIApiKey(): string {
  if (!config.openai.apiKey) {
    throw new Error('OPENAI_API_KEY is not set in environment variables');
  }
  return config.openai.apiKey;
}
