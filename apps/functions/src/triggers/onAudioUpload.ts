import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { downloadAudioFromStorage } from '~/infrastructure/storage/downloadAudioFromStorage';
import { uploadToFileAPI } from '~/lib/gemini/uploadToFileApi';
import { geminiTranscript } from '~/lib/gemini/geminiTranscript';
import { saveTranscriptToFirestore } from '~/infrastructure/firestore/saveTranscripts';
import { cleanupTempFile } from '~/utils/cleanupTempFile';
import { defineString } from 'firebase-functions/params';

const customRegion = defineString('CUSTOM_FUNCTION_REGION');

export const onAudioUpload = onDocumentCreated(
  {
    document: 'audios/{audioId}',
    region: customRegion,
  },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      console.error('No data found in Firestore document.');
      return;
    }

    const docData = snapshot.data();

    const filePath = docData.storagePath ?? '';
    const uploadedBy = docData.userId ?? 'system';
    const contentType = docData.contentType ?? 'application/octet-stream';

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
