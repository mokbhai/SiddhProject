import { GoogleGenerativeAI } from "@google/generative-ai";

const gemini = new GoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const SYSTEM_PROMPT = `
You are a helpful assistant that summarizes meeting transcripts and provides a list of action items, key notes, and next steps.
`;

export const summarize = async (content) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Format the messages according to Gemini's expected structure
  const prompt = SYSTEM_PROMPT + "\n\nTranscript:\n" + content;

  const result = await model.generateContent({
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
  });

  const response = result.response;
  const text = response.text();

  return text;
};
