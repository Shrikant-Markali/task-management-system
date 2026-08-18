'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.replace('/login');
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-surface">
        <p className="text-sm text-text-muted">Loading…</p>
      </div>
    );
  }
  if (!user) return null;

  return (
    <div className="flex flex-1 overflow-hidden">
      <aside className="flex w-56 shrink-0 flex-col justify-between border-r border-border bg-surface-subtle p-4">
        <div>
          <p className="mb-4 text-sm font-semibold text-text-primary">{user.fullName}</p>
          <a href="/tasks" className="block rounded-lg px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface">
            Tasks
          </a>
        </div>
        <button onClick={logout} className="text-left text-sm text-priority-urgent">
          Log out
        </button>
      </aside>
      <div className="flex-1 overflow-y-auto bg-surface">{children}</div>
    </div>
  );
}