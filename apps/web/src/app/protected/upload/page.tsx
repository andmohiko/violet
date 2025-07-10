'use client';
import { useState } from 'react';
import { useStorage } from '~/infrastructure/storage/StorageProvider';
import { Badge } from '~/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Skeleton } from '~/components/ui/skeleton';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { useAuth } from '~/providers/AuthProvider';
import { useToast } from '~/hooks/useToast';

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const { uploadFile } = useStorage();
  const { currentUser } = useAuth();
  const { showSuccessToast, showErrorToast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      // "uploads/" フォルダにファイル名で保存
      const url = await uploadFile(`uploads/${file.name}`, file, {
        uploadedBy: currentUser?.uid ?? '',
      });
      setUploadedUrl(url);
      setFile(null);
      showSuccessToast(
        'アップロード完了',
        '音声ファイルのアップロードが完了しました。',
      );
    } catch (e) {
      console.error('アップロード失敗', e);
      showErrorToast(
        'アップロードに失敗しました。',
        'もう一度お試しください。',
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Card className=" shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold mb-2">
            音声ファイルアップロード（mp3, wavなど）
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center">
            <Input
              id="audio-file"
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="w-80"
            />
          </div>

          {file && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium truncate">{file.name}</span>
                <Badge variant="secondary">
                  {(file.size / 1024 / 1024).toFixed(1)}MB
                </Badge>
              </div>
              <audio
                controls
                src={URL.createObjectURL(file)}
                className="w-full rounded"
              >
                <track kind="captions" />
              </audio>
              <Button
                onClick={handleUpload}
                disabled={uploading}
                variant="default"
                className="w-full"
              >
                {uploading ? 'アップロード中...' : 'アップロード'}
              </Button>
            </div>
          )}

          {uploading && <Skeleton className="h-10 w-full" />}
        </CardContent>
      </Card>
    </div>
  );
};
export default UploadPage;
