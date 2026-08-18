'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { ApiError } from '@/lib/api';

export default function LoginPage() {
  const { guestLogin } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGuestLogin() {
    setError(null);
    setIsSubmitting(true);
    try {
      await guestLogin();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-surface-subtle px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <h1 className="text-center text-xl font-semibold text-text-primary">
          Let&apos;s get back on track
        </h1>
        <p className="mt-1 text-center text-sm text-text-secondary">
          Enter your email below to login to your account.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={handleGuestLogin}
            disabled={isSubmitting}
            className="h-11 w-full rounded-lg bg-text-primary text-surface font-medium hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? 'Signing in…' : 'Continue as Guest'}
          </button>
        </div>

        {error && (
          <p role="alert" className="mt-4 text-center text-sm text-priority-urgent">
            {error}
          </p>
        )}
      </div>
    </main>
  );
}