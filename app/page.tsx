'use client';

import { useEffect, useState } from "react";
import { useWeekStore } from "@/lib/store/weekStore";
import { DayView } from "@/components/today/DayView";
import { DayViewSkeleton } from "@/components/ui/Skeleton";
import { format, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import { CalendarDays, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { EmptyState } from "@/components/ui/ErrorBoundary";

export default function TodayPage() {
  const { currentWeek, generateNewWeek, getToday } = useWeekStore();
  const today = getToday();
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem('rut-onboarding-completed');
    if (!hasSeenOnboarding && !currentWeek) {
      setShowOnboarding(true);
    }
    
    // Generate week if needed
    if (!currentWeek) {
      generateNewWeek();
    }
    
    setIsLoading(false);
  }, [currentWeek, generateNewWeek]);
  
  const handleOnboardingComplete = () => {
    localStorage.setItem('rut-onboarding-completed', 'true');
    setShowOnboarding(false);
    generateNewWeek();
  };
  
  const handleOnboardingSkip = () => {
    localStorage.setItem('rut-onboarding-completed', 'true');
    setShowOnboarding(false);
  };
  
  if (showOnboarding) {
    return (
      <OnboardingFlow 
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
    );
  }
  
  if (isLoading) {
    return (
      <div className="px-4 py-6 max-w-md mx-auto">
        <DayViewSkeleton />
      </div>
    );
  }
  
  if (!today) {
    return (
      <div className="px-4 py-6 max-w-md mx-auto">
        <EmptyState
          icon={CalendarDays}
          title="Geen week gepland"
          description="Genereer je eerste week om te beginnen"
          action={
            <Button onClick={generateNewWeek}>
              <Sparkles className="w-4 h-4 mr-2" />
              Week genereren
            </Button>
          }
        />
      </div>
    );
  }

  const todayDate = parseISO(today.date);
  const weekNumber = currentWeek?.weekNumber;

  return (
    <div className="px-4 py-6 max-w-md mx-auto">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center gap-2 text-[#4A90A4] mb-1">
          <CalendarDays size={20} />
          <span className="text-sm font-medium">Week {weekNumber}</span>
        </div>
        <h1 className="text-2xl font-bold text-[#2D3436]">
          {format(todayDate, "EEEE d MMMM", { locale: nl })}
        </h1>
      </header>

      {/* Dag overzicht */}
      <DayView day={today} />
    </div>
  );
}
