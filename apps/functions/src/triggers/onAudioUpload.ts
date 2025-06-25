import { onObjectFinalized } from 'firebase-functions/v2/storage';
import { db, serverTimestamp } from '~/lib/firebase';
export const onAudioUpload = onObjectFinalized(
  {
    bucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  },
  async (event) => {
    const filePath = event.data.name;
    const contentType = event.data.contentType;

    await db.collection('test-logs').add({
      filePath,
      contentType,
      timestamp: serverTimestamp,
    });
  },
);
