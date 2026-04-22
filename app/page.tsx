'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWeekStore } from '@/lib/store/weekStore';
import { Button } from '@/components/ui/Button';
import { CalendarDays, ChefHat, ShoppingCart, Users } from 'lucide-react';
import { trackEvent, AnalyticsEvents } from '@/components/providers/FeatureProvider';

export default function HomePage() {
  const router = useRouter();
  const { currentWeek, generateNewWeek, isLoading } = useWeekStore();

  // If week exists, redirect to week view
  useEffect(() => {
    if (currentWeek && !isLoading) {
      router.push('/week');
    }
  }, [currentWeek, isLoading, router]);

  const handleStart = () => {
    trackEvent(AnalyticsEvents.WEEK_GENERATED, { source: 'landing_page' });
    generateNewWeek();
  };

  // Show loading while checking
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[#4A90A4]">Laden...</div>
      </div>
    );
  }

  // If week exists, we're redirecting (show nothing)
  if (currentWeek) {
    return null;
  }

  // Landing page for new users
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4A90A4]/5 to-white">
      <div className="max-w-md mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#4A90A4] mb-2">Rut</h1>
          <p className="text-lg text-gray-600">Gezinsplanner</p>
          <p className="text-sm text-gray-400 mt-2">Eenvoudig gezond eten plannen</p>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-12">
          <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-[#4A90A4]/10 rounded-full flex items-center justify-center">
              <CalendarDays className="w-6 h-6 text-[#4A90A4]" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Weekplanning</h3>
              <p className="text-sm text-gray-500">Plan je maaltijden per week</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-[#7CB342]/10 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-[#7CB342]" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Boodschappen</h3>
              <p className="text-sm text-gray-500">Automatische boodschappenlijst</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-[#E17055]/10 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-[#E17055]" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Voor het hele gezin</h3>
              <p className="text-sm text-gray-500">Rekening houdend met ieders voorkeuren</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button 
            onClick={handleStart}
            className="w-full py-4 text-lg"
            disabled={isLoading}
          >
            <ChefHat className="w-5 h-5 mr-2" />
            Start met Rut
          </Button>
          <p className="text-xs text-gray-400 mt-4">
            Genereer automatisch je eerste weekplanning
          </p>
        </div>
      </div>
    </div>
  );
}
