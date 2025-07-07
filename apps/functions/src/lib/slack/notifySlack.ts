const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;

export async function notifySlack(text: string) {
  if (!slackWebhookUrl) {
    console.error('SLACK_WEBHOOK_URLが設定されていません');
    return;
  }
  const payload = { text };
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
