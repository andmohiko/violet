import { db, serverTimestamp } from '~/lib/firebase';
import type { TranscriptionResult } from '~/lib/gemini/geminiTranscript';

export async function saveTranscriptToFirestore(
  transcriptionResult: TranscriptionResult,
  storagePath: string,
  uploadedBy: string,
) {
  const docRef = await db.collection('transcripts').add({
    storagePath,
    text: transcriptionResult.text,
    uploadedBy,
    createdAt: serverTimestamp,
    transcriptTotalTokens: transcriptionResult.totalTokens,
  });

  await docRef.update({ id: docRef.id });

  return docRef;
}
