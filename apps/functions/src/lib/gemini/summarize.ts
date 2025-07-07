import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.DEV_GEMINI_API_KEY,
});

export async function summarizeText(
  text: string,
): Promise<{ summary: string; totalTokens: number }> {
  const response = await ai.models.generateContent({
    model: 'gemini-1.5-flash',
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `以下の会議書き起こしを要約してください（日本語）:\n${text}`,
          },
        ],
      },
    ],
    config: {
      systemInstruction:
        'エンジニアが話した文章の書き起こしです。日本語で簡潔にまとめてください。',
    },
  });

  const promptTokens = response.usageMetadata?.promptTokenCount ?? 0;
  const responseTokens = response.usageMetadata?.candidatesTokenCount ?? 0;
  const totalTokens = promptTokens + responseTokens;

  return {
    summary: response.text ?? '',
    totalTokens,
  };
}
