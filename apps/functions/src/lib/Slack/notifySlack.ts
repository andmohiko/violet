const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;

export async function notifySlack(summary: string) {
  if (!slackWebhookUrl) {
    console.error('SLACK_WEBHOOK_URLが設定されていません');
    return;
  }
  // 昨日の日付を取得
  const now = new Date();
  const yesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1,
  );
  const ymd = `${yesterday.getFullYear()}/${yesterday.getMonth() + 1}/${yesterday.getDate()}`;
  const text = `【${ymd}の書き起こしの要約です】\n${summary}`;

  const payload = {
    text,
  };
  try {
    await fetch(slackWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('Slack通知中に失敗しました:', error);
  }
}
