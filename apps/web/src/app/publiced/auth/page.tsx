'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '~/providers/AuthProvider';
import { Button } from '~/components/ui/button';
import { usePublicGuard } from '~/hooks/usePublicGuard';

const AuthPage = () => {
  // 認証ガードを適用(ログイン済みのユーザーには表示させない)
  usePublicGuard();

  const { currentUser, error, signin, signup, logout, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  // ログイン成功時にリダイレクト
  useEffect(() => {
    if (currentUser) {
      router.push('/');
    }
  }, [currentUser, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      if (isLogin) {
        await signin(email, password);
      } else {
        await signup(email, password);
      }
    } catch {
      // エラーはAuthProviderで管理
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-2xl font-bold mb-4">
        {isLogin ? 'ログイン' : '新規登録'}
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />
        {error && <p className="text-red-500">{error}</p>}
        <Button type="submit">{isLogin ? 'ログイン' : '新規登録'}</Button>
      </form>
      <Button
        type="button"
        variant="outline"
        className="mt-4 px-4 py-2"
        onClick={() => {
          setIsLogin(!isLogin);
          clearError();
        }}
      >
        {isLogin ? '新規登録はこちら' : 'ログインはこちら'}
      </Button>
    </div>
  );
};

export default AuthPage;
