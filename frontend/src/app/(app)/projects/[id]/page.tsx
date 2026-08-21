'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTasks } from '@/hooks/useTasks';
import { TaskBoard } from '@/components/tasks/TaskBoard';
import { TaskDetailPanel } from '@/components/tasks/TaskDetailPanel';

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const projectId = params.id;
  const { tasks, isLoading, refresh } = useTasks(projectId);
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);

  return (
    <div className="flex h-full flex-col">
      <header className="border-b border-border px-4 py-3">
        <Link href="/projects" className="text-xs text-text-muted hover:text-text-secondary">
          ← Projects
        </Link>
        <h1 className="text-lg font-semibold text-text-primary">Project Tasks</h1>
      </header>
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <p className="p-4 text-sm text-text-muted">Loading…</p>
        ) : (
          <TaskBoard
            tasks={tasks}
            onOpenTask={(t) => setOpenTaskId(t.id)}
            onTaskCreated={refresh}
            projectId={projectId}
          />
        )}
      </div>
      <TaskDetailPanel taskId={openTaskId} onClose={() => setOpenTaskId(null)} onChanged={refresh} />
    </div>
  );
}