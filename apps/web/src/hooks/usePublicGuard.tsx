'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '~/providers/AuthProvider';
import { is } from 'date-fns/locale';

export const usePublicGuard = () => {
  const { currentUser, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // ロード完了後にcurrentUserが存在するならリダイレクト
    if (!isLoading && currentUser) {
      router.push('/');
    }
  }, [currentUser, isLoading, router]);

  return { currentUser };
};
