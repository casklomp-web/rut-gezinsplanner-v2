'use client';

import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/store/userStore';
import { useWeekStore } from '@/lib/store/weekStore';
import { CalendarDays, CheckSquare, ShoppingCart, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';
import { AuthGuard } from '@/components/auth/AuthGuard';

function HomePageContent() {
  const router = useRouter();
  const { currentUser, isAuthenticated } = useUserStore();
  const { currentWeek, generateNewWeek, getToday } = useWeekStore();

  const today = getToday();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/landing');
      return;
    }

    // Generate week if needed
    if (!currentWeek) {
      generateNewWeek();
    }
  }, [isAuthenticated, currentWeek, generateNewWeek, router]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#4A90A4]">Laden...</div>
      </div>
    );
  }

  const todayDate = new Date();
  const tomorrowDate = new Date(todayDate);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);

  return (
    <div className="px-4 py-6 w-full">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-[#2D3436]">
          Welkom, {currentUser.name}
        </h1>
        <p className="text-gray-500">
          {format(todayDate, "EEEE d MMMM", { locale: nl })}
        </p>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Link
          href="/today"
          className="bg-white rounded-xl p-4 border border-gray-200 hover:border-[#4A90A4] transition-colors"
        >
          <div className="flex items-center gap-2 text-[#4A90A4] mb-2">
            <CalendarDays className="w-5 h-5" />
            <span className="text-sm font-medium">Vandaag</span>
          </div>
          <p className="text-2xl font-bold text-[#2D3436]">
            {today ? 3 : 0}
          </p>
          <p className="text-xs text-gray-500">maaltijden gepland</p>
        </Link>

        <Link
          href="/tasks"
          className="bg-white rounded-xl p-4 border border-gray-200 hover:border-[#4A90A4] transition-colors"
        >
          <div className="flex items-center gap-2 text-[#4A90A4] mb-2">
            <CheckSquare className="w-5 h-5" />
            <span className="text-sm font-medium">Taken</span>
          </div>
          <p className="text-2xl font-bold text-[#2D3436]">0</p>
          <p className="text-xs text-gray-500">openstaand</p>
        </Link>
      </div>

      {/* Week Preview */}
      {currentWeek && (
        <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-[#2D3436]">
                Week {currentWeek.weekNumber}
              </h2>
              <p className="text-sm text-gray-500">
                {format(parseISO(currentWeek.startDate), "d MMM", { locale: nl })} - {format(parseISO(currentWeek.endDate), "d MMM", { locale: nl })}
              </p>
            </div>
            <Link
              href="/week"
              className="text-[#4A90A4] hover:text-[#3a7a8c] text-sm font-medium flex items-center"
            >
              Bekijk
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* Today and Tomorrow Preview */}
          <div className="space-y-2">
            {currentWeek.days
              .filter(day => {
                const dayDate = new Date(day.date);
                return dayDate >= todayDate && dayDate <= tomorrowDate;
              })
              .slice(0, 2)
              .map(day => (
                <div
                  key={day.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <span className="text-sm text-gray-600">
                    {format(parseISO(day.date), "EEEE", { locale: nl })}
                  </span>
                  <span className="text-sm text-gray-800 truncate max-w-[200px]">
                    {day.meals.dinner.mealName}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="space-y-3">
        <h2 className="font-semibold text-[#2D3436] mb-3">Snelle acties</h2>

        <Link
          href="/week"
          className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-[#4A90A4] transition-colors"
        >
          <div className="w-10 h-10 bg-[#4A90A4]/10 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#4A90A4]" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-[#2D3436]">Nieuwe week genereren</p>
            <p className="text-sm text-gray-500">Plan je maaltijden voor volgende week</p>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400" />
        </Link>

        <Link
          href="/shopping"
          className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-[#4A90A4] transition-colors"
        >
          <div className="w-10 h-10 bg-[#4A90A4]/10 rounded-lg flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-[#4A90A4]" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-[#2D3436]">Boodschappenlijst</p>
            <p className="text-sm text-gray-500">Bekijk wat je nodig hebt</p>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400" />
        </Link>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <AuthGuard>
      <Suspense fallback={<div className="px-4 py-6 w-full">Laden...</div>}>
        <HomePageContent />
      </Suspense>
    </AuthGuard>
  );
}
