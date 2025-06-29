import type { DownloadAudioResult } from '../../types/DownloadAudioResult';
import { getStorage } from 'firebase-admin/storage';
import * as os from 'node:os';
import * as path from 'node:path';

//firestoreage上の音声データを一時ファイルとしてダウンロードし、geminiAPIに渡すためのファイルパスを返す関数
export async function downloadAudioFromStorage(
  filePath: string,
): Promise<DownloadAudioResult> {
  const bucket = getStorage().bucket(process.env.STORAGE_BUCKET);

  const tempFilePath = path.join(os.tmpdir(), path.basename(filePath));
  console.log(`Downloading ${filePath} to ${tempFilePath}`);
  await bucket.file(filePath).download({ destination: tempFilePath });
  console.log(`Downloaded ${filePath} successfully.`);
  return { tempFilePath };
}
