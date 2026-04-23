'use client';

import { useState, useEffect, Suspense } from "react";
import { useWeekStore } from "@/lib/store/weekStore";
import { DayViewSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/ErrorBoundary";
import { Button } from "@/components/ui/Button";
import { format, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { useHaptic, HAPTIC_PATTERNS } from "@/components/providers/HapticProvider";
import { trackEvent, AnalyticsEvents } from "@/components/providers/FeatureProvider";
import { cn } from "@/lib/utils";
import { Day, MealType } from "@/lib/types";
import { CalendarDays, Sparkles, ChevronLeft, ChevronRight, ChefHat } from "lucide-react";
import { NutritionPanel } from "@/components/features/NutritionPanel";
import { MealPrepIndicator, PrepDayBadge } from "@/components/features/MealPrepIndicator";
import { meals as defaultMeals } from "@/lib/data/meals";
import { useUserStore } from "@/lib/store/userStore";
import { RecipeSelectionModal } from "@/components/recipes/RecipeSelectionModal";
import { isFeatureEnabled } from "@/lib/features/flags";
import { AuthGuard } from "@/components/auth/AuthGuard";

// Day view component
function DayView({ day }: { day: Day }) {
  const { toggleMealComplete, toggleTrainingComplete, toggleCheckin } = useWeekStore();
  const { vibrate } = useHaptic();
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<MealType | null>(null);

  if (!day) return null;

  const dayDate = parseISO(day.date);

  const handleMealToggle = (mealType: "breakfast" | "lunch" | "dinner") => {
    vibrate(HAPTIC_PATTERNS.LIGHT);
    toggleMealComplete(day.id, mealType);
    trackEvent(AnalyticsEvents.MEAL_COMPLETED, {
      dayId: day.id,
      mealType,
      mealName: day.meals[mealType].mealName,
    });
  };

  const handleMealClick = (mealType: MealType) => {
    setSelectedMealType(mealType);
    setIsRecipeModalOpen(true);
  };

  const handleTrainingToggle = () => {
    vibrate(HAPTIC_PATTERNS.MEDIUM);
    toggleTrainingComplete(day.id);
    trackEvent(AnalyticsEvents.TRAINING_COMPLETED, {
      dayId: day.id,
    });
  };

  // Create meals data map for nutrition
  const mealsData = new Map(defaultMeals.map(m => [m.id, m]));

  return (
    <div className="space-y-4">
      {/* Meal Prep Badge */}
      {(day.isMealPrepDay || day.isLeftoverDay) && (
        <PrepDayBadge
          isPrepDay={day.isMealPrepDay}
          hasPrepMeals={day.isLeftoverDay}
          className="mb-2"
        />
      )}

      {/* Nutrition Summary */}
      <NutritionPanel
        day={day}
        mealsData={mealsData}
        variant="compact"
      />

      {/* Meals */}
      <div className="space-y-3">
        {/* Breakfast */}
        <div
          className={cn(
            "w-full bg-white dark:bg-gray-800 rounded-xl p-4 border-2 transition-all",
            day.meals.breakfast.completed
              ? "border-[#7CB342] bg-[#7CB342]/5"
              : "border-transparent hover:border-[#4A90A4]/30"
          )}
        >
          <div className="flex items-center justify-between">
            <button
              onClick={() => handleMealClick('breakfast')}
              className="flex-1 text-left"
            >
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Ontbijt</p>
              <p className={cn(
                "font-medium dark:text-gray-200",
                day.meals.breakfast.completed && "line-through text-gray-400"
              )}>
                {day.meals.breakfast.mealName}
              </p>
            </button>
            <button
              onClick={() => handleMealToggle('breakfast')}
              className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ml-2",
                day.meals.breakfast.completed
                  ? "bg-[#7CB342] border-[#7CB342]"
                  : "border-gray-300 dark:border-gray-600"
              )}
              aria-pressed={day.meals.breakfast.completed}
              aria-label="Markeer als voltooid"
            >
              {day.meals.breakfast.completed && (
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Lunch */}
        <div
          className={cn(
            "w-full bg-white dark:bg-gray-800 rounded-xl p-4 border-2 transition-all",
            day.meals.lunch.completed
              ? "border-[#7CB342] bg-[#7CB342]/5"
              : "border-transparent hover:border-[#4A90A4]/30"
          )}
        >
          <div className="flex items-center justify-between">
            <button
              onClick={() => handleMealClick('lunch')}
              className="flex-1 text-left"
            >
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Lunch</p>
              <p className={cn(
                "font-medium dark:text-gray-200",
                day.meals.lunch.completed && "line-through text-gray-400"
              )}>
                {day.meals.lunch.mealName}
              </p>
            </button>
            <button
              onClick={() => handleMealToggle('lunch')}
              className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ml-2",
                day.meals.lunch.completed
                  ? "bg-[#7CB342] border-[#7CB342]"
                  : "border-gray-300 dark:border-gray-600"
              )}
              aria-pressed={day.meals.lunch.completed}
              aria-label="Markeer als voltooid"
            >
              {day.meals.lunch.completed && (
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Dinner */}
        <div
          className={cn(
            "w-full bg-white dark:bg-gray-800 rounded-xl p-4 border-2 transition-all",
            day.meals.dinner.completed
              ? "border-[#7CB342] bg-[#7CB342]/5"
              : "border-transparent hover:border-[#4A90A4]/30"
          )}
        >
          <div className="flex items-center justify-between">
            <button
              onClick={() => handleMealClick('dinner')}
              className="flex-1 text-left"
            >
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Diner</p>
              <p className={cn(
                "font-medium dark:text-gray-200",
                day.meals.dinner.completed && "line-through text-gray-400"
              )}>
                {day.meals.dinner.mealName}
              </p>
            </button>
            <button
              onClick={() => handleMealToggle('dinner')}
              className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ml-2",
                day.meals.dinner.completed
                  ? "bg-[#7CB342] border-[#7CB342]"
                  : "border-gray-300 dark:border-gray-600"
              )}
              aria-pressed={day.meals.dinner.completed}
              aria-label="Markeer als voltooid"
            >
              {day.meals.dinner.completed && (
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Training - Visually separated section */}
      {day.isTrainingDay && day.training && (
        <div className="pt-2">
          <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Beweging</p>
          <button
            onClick={handleTrainingToggle}
            className={cn(
              "w-full rounded-xl p-4 border-2 transition-all text-left",
              day.training.completed
                ? "border-[#7CB342] bg-[#7CB342]/5"
                : "border-gray-200 bg-white dark:bg-gray-800 hover:border-[#4A90A4]/30"
            )}
            aria-pressed={day.training.completed}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  day.training.completed ? "bg-[#7CB342]/20" : "bg-[#4A90A4]/10"
                )}>
                  <span className="text-lg">💪</span>
                </div>
                <div>
                  <p className={cn(
                    "font-medium dark:text-gray-200",
                    day.training.completed && "line-through text-gray-400"
                  )}>
                    {day.training.description || "Training"}
                  </p>
                  {day.training.time && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{day.training.time}</p>
                  )}
                </div>
              </div>
              <div className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                day.training.completed
                  ? "bg-[#7CB342] border-[#7CB342]"
                  : "border-gray-300 dark:border-gray-600"
              )}>
                {day.training.completed && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Checkins */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Dagelijkse check-ins</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => toggleCheckin(day.id, 'walking')}
            className={cn(
              "p-2 rounded-lg text-sm transition-colors text-left",
              day.checkins.walking
                ? "bg-[#7CB342]/10 text-[#7CB342]"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
            )}
            aria-pressed={day.checkins.walking}
          >
            🚶‍♂️ Wandelen
          </button>
          <button
            onClick={() => toggleCheckin(day.id, 'medication')}
            className={cn(
              "p-2 rounded-lg text-sm transition-colors text-left",
              day.checkins.medication
                ? "bg-[#7CB342]/10 text-[#7CB342]"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
            )}
            aria-pressed={day.checkins.medication}
          >
            💊 Medicatie
          </button>
          <button
            onClick={() => toggleCheckin(day.id, 'sleepRoutine')}
            className={cn(
              "p-2 rounded-lg text-sm transition-colors text-left",
              day.checkins.sleepRoutine
                ? "bg-[#7CB342]/10 text-[#7CB342]"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
            )}
            aria-pressed={day.checkins.sleepRoutine}
          >
            😴 Slaapritme
          </button>
        </div>
      </div>

      {/* Recipe Selection Modal */}
      <RecipeSelectionModal
        isOpen={isRecipeModalOpen}
        onClose={() => {
          setIsRecipeModalOpen(false);
          setSelectedMealType(null);
        }}
        preselectedDayId={day.id}
        preselectedMealType={selectedMealType || undefined}
      />
    </div>
  );
}

function TodayPageContent() {
  const { currentWeek, generateNewWeek, getToday } = useWeekStore();
  const { currentUser } = useUserStore();
  const today = getToday();
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const { vibrate } = useHaptic();
  
  useEffect(() => {
    // MVP: Skip onboarding, mark as completed
    localStorage.setItem('rut-onboarding-completed', 'true');
    
    // Generate week if needed
    if (!currentWeek) {
      generateNewWeek();
    }
    
    setIsLoading(false);
  }, [currentWeek, generateNewWeek]);

  // Set selected day to today when week loads
  useEffect(() => {
    if (currentWeek && selectedDayIndex === null) {
      const todayIndex = currentWeek.days.findIndex(d => d.date === new Date().toISOString().split('T')[0]);
      setSelectedDayIndex(todayIndex >= 0 ? todayIndex : 0);
    }
  }, [currentWeek, selectedDayIndex]);
  
  const handleOnboardingComplete = () => {
    // MVP: Onboarding skipped
    setShowOnboarding(false);
    generateNewWeek();
  };
  
  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
  };

  const handlePrevDay = () => {
    if (selectedDayIndex !== null && selectedDayIndex > 0) {
      vibrate(HAPTIC_PATTERNS.LIGHT);
      setSelectedDayIndex(selectedDayIndex - 1);
    }
  };

  const handleNextDay = () => {
    if (currentWeek && selectedDayIndex !== null && selectedDayIndex < currentWeek.days.length - 1) {
      vibrate(HAPTIC_PATTERNS.LIGHT);
      setSelectedDayIndex(selectedDayIndex + 1);
    }
  };

  // MVP: Voice commands hidden but preserved
  const handleVoiceCommand = (command: string) => {
    if (isFeatureEnabled('VOICE_INPUT')) {
      if (command.toLowerCase().includes('plan')) {
        window.location.href = '/week';
      }
    }
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
      <div className="px-4 py-6 w-full">
        <DayViewSkeleton />
      </div>
    );
  }
  
  if (!currentWeek || selectedDayIndex === null) {
    return (
      <div className="px-4 py-6 w-full">
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

  const selectedDay = currentWeek.days[selectedDayIndex];
  const selectedDate = parseISO(selectedDay.date);
  const isToday = selectedDay.date === new Date().toISOString().split('T')[0];
  const canGoPrev = selectedDayIndex > 0;
  const canGoNext = selectedDayIndex < currentWeek.days.length - 1;

  // Create meals data map for meal prep
  const mealsData = new Map(defaultMeals.map(m => [m.id, m]));

  return (
    <div className="px-4 py-6 w-full">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-[#4A90A4]">
            <CalendarDays size={20} aria-hidden="true" />
            <span className="text-sm font-medium">Week {currentWeek.weekNumber}</span>
            {isToday && (
              <span className="text-xs bg-[#4A90A4]/10 text-[#4A90A4] px-2 py-0.5 rounded-full">
                Vandaag
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevDay}
              disabled={!canGoPrev}
              className={cn(
                "p-1 rounded-lg transition-colors",
                canGoPrev
                  ? "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                  : "text-gray-300 dark:text-gray-600 cursor-not-allowed"
              )}
              aria-label="Vorige dag"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNextDay}
              disabled={!canGoNext}
              className={cn(
                "p-1 rounded-lg transition-colors",
                canGoNext
                  ? "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                  : "text-gray-300 dark:text-gray-600 cursor-not-allowed"
              )}
              aria-label="Volgende dag"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-[#2D3436] dark:text-gray-100">
          {format(selectedDate, "EEEE d MMMM", { locale: nl })}
        </h1>
      </header>

      {/* Meal Prep Indicator for Week - MVP: Keep this */}
      {isFeatureEnabled('MEAL_PREP_INDICATOR') && (
        <MealPrepIndicator
          week={currentWeek}
          mealsData={mealsData}
          className="mb-4"
        />
      )}

      {/* Dag overzicht */}
      <DayView day={selectedDay} />
    </div>
  );
}

export default function TodayPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<DayViewSkeleton />}>
        <TodayPageContent />
      </Suspense>
    </AuthGuard>
  );
}
