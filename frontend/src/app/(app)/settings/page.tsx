'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import { useTheme, ACCENT_COLORS } from '@/components/theme/ThemeProvider';
import { api } from '@/lib/api';
import type { AccentColor, ThemeMode } from '@/components/theme/ThemeProvider';

export default function SettingsPage() {
  const { user } = useAuth();
  const { mode, accent, setMode, setAccent } = useTheme();

  async function selectMode(next: ThemeMode) {
    setMode(next);
    await api.patch('/users/me', { themeMode: next });
  }

  async function selectAccent(next: AccentColor) {
    setAccent(next);
    await api.patch('/users/me', { accentColor: next });
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-lg p-6">
      <h1 className="mb-6 text-lg font-semibold text-text-primary">Settings</h1>

      <p className="mb-1 text-sm text-text-secondary">Signed in as</p>
      <p className="mb-6 text-sm font-medium text-text-primary">{user.fullName}</p>

      <p className="mb-2 text-sm font-medium text-text-primary">Theme</p>
      <div className="mb-6 flex gap-2">
        {(['LIGHT', 'DARK'] as const).map((m) => (
          <button
            key={m}
            onClick={() => selectMode(m)}
            className={`rounded-lg border px-4 py-2 text-sm ${mode === m ? 'border-accent text-accent' : 'border-border text-text-secondary'}`}
          >
            {m}
          </button>
        ))}
      </div>

      <p className="mb-2 text-sm font-medium text-text-primary">Color</p>
      <div className="flex flex-wrap gap-2">
        {ACCENT_COLORS.map((c) => (
          <button
            key={c}
            onClick={() => selectAccent(c)}
            className={`rounded-lg border px-3 py-1.5 text-xs ${accent === c ? 'border-accent text-accent' : 'border-border text-text-secondary'}`}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}