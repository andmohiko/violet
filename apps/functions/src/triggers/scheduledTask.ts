import { onSchedule } from 'firebase-functions/v2/scheduler';
import { summarizeYesterdayTranscripts } from '~/infrastructure/firestore/summary';
import { sendSummaryTextToSlack } from '~/triggers/sendSummaryTextToSlack';
import { defineString } from 'firebase-functions/params';

const customRegion = defineString('CUSTOM_FUNCTION_REGION');

export const dailySummary = onSchedule(
  {
    schedule: 'every day 00:00', // 毎日00:00に実行
    timeZone: 'Asia/Tokyo', // タイムゾーン
    region: customRegion,
  },
  async () => {
    try {
      const summary = await summarizeYesterdayTranscripts();
      if (summary) {
        console.log('要約結果:', summary);
        await sendSummaryTextToSlack(summary);
      }
      console.log('毎日00:00に実行される関数です');
    } catch (error) {
      console.error('定期実行エラー:', error);
    }
  },
);
