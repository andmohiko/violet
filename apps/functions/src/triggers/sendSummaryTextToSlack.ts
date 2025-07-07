import dayjs from 'dayjs';
import { notifySlack } from '~/lib/slack/notifySlack';

export async function sendSummaryTextToSlack(summary: string) {
  const yesterday = dayjs().subtract(1, 'day');
  const ymd = `${yesterday.year()}/${yesterday.month() + 1}/${yesterday.date()}`;
  const text = `【${ymd}の書き起こしの要約です】\n${summary}`;

  await notifySlack(text);
}
