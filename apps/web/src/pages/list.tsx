import React, { useEffect, useState } from 'react';
import { useFirestore } from '~/providers/DbProvider';

type Transcript = {
  id: string;
  audioUrl: string;
  text: string;
  createdAt?: any;
  uploadedBy?: string;
};

const ListPage = () => {
  const { getAllDocuments } = useFirestore();
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTranscripts = async () => {
      setLoading(true);
      const docs = await getAllDocuments('transcripts');
      const data = docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Transcript[];
      setTranscripts(data);
      setLoading(false);
    };
    fetchTranscripts();
  }, [getAllDocuments]);

  const formatDate = (date: any) => {
    if (!date) return '-';

    return new Date(date).toLocaleString();
  };

  return (
    <div>
      <h1>Transcripts一覧</h1>
      {loading ? (
        <p>読み込み中...</p>
      ) : (
        <ul>
          {transcripts.map((t) => (
            <li key={t.id}>
              <button onClick={() => setOpenId(openId === t.id ? null : t.id)}>
                {formatDate(t.createdAt)}
              </button>
              {openId === t.id && (
                <div style={{ marginTop: 8, marginBottom: 8 }}>
                  <b>音声URL:</b> {t.audioUrl}
                  <br />
                  <b>文字起こし:</b> {t.text}
                  <br />
                  <b>アップロード者:</b> {t.uploadedBy ?? '-'}
                </div>
              )}
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListPage;
