import { onObjectFinalized } from 'firebase-functions/v2/storage';
import { db } from '~/lib/firebase';

export const onAudioUpload = onObjectFinalized(
  {
    bucket: 'transcription-f3e8a.firebasestorage.app',
  },

  async (event) => {
    const filePath = event.data.name;
    const contentType = event.data.contentType;
    const createdAt = event.data.timeCreated;
    console.log('onAudioUpload:', { filePath, contentType, createdAt });

    const response = await fetch('<API_ENDPOINT>', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filePath,
        contentType,
      }),
    });
    const data = await response.json();

    if (response.ok) {
      const { text, summary } = data as { text: string; summary?: string };
      const audioUrl = `gs://${event.data.bucket}/${filePath}`;
      await db.collection('transcripts').add({
        text,
        summary,
        createdAt,
        audioUrl,
      });
    } else {
      console.error('gemini apiエラー:', data);
      throw new Error(`gemini api failed: ${data.message}`);
    }
  },
);
