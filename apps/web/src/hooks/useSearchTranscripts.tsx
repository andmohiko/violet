'use client';
import { useState, useEffect } from 'react';
import type { Transcript } from '~/types/transcripts';

export const useSearchTranscripts = (transcripts: Transcript[]) => {
  const [filtered, setFiltered] = useState<Transcript[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = (results: Transcript[]) => {
    setFiltered(results);
    setSearched(true);
  };

  const resetSearch = () => {
    setSearched(false);
    setFiltered(transcripts);
  };

  useEffect(() => {
    if (!searched) setFiltered(transcripts);
  }, [transcripts, searched]);

  return {
    filtered,
    searched,
    handleSearch,
    resetSearch,
  };
};
