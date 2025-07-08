'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthGuard } from '~/hooks/useAuthGuard';

const IndexPage = () => {
  const { currentUser, isLoading } = useAuthGuard();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    // ログイン済みならprotected/listへリダイレクト
    if (currentUser) {
      router.replace('/protected/list');
    }
    // 未ログイン時はuseAuthGuard内で/publiced/authへリダイレクト
  }, [currentUser, isLoading, router]);

  // ローディング中は何も表示しない
  return null;
};

export default IndexPage;
