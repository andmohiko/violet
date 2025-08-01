'use client';
import { ModeToggle } from '~/components/ui/ModeToggle';
import { Providers } from '~/providers';
import '~/styles/globals.css';
import { useAuthGuard } from '~/hooks/useAuthGuard';
/*
import '~/styles/reset.css';
import '~/styles/variables.css';
*/

import { Header } from '~/components/Layouts/Header';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head />
      <body id="root">
        <div>
          <Providers>
            <Header />
            <div className="flex justify-center items-center w-full">
              <div className="flex flex-col items-center">{children}</div>
            </div>
          </Providers>
        </div>
      </body>
    </html>
  );
}
