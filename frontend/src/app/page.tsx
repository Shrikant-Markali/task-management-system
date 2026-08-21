'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    router.replace(user ? '/tasks' : '/login');
  }, [isLoading, user, router]);

  return (
    <main className="flex flex-1 items-center justify-center bg-surface">
      <p className="text-sm text-text-muted">Loading…</p>
    </main>
  );
}