'use client';

import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { TaskBoard } from '@/components/tasks/TaskBoard';
import type { Task } from '@/types';

export default function TasksPage() {
  const { tasks, isLoading, refresh } = useTasks();
  const [openTask, setOpenTask] = useState<Task | null>(null);

  return (
    <div className="flex h-full flex-col">
      <header className="border-b border-border px-4 py-3">
        <h1 className="text-lg font-semibold text-text-primary">Tasks</h1>
      </header>
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <p className="p-4 text-sm text-text-muted">Loading…</p>
        ) : (
          <TaskBoard tasks={tasks} onOpenTask={setOpenTask} onTaskCreated={refresh} />
        )}
      </div>
      {openTask && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/30" onClick={() => setOpenTask(null)}>
          <div onClick={(e) => e.stopPropagation()} className="h-full w-full max-w-md bg-surface p-6">
            <p className="text-lg font-semibold text-text-primary">{openTask.title}</p>
            <p className="mt-2 text-sm text-text-secondary">Status: {openTask.status}</p>
            <button onClick={() => setOpenTask(null)} className="mt-4 text-sm text-accent">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}