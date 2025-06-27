import { ModeToggle } from '~/components/modeToggle';
import { Button } from '~/components/ui/button';

export const Header = () => (
  <header>
    <div className="flex items-center gap-4">
      <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 drop-shadow select-none">
        Transcription App
      </span>
    </div>
    <div className="flex items-center gap-4">
      <Button asChild variant="default" className="w-48">
        <a href="/">ホーム</a>
      </Button>
      <Button asChild variant="default" className="w-48">
        <a href="/upload">アップロード</a>
      </Button>
      <Button asChild variant="default" className="w-48">
        <a href="/list">一覧</a>
      </Button>

      <ModeToggle />
    </div>
  </header>
);
