import { onObjectFinalized } from 'firebase-functions/v2/storage';
import { downloadAudioFromStorage } from '~/infrastructure/storage/downloadAudioFromStorage';
import { uploadToFileAPI } from '~/lib/gemini/uploadToFileApi';
import { geminiTranscript } from '~/lib/gemini/geminiTranscript';
import { saveTranscriptToFirestore } from '~/infrastructure/firestore/saveTranscripts';
import { cleanupTempFile } from '~/utils/cleanupTempFile';

export const onAudioUpload = onObjectFinalized(
  {
    bucket: process.env.STORAGE_BUCKET,
    region: process.env.CUSTOM_FUNCTIONS_REGION,
  },
  async function main(event) {
    const filePath = event.data.name;
    const contentType = event.data.contentType ?? 'application/octet-stream';
    const uploadedBy = event.data.metadata?.uploadedBy ?? 'system';

    console.log('onAudioUpload:', { filePath, contentType });

    const { tempFilePath } = await downloadAudioFromStorage(filePath);

    try {
      const apiAudioFile = await uploadToFileAPI(tempFilePath, contentType);
      const transcriptionResult = await geminiTranscript(
        apiAudioFile.uri ?? '',
        contentType,
      );
      await saveTranscriptToFirestore(
        transcriptionResult,
        filePath,
        uploadedBy,
      );

      console.log('Transcript saved to Firestore.');
    } catch (error) {
      console.error('Audio transcription process failed:', error);
      throw error;
    } finally {
      await cleanupTempFile(tempFilePath);
    }
  },
);
