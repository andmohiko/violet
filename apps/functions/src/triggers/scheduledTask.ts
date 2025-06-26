import { onSchedule } from 'firebase-functions/v2/scheduler';
import { summarizeYesterdayTranscripts } from './summarize';

export const dailySummary = onSchedule(
  {
    schedule: 'every day 00:00', // 毎日00:00に実行
    timeZone: 'Asia/Tokyo', // タイムゾーン
  },
  async () => {
    // ここにバッチ処理を書く
    const summary = await summarizeYesterdayTranscripts();
    if (summary) {
      console.log('要約結果:', summary);
      // ここでSlack通知なども追加可能
    }
    console.log('毎日00:00に実行される関数です');
  },
);
