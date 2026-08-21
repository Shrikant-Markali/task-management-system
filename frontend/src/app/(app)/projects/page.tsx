'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useProjects } from '@/hooks/useProjects';
import { api } from '@/lib/api';

export default function ProjectsPage() {
  const { projects, isLoading, refresh } = useProjects();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');

  async function submit() {
    const trimmed = name.trim();
    setCreating(false);
    setName('');
    if (!trimmed) return;
    await api.post('/projects', { name: trimmed });
    refresh();
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-text-primary">Projects</h1>
        <button onClick={() => setCreating(true)} className="text-sm text-accent">
          + Add Project
        </button>
      </div>

      {creating && (
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={submit}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Project name…"
          className="mb-3 w-full max-w-sm rounded-lg border border-accent px-2.5 py-1.5 text-sm outline-none"
        />
      )}

      {isLoading ? (
        <p className="text-sm text-text-muted">Loading…</p>
      ) : projects.length === 0 ? (
        <p className="text-sm text-text-muted">No projects yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {projects.map((p) => (
            <li key={p.id}>
              <Link
                href={`/projects/${p.id}`}
                className="block rounded-lg border border-border p-3 text-sm text-text-primary hover:bg-surface-subtle"
              >
                {p.name} — <span className="text-text-secondary">{p.priority}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}