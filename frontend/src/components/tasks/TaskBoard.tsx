'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { STATUS_COLUMNS } from '@/lib/statusColumns';
import type { Task } from '@/types';

export function TaskBoard({
  tasks,
  onOpenTask,
  onTaskCreated,
  projectId,
}: {
  tasks: Task[];
  onOpenTask: (task: Task) => void;
  onTaskCreated: () => void;
  projectId?: string;
}) {
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState('');

  async function submitDraft(statusKey: string) {
    const title = draftTitle.trim();
    setAddingTo(null);
    setDraftTitle('');
    if (!title) return;
    await api.post('/tasks', { title, status: statusKey, projectId });
    onTaskCreated();
  }

  return (
    <div className="flex h-full gap-4 overflow-x-auto p-4">
      {STATUS_COLUMNS.map((column) => {
        const columnTasks = tasks.filter((t) => column.includesStatuses.includes(t.status));
        return (
          <div key={column.key} className="flex w-72 shrink-0 flex-col rounded-xl bg-surface-subtle">
            <div className="flex items-center justify-between px-3 py-2.5">
              <span className="text-sm font-medium text-text-primary">{column.label}</span>
              <span className="text-xs text-text-muted">{columnTasks.length}</span>
            </div>
            <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-2 pb-2">
              {columnTasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => onOpenTask(task)}
                  className="rounded-xl border border-border bg-surface p-3 text-left text-sm text-text-primary hover:shadow-sm"
                >
                  {task.title}
                  {task.assignee && (
                    <span className="mt-1 block text-xs text-text-muted">👤 {task.assignee.fullName}</span>
                  )}
                </button>
              ))}
            </div>
            <div className="p-2 pt-0">
              {addingTo === column.key ? (
                <input
                  autoFocus
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  onBlur={() => submitDraft(column.key)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') submitDraft(column.key);
                    if (e.key === 'Escape') { setAddingTo(null); setDraftTitle(''); }
                  }}
                  placeholder="Task title…"
                  className="w-full rounded-lg border border-accent bg-surface px-2.5 py-1.5 text-sm outline-none"
                />
              ) : (
                <button
                  onClick={() => setAddingTo(column.key)}
                  className="w-full rounded-lg px-2.5 py-1.5 text-left text-sm text-text-muted hover:bg-surface"
                >
                  + Add Task
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}