import { initializeApp, getApps, deleteApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  serverTimestamp as getServerTimeStamp,
  getFirestore,
  connectFirestoreEmulator,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getRemoteConfig } from 'firebase/remote-config';
import type { RemoteConfig } from 'firebase/remote-config';

const firebaseConfig = {
  apiKey: 'AIzaSyCUazqvyLsZ10MNj20KG-fuN5BDwPIB5k8',
  authDomain: 'transcription-f3e8a.firebaseapp.com',
  projectId: 'transcription-f3e8a',
  storageBucket: 'transcription-f3e8a.firebasestorage.app',
  messagingSenderId: '1011547825776',
  appId: '1:1011547825776:web:1398aeb67cc711ab54b6b5',
};

if (getApps().length > 0) {
  await deleteApp(getApps()[0]);
}

const app = initializeApp({ ...firebaseConfig });

const auth = getAuth(app);
auth.languageCode = 'ja';

const db = getFirestore(app);
const serverTimestamp = getServerTimeStamp();

const storage = getStorage(app);

let remoteConfig: RemoteConfig | null = null;
if (typeof window !== 'undefined') {
  remoteConfig = getRemoteConfig();
  remoteConfig.settings.minimumFetchIntervalMillis = 60 * 1000; // 1min
}

if (process.env.NEXT_PUBLIC_USE_EMULATOR === 'true') {
  connectFirestoreEmulator(db, 'localhost', 8080);
}

export { auth, db, serverTimestamp, storage };
