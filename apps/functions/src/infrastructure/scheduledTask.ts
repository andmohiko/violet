import { onSchedule } from 'firebase-functions/v2/scheduler';
import { summarizeYesterdayTranscripts } from '../lib/gemini/summarize';
import { notifySlack } from '../lib/Slack/notifySlack';

export const dailySummary = onSchedule(
  {
    schedule: 'every day 00:00', // 毎日00:00に実行
    timeZone: 'Asia/Tokyo', // タイムゾーン
  },
  async () => {
    const summary = await summarizeYesterdayTranscripts();
    if (summary) {
      console.log('要約結果:', summary);
      await notifySlack(summary);
    }
    console.log('毎日00:00に実行される関数です');
  },
);
