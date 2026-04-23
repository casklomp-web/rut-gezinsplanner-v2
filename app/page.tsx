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

  // Landing page
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4A90A4]/10 via-[#4A90A4]/5 to-white">
      <div className="max-w-md mx-auto px-6 py-12 lg:max-w-2xl">
        {/* Header with animation */}
        <div className="text-center mb-12 pt-8">
          <div className="w-20 h-20 bg-[#4A90A4] rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg animate-bounce-in">
            <ChefHat className="w-10 h-10 text-white animate-pulse-slow" />
          </div>
          <h1 className="text-5xl font-bold text-[#4A90A4] mb-3 animate-fade-in">Rut</h1>
          <p className="text-xl text-gray-600 mb-2 animate-fade-in-delay">Gezinsplanner</p>
          <p className="text-gray-400 animate-fade-in-delay-2">Eenvoudig gezond eten plannen voor het hele gezin</p>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-12">
          <div className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-[#4A90A4]/10 rounded-xl flex items-center justify-center">
              <CalendarDays className="w-7 h-7 text-[#4A90A4]" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg">Weekplanning</h3>
              <p className="text-sm text-gray-500">Plan je maaltijden per week met gebalanceerde voeding</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-[#7CB342]/10 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-7 h-7 text-[#7CB342]" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg">Boodschappen</h3>
              <p className="text-sm text-gray-500">Automatische boodschappenlijst op basis van je planning</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-[#E17055]/10 rounded-xl flex items-center justify-center">
              <Users className="w-7 h-7 text-[#E17055]" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg">Voor het hele gezin</h3>
              <p className="text-sm text-gray-500">Rekening houdend met ieders voorkeuren en dieetwensen</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pb-8">
          <Button 
            onClick={handleStart}
            className="w-full py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            disabled={isLoading}
          >
            {currentWeek ? 'Ga naar mijn planning' : 'Start met Rut'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-xs text-gray-400 mt-4">
            {currentWeek 
              ? 'Je hebt al een weekplanning'
              : 'Genereer automatisch je eerste weekplanning'
            }
          </p>
        </div>
      </div>
    </div>
  );
}
