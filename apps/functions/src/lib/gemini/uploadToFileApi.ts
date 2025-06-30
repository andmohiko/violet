import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.DEV_GEMINI_API_KEY,
});

export async function uploadToFileAPI(
  tempFilePath: string,
  contentType: string,
) {
  try {
    const apiAudioFile = await ai.files.upload({
      file: tempFilePath,
      config: { mimeType: contentType },
    });

    console.log('ファイルがFileAPIにアップロードされました:', apiAudioFile.uri);

    if (!apiAudioFile.uri) {
      throw new Error('Failed to upload file to Gemini API');
    }

    return apiAudioFile;
  } catch (error) {
    console.error('ファイルアップロードエラー:', error);
    throw error;
  }
}
