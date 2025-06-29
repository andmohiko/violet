import { onObjectFinalized } from 'firebase-functions/v2/storage';
import { db } from '~/lib/firebase';
import * as os from 'node:os';
import * as path from 'node:path';
import { getStorage } from 'firebase-admin/storage';
import * as fs from 'node:fs/promises';
import { serverTimestamp } from '~/lib/firebase';
import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from '@google/genai';

type DownloadAudioResult = {
  tempFilePath: string;
};

const bucketName = process.env.STORAGE_BUCKET;
const ai = new GoogleGenAI({
  apiKey: process.env.DEV_GEMINI_API_KEY,
});

//firestoreage上の音声データを一時ファイルとしてダウンロードし、storage上に保存された日時を読み取る関数
export async function downloadAudioFromStorage(
  filePath: string,
): Promise<DownloadAudioResult> {
  const bucket = getStorage().bucket(bucketName);

  const tempFilePath = path.join(os.tmpdir(), path.basename(filePath));
  console.log(`Downloading ${filePath} to ${tempFilePath}`);
  await bucket.file(filePath).download({ destination: tempFilePath });
  console.log(`Downloaded ${filePath} successfully.`);
  return { tempFilePath };
}

export const onAudioUpload = onObjectFinalized(
  {
    bucket: process.env.STORAGE_BUCKET,
  },

  async function main(event) {
    const filePath = event.data.name;
    const contentType = event.data.contentType ?? 'application/octet-stream';
    const uploadedBy = event.data.metadata?.uploadedBy ?? 'system';
    console.log('onAudioUpload:', { filePath, contentType });
    console.log(`Content Type: ${contentType}`);

    const { tempFilePath } = await downloadAudioFromStorage(filePath);
    try {
      const apiAudioFile = await ai.files.upload({
        file: tempFilePath,
        config: { mimeType: contentType },
      });
      console.log(
        'ファイルがFileAPIにアップロードされました:',
        apiAudioFile.uri,
      );
      if (apiAudioFile.uri) {
        const response = await ai.models.generateContent({
          model: 'gemini-1.5-flash', //音声は100万トークンあたり0.70ドル
          contents: createUserContent([
            createPartFromUri(apiAudioFile.uri, contentType),
            'Generate a transcript of the speech.',
          ]),
          config: {
            systemInstruction:
              'エンジニアの音声です。結果は日本語で生成してください。',
          },
        });
        if (response.usageMetadata) {
          console.log('Gemini API usage:', response.usageMetadata);
          // 例: promptTokenCount, candidatesTokenCount など
          const promptTokens = response.usageMetadata.promptTokenCount ?? 0;
          const responseTokens =
            response.usageMetadata.candidatesTokenCount ?? 0;
          const totalTokens = promptTokens + responseTokens;
          // トークン数をログに出力
          console.log(
            `Prompt tokens: ${promptTokens}, ` +
              `Response tokens: ${responseTokens}, ` +
              `Total tokens: ${totalTokens}`,
          );

          // データベースに保存
          const docRef = await db.collection('transcripts').add({
            storagePath: filePath,
            text: response.text,
            uploadedBy,
            createdAt: serverTimestamp, //timestamp型での時刻保存
            transcriptTotalTokens: totalTokens, // 書き起こしのトークン数
          });

          await docRef.update({ id: docRef.id });
          console.log('Transcript saved to Firestore.');
        }
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
