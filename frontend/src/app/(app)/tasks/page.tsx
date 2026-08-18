'use client';

import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { TaskBoard } from '@/components/tasks/TaskBoard';
import { TaskDetailPanel } from '@/components/tasks/TaskDetailPanel';

export default function TasksPage() {
  const { tasks, isLoading, refresh } = useTasks();
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);

  return (
    <div className="flex h-full flex-col">
      <header className="border-b border-border px-4 py-3">
        <h1 className="text-lg font-semibold text-text-primary">Tasks</h1>
      </header>
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <p className="p-4 text-sm text-text-muted">Loading…</p>
        ) : (
          <TaskBoard tasks={tasks} onOpenTask={(t) => setOpenTaskId(t.id)} onTaskCreated={refresh} />
        )}
      </div>
      <TaskDetailPanel taskId={openTaskId} onClose={() => setOpenTaskId(null)} onChanged={refresh} />
    </div>
  );
}