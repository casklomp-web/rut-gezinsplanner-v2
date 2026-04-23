'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/store/userStore';

export default function HomePage() {
  const router = useRouter();
  const { users } = useUserStore();

  useEffect(() => {
    // Check if user needs to authenticate
    const hasCompletedOnboarding = localStorage.getItem('rut-onboarding-completed');
    const hasUsers = users.length > 0;
    
    console.log('Home check:', { hasCompletedOnboarding, hasUsers, users });
    
    if (!hasCompletedOnboarding && !hasUsers) {
      console.log('No auth, redirecting to /auth');
      router.push('/auth');
    } else {
      console.log('Authenticated, redirecting to /today');
      router.push('/today');
    }
  }, [users, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-[#4A90A4]">Laden...</div>
    </div>
  );
}
