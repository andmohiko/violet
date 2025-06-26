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

  // 各ドキュメントごとに要約し、summaryフィールドを保存
  const summaries: string[] = [];
  let count = 1;
  for (const doc of snapshot.docs) {
    const text = doc.data().text;
    const transcriptTotalTokens = doc.data().totalTokens ?? 0;
    if (!text) continue;

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
          'エンジニアの会議の要約です。日本語で簡潔にまとめてください。',
      },
    });

    const summary = response.text ?? '';
    await db.collection('transcripts').doc(doc.id).update({ summary });

    // トークン数のログ出力
    let summariesTotalTokens = 0;
    if (response.usageMetadata) {
      const promptTokens = response.usageMetadata.promptTokenCount ?? 0;
      const responseTokens = response.usageMetadata.candidatesTokenCount ?? 0;
      summariesTotalTokens = promptTokens + responseTokens;
      console.log(
        `Prompt tokens: ${promptTokens}, ` +
          `Response tokens: ${responseTokens}, ` +
          `Total tokens: ${summariesTotalTokens}`,
      );
    }
    const totalTokens = summariesTotalTokens + transcriptTotalTokens;
    summaries.push(
      `書き起こし${count}\nFireStoreドキュメントID${doc.id}\n消費トークン総数${totalTokens}\n${summary}\n`,
    );
    count++;
  }

  return summaries.join('');
}
