import { LoadingProvider } from '~/providers/LoadingProvider';
import { MantineProvider } from '~/providers/MantineProvider';
import { StorageProvider } from '~/providers/StorageProvider';
import { DbProvider } from '~/providers/DbProvider';

type Props = {
  children: React.ReactNode;
};

export const Providers = ({ children }: Props): React.ReactNode => {
  return (
    <MantineProvider>
      <LoadingProvider>
        <DbProvider>
          <StorageProvider>{children}</StorageProvider>
        </DbProvider>
      </LoadingProvider>
    </MantineProvider>
  );
};
