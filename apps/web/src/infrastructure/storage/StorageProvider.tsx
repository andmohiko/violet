'use client';
import type React from 'react';
import { createContext, useContext } from 'react';
import { storage } from '~/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

type StorageContextType = {
  uploadFile: (
    path: string,
    file: File,
    customMetadata?: Record<string, string>,
  ) => Promise<{ url: string; fileName: string }>;
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
      customMetadata: customMetadata ?? {}, // userIdをメタデータとして渡す
      fileName: file.name, // ファイル名をメタデータとして渡す
    };
    await uploadBytes(fileRef, file, metadata);
    const url = await getDownloadURL(fileRef);
    return { url, fileName: file.name };
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
