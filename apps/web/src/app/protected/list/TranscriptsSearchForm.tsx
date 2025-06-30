'use client';

import type { Transcript } from '~/types/transcripts';
import { Calendar } from '~/components/ui/calendar';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';

type TranscriptsSearchFormProps = {
  keyword: string;
  setKeyword: (v: string) => void;
  date: Date | undefined;
  setDate: (d: Date | undefined) => void;
  onSearch: () => void;
  onReset: () => void;
};

export const TranscriptsSearchForm: React.FC<TranscriptsSearchFormProps> = ({
  keyword,
  setKeyword,
  date,
  setDate,
  onSearch,
  onReset,
}) => {
  return (
    <div className="">
      <div className="flex flex-col justify-center items-center gap-4 mb-4">
        <Input
          type="text"
          placeholder="文字列検索"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Calendar mode="single" selected={date} onSelect={setDate} />
        <Button type="button" onClick={onSearch} className="w-60 h-10 text-lg">
          検索
        </Button>
        <Button type="button" onClick={onReset} className="w-60 h-10 text-lg">
          リセット
        </Button>
      </div>
    </div>
  );
};
