import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const aiAgent = 'gemini-2.0-flash';

export const configAI = {
  model: aiAgent,
  generationConfig: {
    temperature: 0.8, // More creative
    maxOutputTokens: 500,
    responseMimeType: 'application/json' // Force JSON response!
  }
};

export default genAI;
