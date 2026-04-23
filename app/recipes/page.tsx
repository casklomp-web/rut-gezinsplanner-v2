'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/store/userStore';

export default function RecipesRedirect() {
  const router = useRouter();
  const { isAuthenticated } = useUserStore();

  useEffect(() => {
    // Recipes hidden in MVP - redirect to week
    if (isAuthenticated()) {
      router.push('/week');
    } else {
      router.push('/landing');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-[#4A90A4]">Laden...</div>
    </div>
  );
}
