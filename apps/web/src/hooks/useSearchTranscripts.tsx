import { useState, useEffect } from 'react';
import type { Transcript } from '~/types/transcripts';

export const useSearchTranscripts = (transcripts: Transcript[]) => {
  const [keyword, setKeyword] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [filtered, setFiltered] = useState<Transcript[]>(transcripts);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    let results = transcripts;

    if (keyword) {
      results = results.filter((t) =>
        t.text?.toLowerCase().includes(keyword.toLowerCase()),
      );
    }

    if (date) {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      const selectedDate = `${yyyy}-${mm}-${dd}`;

      results = results.filter((t) => {
        if (!t.createdAt) return false;
        let d: Date;
        if (
          typeof t.createdAt === 'object' &&
          t.createdAt !== null &&
          typeof (t.createdAt as { toDate?: unknown }).toDate === 'function'
        ) {
          d = (t.createdAt as { toDate: () => Date }).toDate();
        } else {
          d = new Date(t.createdAt as string | Date);
        }
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const targetDate = `${yyyy}-${mm}-${dd}`;
        return targetDate === selectedDate;
      });
    }

    setFiltered(results);
    setSearched(true);
  };

  const resetSearch = () => {
    setKeyword('');
    setDate(undefined);
    setFiltered(transcripts);
    setSearched(false);
  };

  useEffect(() => {
    setFiltered(transcripts);
    setSearched(false);
  }, [transcripts]);

  return {
    keyword,
    setKeyword,
    date,
    setDate,
    filtered,
    searched,
    handleSearch,
    resetSearch,
  };
};
