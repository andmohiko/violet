import React, { useEffect, useState } from 'react';
import { useFirestore } from '~/providers/DbProvider';
import Search from '~/components/search';

type Transcript = {
  id: string;
  audioUrl: string;
  text: string;
  timeCreated?: any;
  uploadedBy?: string;
};

const ListPage = () => {
  const { getAllDocuments } = useFirestore();
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [filtered, setFiltered] = useState<Transcript[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

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

  const handleSearch = (results: Transcript[]) => {
    setFiltered(results);
    setSearched(true);
    setOpenId(null);
  };

  const formatDate = (date: any) => {
    if (!date) return '-';
    // Firestore Timestamp型の場合
    if (date.toDate) return date.toDate().toLocaleString();
    // ISO文字列や数値の場合
    return new Date(date).toLocaleString();
  };

  useEffect(() => {
    setFiltered(transcripts);
  }, [transcripts]);

  return (
    <div>
      <h1>Transcripts検索</h1>
      <Search transcripts={transcripts} onResult={handleSearch} />
      <ul>
        {(searched ? filtered : transcripts).length === 0 ? (
          <p>該当するデータがありません。</p>
        ) : (
          (searched ? filtered : transcripts).map((t) => (
            <li key={t.id}>
              <button onClick={() => setOpenId(openId === t.id ? null : t.id)}>
                {t.timeCreated}
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
          ))
        )}
      </ul>
    </div>
  );
};

export default ListPage;
