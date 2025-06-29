import { useState, useEffect } from 'react';
import { useFirestore } from '~/infrastructure/firestore/DbProvider';
import type { Transcript } from '~/types/transcripts';

// firestoreからtranscriptsコレクションの全ドキュメントを取得するカスタムフック
export const useTranscriptDocuments = () => {
  const { getAllDocuments } = useFirestore();
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTranscripts = async () => {
      try {
        setLoading(true);
        setError(null);
        const docs = await getAllDocuments('transcripts');
        const data = docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Transcript[];
        setTranscripts(data);
      } catch (err) {
        setError('データの取得に失敗しました');
        console.error('Error fetching transcripts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTranscripts();
  }, [getAllDocuments]);

  return {
    transcripts,
    loading,
    error,
  };
};
