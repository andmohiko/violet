'use client';
import { useState } from 'react';
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
  const [calendarOpen, setCalendarOpen] = useState(false);
  return (
    <div className="">
      <div className="flex items-center gap-8 mb-4">
        <Input
          type="text"
          placeholder="文字列検索"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-140"
        />
        <div className="flex items-center gap-3">
          <div className="relative">
            <Button
              type="button"
              onClick={() => setCalendarOpen((v) => !v)}
              className="w-22"
              variant="outline"
            >
              {date ? date.toLocaleDateString() : '日付選択'}
            </Button>
            {calendarOpen && (
              <div className="absolute z-10 mt-2">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => {
                    setDate(d);
                    setCalendarOpen(false);
                  }}
                />
              </div>
            )}
          </div>
          <Button
            type="button"
            onClick={onSearch}
            className="w-22 h-10 text-lg"
            variant="default"
          >
            検索
          </Button>
          <Button
            type="button"
            onClick={onReset}
            className="w-22 h-10 text-lg"
            variant="secondary"
          >
            リセット
          </Button>
        </div>
      </div>
    </div>
  );
};
