'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '~/providers/AuthProvider';
import { useToast } from '~/hooks/useToast';
import { is } from 'date-fns/locale';

export const useAuthGuard = () => {
  const { currentUser, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // ロード完了後にcurrentUserがnullなら未ログインとみなす
    if (!isLoading && currentUser === null) {
      router.push('/publiced/auth');
    }
  }, [currentUser, isLoading, router]);

  return { currentUser, isLoading };
};
