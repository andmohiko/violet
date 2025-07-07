import { db } from '~/lib/firebase';
import { summarizeText } from '~/lib/gemini/summarize';
import dayjs from 'dayjs';

export async function summarizeYesterdayTranscripts() {
  const start = dayjs().subtract(1, 'day').startOf('day').toDate();
  const end = dayjs().subtract(1, 'day').endOf('day').toDate();

  console.log(`書き起こし期間: ${start} から ${end}`);

  const snapshot = await db
    .collection('transcripts')
    .where('createdAt', '>=', start)
    .where('createdAt', '<=', end)
    .get();

  if (snapshot.empty) {
    console.log('昨日分のtranscriptsはありません');
    return null;
  }

  const summaries: string[] = [];
  let count = 1;
  for (const doc of snapshot.docs) {
    const text = doc.data().text;
    const transcriptTotalTokens = doc.data().transcriptTotalTokens ?? 0;
    if (!text) continue;

    try {
      const { summary, totalTokens: summaryTokens } = await summarizeText(text);
      const totalTokens = summaryTokens + transcriptTotalTokens;
      await db.collection('transcripts').doc(doc.id).update({
        summary,
        summaryTotalTokens: summaryTokens,
        totalTokens,
      });

      summaries.push(
        `書き起こし${count}\nFireStoreドキュメントID${doc.id}\n消費トークン総数${totalTokens}\n${summary}\n`,
      );
      count++;
    } catch (error) {
      console.error(`要約生成エラー (ドキュメントID: ${doc.id}):`, error);
    }
  }

  return summaries.join('');
}
