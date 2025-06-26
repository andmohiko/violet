import { Providers } from '~/providers';
import '~/styles/globals.css';
import '~/styles/reset.css';
import '~/styles/variables.css';

export const metadata = {
  title: 'Firebase Monorepo',
  description: 'Firebase Monorepo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head />
      <body id="root">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
