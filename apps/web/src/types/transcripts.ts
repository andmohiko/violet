import type { Timestamp } from 'firebase/firestore';

export type Transcript = {
  id: string;
  storagePath?: string;
  text: string;
  createdAt?: Timestamp | Date | string | undefined;
  uploadedBy?: string;
};
