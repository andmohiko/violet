import { useAudioDownloadUrl } from '~/hooks/useAudioDownloadUrl';
import { useFirestore } from '~/infrastructure/firestore/DbProvider';
import { Timestamp } from 'firebase/firestore';
import { Content } from '@radix-ui/react-dropdown-menu';

export const useSaveUrlToFirestore = () => {
  const { addDocument } = useFirestore();

  // FirestoreにstorageのURLを保存する関数
  const saveUrl = async (
    filePath: string,
    userId: string,
    contentType: string,
    url: string,
  ) => {
    const createdAt = Timestamp.now();
    try {
      await addDocument('audios', {
        storagePath: filePath,
        createdAt: createdAt,
        userId: userId,
        contentType: contentType,
      });
      return filePath;
    } catch (error) {
      console.error('Firestoreへの保存に失敗しました:', error);
      throw error;
    }
  };

  return { saveUrl };
};
