import React, { useState } from 'react';
import { useStorage } from '~/providers/StorageProvider';
import { Label } from '~/components/ui/label';
import { Badge } from '~/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Skeleton } from '~/components/ui/skeleton';
import { Button } from '~/components/ui/button';

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
    <div>
      <Card>
        <CardHeader>
          <CardTitle>音声ファイルアップロード</CardTitle>
        </CardHeader>

        <CardContent>
          <div>
            <Input
              id="audio-file"
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="mt-1"
            />
          </div>

          {file && (
            <div>
              <div>
                <span>{file.name}</span>
                <Badge variant="secondary">
                  {(file.size / 1024 / 1024).toFixed(1)}MB
                </Badge>
              </div>
              <audio controls src={URL.createObjectURL(file)} />
            </div>
          )}

          {file && (
            <Button
              onClick={handleUpload}
              disabled={uploading}
              variant="default"
            >
              {uploading ? 'アップロード中...' : 'アップロード'}
            </Button>
          )}

          {uploadedUrl && (
            <Button asChild variant={'link'}>
              <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">
                アップロードされた音声ファイルを開く
              </a>
            </Button>
          )}

          {uploading && <Skeleton className="h-10 w-full" />}
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadPage;
