import { useCallback } from 'react';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '~/lib/firebase';

export const useAudioDownloadUrl = () => {
  return useCallback(async (path: string) => {
    const fileRef = ref(storage, path);
    return await getDownloadURL(fileRef);
  }, []);
};
