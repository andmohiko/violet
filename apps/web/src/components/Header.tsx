'use client';
import { Button } from '~/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuth } from '~/providers/AuthProvider';
import { ModeToggle } from './modeToggle';

export const Header = () => {
  const router = useRouter();
  const { currentUser, logout } = useAuth();

  return (
    <header className="sticky top-0 w-full py-10 bg-secondary shadow-md mb-16 z-10 isolation-auto">
      <div className="flex items-center justify-between max-w-full px-6">
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
            onClick={() => router.push('/protected/upload')}
          >
            アップロード
          </Button>
          <Button
            variant="default"
            size="lg"
            className="w-40 h-12 text-lg"
            onClick={() => router.push('/protected/list')}
          >
            一覧
          </Button>
          {currentUser ? (
            <Button
              variant="outline"
              size="lg"
              className="w-40 h-12 text-lg"
              onClick={logout}
            >
              ログアウト
            </Button>
          ) : (
            <Button
              variant="outline"
              size="lg"
              className="w-40 h-12 text-lg"
              onClick={() => router.push('/publiced/auth')}
            >
              ログイン
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
