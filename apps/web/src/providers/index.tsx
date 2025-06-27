import { LoadingProvider } from '~/providers/LoadingProvider';
import { MantineProvider } from '~/providers/MantineProvider';
import { StorageProvider } from '~/providers/StorageProvider';
import { ThemeProvider } from 'next-themes';

import { DbProvider } from '~/providers/DbProvider';

type Props = {
  children: React.ReactNode;
};

export const Providers = ({ children }: Props): React.ReactNode => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <LoadingProvider>
        <DbProvider>
          <StorageProvider>{children}</StorageProvider>
        </DbProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
};
