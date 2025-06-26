import { db } from '../lib/firebase';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.DEV_GEMINI_API_KEY,
});

export async function summarizeYesterdayTranscripts() {
  // 現在日時
  const now = new Date();
  // 昨日の0時
  const start = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1,
    0,
    0,
    0,
    0,
  );
  // 昨日の23:59:59
  const end = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1,
    23,
    59,
    59,
    999,
  );

  const snapshot = await db
    .collection('transcripts')
    .where('createdAt', '>=', start)
    .where('createdAt', '<=', end)
    .get();

  if (snapshot.empty) {
    console.log('昨日分のtranscriptsはありません');
    return null;
  }

  const texts = snapshot.docs.map((doc) => doc.data().text).join('\n');

  const response = await ai.models.generateContent({
    model: 'gemini-1.5-flash',
    contents: {
      text: `以下の会議書き起こしを要約してください。いくつかの会議の内容がまとめてある場合があるので、その場合はそれぞれの会議に分けて要約を行ってください（日本語）:\n${texts}`,
    },

    config: {
      systemInstruction:
        'エンジニアの会議の要約です。日本語で簡潔にまとめてください。',
    },
  });

  // トークン数のログ出力
  if (response.usageMetadata) {
    const promptTokens = response.usageMetadata.promptTokenCount ?? 0;
    const responseTokens = response.usageMetadata.candidatesTokenCount ?? 0;
    const totalTokens = promptTokens + responseTokens;
    console.log(
      `Prompt tokens: ${promptTokens}, ` +
        `Response tokens: ${responseTokens}, ` +
        `Total tokens: ${totalTokens}`,
    );
  }

  return response.text;
}
