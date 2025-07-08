import { LoadingProvider } from '~/providers/LoadingProvider';
import { MantineProvider } from '~/providers/MantineProvider';
import { StorageProvider } from '~/infrastructure/storage/StorageProvider';
import { ThemeProvider } from 'next-themes';

import { DbProvider } from '~/infrastructure/firestore/DbProvider';
import { AuthProvider } from './AuthProvider';

type Props = {
  children: React.ReactNode;
};

export const Providers = ({ children }: Props): React.ReactNode => {
  return (
    <LoadingProvider>
      <AuthProvider>
        <DbProvider>
          <StorageProvider>{children}</StorageProvider>
        </DbProvider>
      </AuthProvider>
    </LoadingProvider>
  );
};
