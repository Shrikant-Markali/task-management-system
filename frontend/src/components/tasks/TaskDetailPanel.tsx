'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { useUsers } from '@/hooks/useUsers';
import { useProjects } from '@/hooks/useProjects';
import type { Task, TaskStatus, Priority } from '@/types';

const STATUSES: TaskStatus[] = ['BACKLOG', 'TODO', 'DOING', 'COMPLETED', 'ONHOLD'];
const PRIORITIES: Priority[] = ['NONE', 'URGENT', 'HIGH', 'MEDIUM', 'LOW'];

export function TaskDetailPanel({
  taskId,
  onClose,
  onChanged,
}: {
  taskId: string | null;
  onClose: () => void;
  onChanged: () => void;
}) {
  const [task, setTask] = useState<Task | null>(null);
  const [description, setDescription] = useState('');
  const { users } = useUsers();
  const { projects } = useProjects();

  const load = useCallback(async () => {
    if (!taskId) return;
    const data = await api.get<Task>(`/tasks/${taskId}`);
    setTask(data);
    setDescription(data.description ?? '');
  }, [taskId]);

  useEffect(() => {
    load();
  }, [load]);

  async function patch(body: Record<string, unknown>) {
    if (!task) return;
    await api.patch(`/tasks/${task.id}`, body);
    await load();
    onChanged();
  }

  if (!taskId || !task) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/30" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="h-full w-full max-w-lg overflow-y-auto bg-surface p-6">
        <button onClick={onClose} className="mb-4 text-sm text-text-muted">
          ← Close
        </button>

        <input
          defaultValue={task.title}
          onBlur={(e) => e.target.value.trim() && e.target.value !== task.title && patch({ title: e.target.value.trim() })}
          className="w-full border-none bg-transparent text-xl font-semibold text-text-primary outline-none"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => description !== (task.description ?? '') && patch({ description })}
          placeholder="Add a description…"
          rows={3}
          className="mt-2 w-full resize-none border-none bg-transparent text-sm text-text-secondary outline-none"
        />

        <div className="mt-6 flex flex-col gap-3 rounded-xl border border-border p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted">Status</span>
            <select
              value={task.status}
              onChange={(e) => patch({ status: e.target.value })}
              className="rounded-md bg-surface-subtle px-2 py-1 text-sm"
            >
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted">Priority</span>
            <select
              value={task.priority}
              onChange={(e) => patch({ priority: e.target.value })}
              className="rounded-md bg-surface-subtle px-2 py-1 text-sm"
            >
              {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted">Assignee</span>
            <select
              value={task.assigneeId ?? ''}
              onChange={(e) => patch({ assigneeId: e.target.value || undefined })}
              className="rounded-md bg-surface-subtle px-2 py-1 text-sm"
            >
              <option value="">Unassigned</option>
              {users.map((u) => <option key={u.id} value={u.id}>{u.fullName}</option>)}
            </select>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted">Project</span>
            <select
              value={task.projectId ?? ''}
              onChange={(e) => patch({ projectId: e.target.value || undefined })}
              className="rounded-md bg-surface-subtle px-2 py-1 text-sm"
            >
              <option value="">No project</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}