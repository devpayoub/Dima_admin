'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ErrorBanner } from '@/components/ui/ErrorBanner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const manualToken = localStorage.getItem('STAMPEE_ADMIN_TOKEN');
    if (manualToken) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { session } = await apiClient.post<any>('/auth/login', { email, password });
      
      localStorage.removeItem('STAMPEE_ADMIN_TOKEN');
      localStorage.removeItem('STAMPEE_ADMIN_REFRESH_TOKEN');
      Object.keys(localStorage)
        .filter(k => k.startsWith('sb-') && k.endsWith('-auth-token'))
        .forEach(k => localStorage.removeItem(k));

      localStorage.setItem('STAMPEE_ADMIN_TOKEN', session.access_token);
      localStorage.setItem('STAMPEE_ADMIN_REFRESH_TOKEN', session.refresh_token);

      document.cookie = `STAMPEE_ADMIN_TOKEN=${session.access_token}; path=/; SameSite=Lax; max-age=86400`;
      document.cookie = `STAMPEE_ADMIN_REFRESH_TOKEN=${session.refresh_token}; path=/; SameSite=Lax; max-age=86400`;

      supabase.auth.setSession({ access_token: session.access_token, refresh_token: session.refresh_token }).catch(() => {});

      router.push('/dashboard');

    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="bg-card w-full max-w-md rounded-2xl shadow-sm border border-border p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">Stampee Admin</h1>
          <p className="text-muted mt-2 text-sm">Superuser login</p>
        </div>

        {error && <ErrorBanner message={error} />}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Logging in...' : 'Log in as Admin'}
          </Button>
        </form>
      </div>
    </div>
  );
}
