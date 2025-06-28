'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '~/providers/AuthProvider';

export default function PublicOnlyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && currentUser) {
      // ログインしていたら / に強制リダイレクト
      router.push('/');
    }
  }, [currentUser, isLoading, router]);

  if (isLoading) return <div>Loading...</div>;
  if (currentUser) return null;

  return <>{children}</>;
}
