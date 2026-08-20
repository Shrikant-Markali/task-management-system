'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';

export interface Project {
  id: string;
  name: string;
  priority: string;
  dueDate: string | null;
  createdAt: string;
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const data = await api.get<Project[]>('/projects');
    setProjects(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { projects, isLoading, refresh };
}