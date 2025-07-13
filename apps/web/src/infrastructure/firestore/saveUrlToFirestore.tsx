import { useAudioDownloadUrl } from '~/hooks/useAudioDownloadUrl';
import { useFirestore } from '~/infrastructure/firestore/DbProvider';
import { Timestamp } from 'firebase/firestore';

export const useSaveUrlToFirestore = () => {
  const { addDocument } = useFirestore();

  // FirestoreにstorageのURLを保存する関数
  const saveUrl = async (fileName: string) => {
    const createdAt = Timestamp.now();
    try {
      await addDocument('audios', {
        storagePath: fileName,
        createdAt: createdAt,
      });
      return fileName;
    } catch (error) {
      console.error('Firestoreへの保存に失敗しました:', error);
      throw error;
    }
  };

  return { saveUrl };
};
