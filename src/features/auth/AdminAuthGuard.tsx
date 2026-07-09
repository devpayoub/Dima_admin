'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('STAMPEE_ADMIN_TOKEN');
    const refreshToken = localStorage.getItem('STAMPEE_ADMIN_REFRESH_TOKEN');

    if (!token) {
      document.cookie = 'STAMPEE_ADMIN_TOKEN=; path=/; max-age=0';
      document.cookie = 'STAMPEE_ADMIN_REFRESH_TOKEN=; path=/; max-age=0';
      router.push('/');
      setIsLoading(false);
      return;
    }

    if (refreshToken) {
      supabase.auth.setSession({ access_token: token, refresh_token: refreshToken }).then(() => {
        setIsAuthenticated(true);
        setIsLoading(false);
      }).catch(() => {
        localStorage.removeItem('STAMPEE_ADMIN_TOKEN');
        localStorage.removeItem('STAMPEE_ADMIN_REFRESH_TOKEN');
        document.cookie = 'STAMPEE_ADMIN_TOKEN=; path=/; max-age=0';
        document.cookie = 'STAMPEE_ADMIN_REFRESH_TOKEN=; path=/; max-age=0';
        router.push('/');
        setIsLoading(false);
      });
    } else {
      setIsAuthenticated(true);
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background">Verifying session...</div>;
  }

  return isAuthenticated ? <>{children}</> : null;
}
