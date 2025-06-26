const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;

export async function notifySlack(text: string) {
  if (!slackWebhookUrl) {
    console.error('SLACK_WEBHOOK_URLが設定されていません');
    return;
  }
  const payload = {
    text,
  };
  const res = await fetch(slackWebhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    console.error('Slack通知に失敗しました:', await res.text());
  } else {
    console.log('Slack通知に成功しました');
  }
}
