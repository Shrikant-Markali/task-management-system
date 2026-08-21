'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { Task } from '@/types';

export function useTasks(projectId?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const query = projectId ? `?projectId=${projectId}` : '';
    const data = await api.get<Task[]>(`/tasks${query}`);
    setTasks(data);
    setIsLoading(false);
  }, [projectId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { tasks, isLoading, refresh };
}