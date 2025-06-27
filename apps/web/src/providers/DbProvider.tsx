'use client';
import { createContext, useContext } from 'react';
import { db } from '~/lib/firebase';
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
  setDoc,
} from 'firebase/firestore';
import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

type FirestoreContextType = {
  addDocument: (col: string, data: Record<string, unknown>) => Promise<string>;
  getDocument: (col: string, id: string) => Promise<DocumentData | undefined>;
  getAllDocuments: (
    col: string,
  ) => Promise<QueryDocumentSnapshot<DocumentData>[]>;
  setDocument: (
    col: string,
    id: string,
    data: Record<string, unknown>,
  ) => Promise<void>;
};

const FirestoreContext = createContext<FirestoreContextType | undefined>(
  undefined,
);

export const DbProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // ドキュメント追加
  const addDocument = async (col: string, data: Record<string, unknown>) => {
    const docRef = await addDoc(collection(db, col), data);
    return docRef.id;
  };

  // ドキュメント取得
  const getDocument = async (col: string, id: string) => {
    const docSnap = await getDoc(doc(db, col, id));
    return docSnap.exists() ? docSnap.data() : undefined;
  };

  // コレクション全件取得
  const getAllDocuments = async (col: string) => {
    const snap = await getDocs(collection(db, col));
    return snap.docs;
  };

  // ドキュメント上書き
  const setDocument = async (
    col: string,
    id: string,
    data: Record<string, unknown>,
  ) => {
    await setDoc(doc(db, col, id), data);
  };

  return (
    <FirestoreContext.Provider
      value={{ addDocument, getDocument, getAllDocuments, setDocument }}
    >
      {children}
    </FirestoreContext.Provider>
  );
};

export const useFirestore = () => {
  const ctx = useContext(FirestoreContext);
  if (!ctx)
    throw new Error('useFirestore must be used within a FirestoreProvider');
  return ctx;
};
