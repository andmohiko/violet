import { onObjectFinalized } from 'firebase-functions/v2/storage';
import { db } from '~/lib/firebase';
import * as os from 'node:os';
import * as path from 'node:path';
import { getStorage } from 'firebase-admin/storage';
import * as fs from 'node:fs/promises';
import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from '@google/genai';

const bucketName = process.env.STORAGE_BUCKET;
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

//firestoreage上の音声データを一時ファイルとしてダウンロードする関数
export async function downloadAudioFromStorage(
  filePath: string,
): Promise<string> {
  const bucket = getStorage().bucket(bucketName);
  const tempFilePath = path.join(os.tmpdir(), path.basename(filePath));
  console.log(`Downloading ${filePath} to ${tempFilePath}`);
  await bucket.file(filePath).download({ destination: tempFilePath });
  console.log(`Downloaded ${filePath} successfully.`);
  return tempFilePath;
}

export const onAudioUpload = onObjectFinalized(
  {
    bucket: process.env.STORAGE_BUCKET,
  },

  async function main(event) {
    const filePath = event.data.name;
    const contentType = event.data.contentType ?? 'application/octet-stream';
    const createdAt = event.data.timeCreated;
    const firebaseAudioUrl = `gs://${event.data.bucket}/${filePath}`;
    console.log('onAudioUpload:', { filePath, contentType, createdAt });
    console.log(`Content Type: ${contentType}`);

    const tempFilePath = await downloadAudioFromStorage(filePath);
    console.log(`Temporary file path: ${tempFilePath}`);
    try {
      const apiAudioFile = await ai.files.upload({
        file: tempFilePath,
        config: { mimeType: contentType },
      });
      console.log('File uploaded to Gemini API:', apiAudioFile.uri);
      if (apiAudioFile.uri) {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: createUserContent([
            createPartFromUri(apiAudioFile.uri, contentType),
            'Generate a transcript of the speech.',
          ]),
          config: {
            systemInstruction:
              '会議の音声です。結果は日本語で生成してください。',
            thinkingConfig: {
              thinkingBudget: 0,
            },
          },
        });
        // データベースに保存
        const docRef = await db.collection('transcripts').add({
          audioUrl: firebaseAudioUrl,
          text: response.text,
          createdAt,
          uploadedBy: 'system',
        });

        await docRef.update({ id: docRef.id });
        console.log('Transcript saved to Firestore.');
      }
    } catch (error) {
      // 通信エラーやAPIエラー時
      console.error('Gemini API通信エラー:', error);
      throw error;
    } finally {
      // 一時ファイルを削除
      try {
        await fs.unlink(tempFilePath);
        console.log('Temporary file deleted.');
      } catch (e) {
        console.warn('一時ファイルの削除に失敗:', e);
      }
    }
  },
);
