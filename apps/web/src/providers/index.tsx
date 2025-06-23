import { LoadingProvider } from '~/providers/LoadingProvider';
import { MantineProvider } from '~/providers/MantineProvider';
import { StorageProvider } from '~/providers/StorageProvider';

type Props = {
  children: React.ReactNode;
};

export const Providers = ({ children }: Props): React.ReactNode => {
  return (
    <MantineProvider>
      <LoadingProvider>
        <StorageProvider>{children}</StorageProvider>
      </LoadingProvider>
    </MantineProvider>
  );
};
