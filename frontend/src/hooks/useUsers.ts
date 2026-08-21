'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { User } from '@/types';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    api.get<User[]>('/users').then(setUsers);
  }, []);

  return { users };
}