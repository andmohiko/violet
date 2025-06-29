import { useTranscriptDocuments } from '~/hooks/useTranscriptDocuments';
import { useAudioUrls } from '~/hooks/useAudioUrls';

export const useTranscripts = () => {
  const { transcripts, loading } = useTranscriptDocuments();
  const { audioUrls } = useAudioUrls(transcripts);

  return {
    transcripts,
    loading,
    audioUrls,
  };
};
