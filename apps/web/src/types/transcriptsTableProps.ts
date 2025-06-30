import type { Transcript } from '~/types/transcripts';

export type TranscriptTableProps = {
  transcripts: Transcript[];
  audioUrls: { [id: string]: string };
  onRowClick: (transcript: Transcript) => void;
};
