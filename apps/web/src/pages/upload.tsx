import React, { useState } from 'react';

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', textAlign: 'center' }}>
      <h1>音声ファイルアップロード</h1>
      <input
        type="file"
        accept=".mp3,.wav,audio/*"
        onChange={handleFileChange}
        style={{ marginBottom: 16 }}
      />
      {file && (
        <div style={{ marginTop: 16 }}>
          <p>選択されたファイル: {file.name}</p>
          <audio
            controls
            src={URL.createObjectURL(file)}
            style={{ width: '100%' }}
          />
        </div>
      )}
    </div>
  );
};

export default UploadPage;
