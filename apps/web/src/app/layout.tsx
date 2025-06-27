import { ModeToggle } from '~/components/modeToggle';
import { Providers } from '~/providers';
import '~/styles/globals.css';
import '~/styles/reset.css';
import '~/styles/variables.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head />
      <body id="root">
        <Providers>
          <ModeToggle />
          {children}
        </Providers>
      </body>
    </html>
  );
}
