'use client';

import { useTranscriptsSearch } from '~/hooks/useTranscriptsSearch';
import type { Transcript } from '~/types/transcripts';
import { Calendar } from '~/components/ui/calendar';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';

type TranscriptsSearchFormProps = {
  transcripts: Transcript[];
  onResult: (results: Transcript[]) => void;
};

export const TranscriptsSearchForm: React.FC<TranscriptsSearchFormProps> = ({
  transcripts,
  onResult,
}) => {
  const { keyword, setKeyword, date, setDate, handleSearch } =
    useTranscriptsSearch(transcripts, onResult);

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
        <Button
          type="button"
          onClick={handleSearch}
          className="w-60 h-10 text-lg"
        >
          検索
        </Button>
      </div>
    </div>
  );
};
