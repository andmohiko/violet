import React, { useState } from 'react';

import styles from '~/styles/upload.module.css';

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
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
        </div>
      )}
    </div>
  );
};

export default UploadPage;
