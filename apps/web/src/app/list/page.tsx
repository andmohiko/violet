'use client';
import React, { useEffect, useState } from 'react';
import { useFirestore } from '~/providers/DbProvider';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { storage } from '~/lib/firebase';
import type { Transcript } from '~/types/transcripts';
import Search from '~/components/search';

const ListPage = () => {
  const { getAllDocuments } = useFirestore();
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [filtered, setFiltered] = useState<Transcript[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [audioUrls, setAudioUrls] = useState<{ [id: string]: string }>({});
  const [searched, setSearched] = useState(false);

  const getAudioDownloadUrl = async (path: string) => {
    const fileRef = ref(storage, path);
    return await getDownloadURL(fileRef);
  };

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

  useEffect(() => {
    // transcriptsが変わるたびにURLを取得
    const fetchUrls = async () => {
      const urls: { [id: string]: string } = {};
      for (const t of transcripts) {
        if (t.storagePath) {
          try {
            urls[t.id] = await getAudioDownloadUrl(t.storagePath);
          } catch {
            urls[t.id] = '';
          }
        }
      }
      setAudioUrls(urls);
    };
    fetchUrls();
  }, [transcripts]);

  useEffect(() => {
    if (!searched) setFiltered(transcripts);
  }, [transcripts, searched]);

  return (
    <div>
      <h1>Transcripts検索</h1>
      <Search transcripts={transcripts} onResult={handleSearch} />
      <ul>
        {(searched ? filtered : transcripts).length === 0 ? (
          <p>該当するデータがありません</p>
        ) : (
          (searched ? filtered : transcripts).map((t) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => setOpenId(openId === t.id ? null : t.id)}
              >
                {formatDate(t.createdAt)}
              </button>
              {openId === t.id && (
                <div>
                  <b>文字起こし:</b> {t.text}
                  <br />
                  <b>アップロード者:</b> {t.uploadedBy ?? '-'}
                  <br />
                  <p>音声ファイル:</p>
                  <a
                    href={audioUrls[t.id]}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t.storagePath}
                  </a>
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
