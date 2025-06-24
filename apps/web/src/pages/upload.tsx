import React, { useState } from 'react';
import { useStorage } from '~/providers/StorageProvider';
import styles from '~/styles/upload.module.css';

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const { uploadFile } = useStorage();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      // "uploads/" フォルダにファイル名で保存
      const url = await uploadFile(`uploads/${file.name}`, file);
      setUploadedUrl(url);
      alert('アップロード完了');
    } catch (e) {
      console.error('アップロード失敗', e);
    }
    setUploading(false);
  };

  return (
    <div className={styles.container}>
      <h1>音声ファイルアップロード</h1>
      <input
        type="file"
        accept=".mp3,.wav,audio/*"
        onChange={handleFileChange}
        className={styles.fileInput}
      />
      {file && (
        <div className={styles.fileInfo}>
          <p>選択されたファイル: {file.name}</p>
          <audio
            controls
            src={URL.createObjectURL(file)}
            className={styles.audioPlayer}
          />
          <button onClick={handleUpload} disabled={uploading}>
            {uploading ? 'アップロード中...' : 'アップロード'}
          </button>
          {uploadedUrl && (
            <div>
              <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">
                アップロード後のファイルを確認
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadPage;
