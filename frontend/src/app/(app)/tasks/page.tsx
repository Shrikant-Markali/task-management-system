'use client';

import { useTasks } from '@/hooks/useTasks';

export default function TasksPage() {
  const { tasks, isLoading } = useTasks();

  return (
    <div className="p-6">
      <h1 className="mb-4 text-lg font-semibold text-text-primary">Tasks</h1>
      {isLoading ? (
        <p className="text-sm text-text-muted">Loading…</p>
      ) : tasks.length === 0 ? (
        <p className="text-sm text-text-muted">No tasks yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {tasks.map((t) => (
            <li key={t.id} className="rounded-lg border border-border p-3 text-sm text-text-primary">
              {t.title} — <span className="text-text-secondary">{t.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}