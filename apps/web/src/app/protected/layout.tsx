'use client';
import { useAuthGuard } from '~/hooks/useAuthGuard';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // useAuthGuardを使って、ログインしていなかったら("/publiced/login")にリダイレクト
  const { currentUser, isLoading } = useAuthGuard();

  if (isLoading) return <div>Loading...</div>;
  if (!currentUser) return null;

  return <>{children}</>;
}
