import { onSchedule } from 'firebase-functions/v2/scheduler';
import { summarizeYesterdayTranscripts } from '~/lib/gemini/summarize';
import { notifySlack } from '~/lib/slack/notifySlack';

export const dailySummary = onSchedule(
  {
    schedule: 'every day 00:00', // 毎日00:00に実行
    timeZone: 'Asia/Tokyo', // タイムゾーン
  },
  async () => {
    try {
      const summary = await summarizeYesterdayTranscripts();
      if (summary) {
        console.log('要約結果:', summary);
        await notifySlack(summary);
      }
      console.log('毎日00:00に実行される関数です');
    } catch (error) {
      console.error('定期実行エラー:', error);
    }
  },
);
