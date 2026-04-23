'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/store/userStore';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated } = useUserStore();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/landing');
    }
  }, [isAuthenticated, router]);

  return <>{children}</>;
}
