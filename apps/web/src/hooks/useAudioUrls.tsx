import { useState, useEffect, useCallback } from 'react';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '~/lib/firebase';
import type { Transcript } from '~/types/transcripts';

// カスタムフック: transcriptsのstoragePathから音声ファイルのダウンロードURLを取得する

export const useAudioUrls = (transcripts: Transcript[]) => {
  const [audioUrls, setAudioUrls] = useState<{ [id: string]: string }>({});

  const getAudioDownloadUrl = useCallback(async (path: string) => {
    const fileRef = ref(storage, path);
    return await getDownloadURL(fileRef);
  }, []);

  useEffect(() => {
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
  }, [transcripts, getAudioDownloadUrl]);

  return {
    audioUrls,
  };
};
