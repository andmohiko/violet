'use client';
import { Button } from '~/components/ui/button';
import { useRouter } from 'next/navigation';

export const Header = () => {
  const router = useRouter();

  return (
    <div>
      <div className="flex items-center gap-4">
        <div>Transcription App</div>
        <Button
          variant="black"
          className="w-40"
          onClick={() => router.push('/')}
        >
          ホーム
        </Button>
        <Button
          variant="black"
          className="w-40"
          onClick={() => router.push('/upload')}
        >
          アップロード
        </Button>
        <Button
          variant="black"
          className="w-40"
          onClick={() => router.push('/list')}
        >
          一覧
        </Button>
      </div>
    </div>
  );
};
