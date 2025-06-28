'use client';
import { Button } from '~/components/ui/button';
import { useRouter } from 'next/navigation';

export const Header = () => {
  const router = useRouter();

  return (
    <div className="w-full py-10 bg-primary/10 shadow-md mb-16">
      <div className="flex items-center justify-between maw-full px-6">
        <div className="text-5xl font-black tracking-tight flex items-center gap-2">
          <span className="text-primary">TranscriptionApp</span>
        </div>
        <div className="flex items-center gap-6">
          <Button
            variant="default"
            size="lg"
            className="w-40 h-12 text-lg"
            onClick={() => router.push('/')}
          >
            ホーム
          </Button>
          <Button
            variant="default"
            size="lg"
            className="w-40 h-12 text-lg"
            onClick={() => router.push('/upload')}
          >
            アップロード
          </Button>
          <Button
            variant="default"
            size="lg"
            className="w-40 h-12 text-lg"
            onClick={() => router.push('/list')}
          >
            一覧
          </Button>
        </div>
      </div>
    </div>
  );
};
