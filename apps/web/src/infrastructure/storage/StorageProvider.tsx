'use client';
import type React from 'react';
import { createContext, useContext } from 'react';
import { storage } from '~/lib/firebase';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  getMetadata,
} from 'firebase/storage';

type StorageContextType = {
  uploadFile: (
    path: string,
    file: File,
    customMetadata?: Record<string, string>,
  ) => Promise<{
    url: string;
    filePath: string;
    userId: string;
    contentType: string;
  }>;
};

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export const StorageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // ファイルアップロード関数
  const uploadFile = async (
    path: string,
    file: File,
    customMetadata?: Record<string, string>,
  ) => {
    const fileRef = ref(storage, path);

    const metadata = {
      customMetadata: {
        ...customMetadata,
        userId: customMetadata?.uploadedBy ?? '',
        fileName: file.name,
      },
      contentType: file.type || 'application/octet-stream', // コンテンツタイプを設定
    };

    await uploadBytes(fileRef, file, metadata);

    const uploadedMetadata = await getMetadata(fileRef);
    const url = await getDownloadURL(fileRef);

    const fileName = uploadedMetadata.customMetadata?.filePath ?? '';
    const userId = uploadedMetadata.customMetadata?.uploadedBy ?? '';
    const contentType =
      uploadedMetadata.contentType || 'application/octet-stream';

    return {
      url: url,
      filePath: fileRef.fullPath,
      userId: userId,
      contentType: contentType,
    };
  };

  return (
    <StorageContext.Provider value={{ uploadFile }}>
      {children}
    </StorageContext.Provider>
  );
};

export const useStorage = () => {
  const ctx = useContext(StorageContext);
  if (!ctx) throw new Error('useStorage must be used within a StorageProvider');
  return ctx;
};
