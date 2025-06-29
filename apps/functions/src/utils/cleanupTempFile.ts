import * as fs from 'node:fs/promises';

export async function cleanupTempFile(tempFilePath: string) {
  try {
    await fs.unlink(tempFilePath);
    console.log('Temporary file deleted.');
  } catch (error) {
    console.warn('一時ファイルの削除に失敗:', error);
  }
}
