import { useFetchTranscripts } from '~/hooks/useFetchTranscripts';
import { useTranscriptAudioUrls } from '~/hooks/useTranscriptAudioUrls';

export const useTranscripts = () => {
  const { transcripts, loading, error } = useFetchTranscripts();
  const { audioUrls } = useTranscriptAudioUrls(transcripts);

  return {
    transcripts,
    loading,
    error,
    audioUrls,
  };
};
