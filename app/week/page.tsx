'use client';

import { useWeekStore } from "@/lib/store/weekStore";
import { WeekViewSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/ErrorBoundary";
import { Button } from "@/components/ui/Button";
import { RefreshCw, ShoppingCart, CalendarDays, Plus } from "lucide-react";
import { RecipeSelectionModal } from "@/components/recipes/RecipeSelectionModal";
import { MealType } from "@/lib/types";
import { format, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import { WeekDayCard } from "@/components/week/WeekDayCard";
import { DraggableWeekPlanner } from "@/components/week/DraggableWeekPlanner";
import { toast } from "@/components/ui/Toast";
import { PullToRefresh } from "@/components/ui/Swipeable";
import { useOffline } from "@/components/providers/OfflineProvider";
import { isFeatureEnabled } from "@/components/providers/FeatureProvider";
import { trackEvent, AnalyticsEvents } from "@/components/providers/FeatureProvider";
import { Suspense, useState, useEffect } from "react";
import { MealPrepIndicator } from "@/components/features/MealPrepIndicator";
import { NutritionPanel } from "@/components/features/NutritionPanel";
import { useUserStore } from "@/lib/store/userStore";
import { meals as defaultMeals } from "@/lib/data/meals";
import { isFeatureEnabled as isMVPFeatureEnabled } from "@/lib/features/flags";
import { AuthGuard } from "@/components/auth/AuthGuard";

function WeekPageContent() {
  const { currentWeek, generateNewWeek, generateShoppingList, isLoading, error } = useWeekStore();
  const { currentUser } = useUserStore();
  const { triggerSync } = useOffline();
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [modalDayId, setModalDayId] = useState<string | undefined>(undefined);
  const [modalMealType, setModalMealType] = useState<MealType | undefined>(undefined);
  const [hasTriedGenerate, setHasTriedGenerate] = useState(false);
  
  // MVP: Hide collaborative features
  const showCollaborative = false;

  // Auto-generate week if none exists
  useEffect(() => {
    if (!currentWeek && !isLoading && !hasTriedGenerate) {
      setHasTriedGenerate(true);
      generateNewWeek();
    }
  }, [currentWeek, isLoading, hasTriedGenerate, generateNewWeek]);

  const handleRefresh = async () => {
    await triggerSync();
    return new Promise<void>((resolve) => setTimeout(resolve, 500));
  };

  // Create meals data map for nutrition calculations
  const mealsData = new Map(defaultMeals.map(m => [m.id, m]));

  if (isLoading) {
    return (
      <div className="px-4 py-6 w-full">
        <WeekViewSkeleton />
      </div>
    );
  }

  if (!currentWeek) {
    return (
      <div className="px-4 py-6 w-full">
        <EmptyState
          icon={CalendarDays}
          title={error ? "Fout bij laden" : "Geen week gepland"}
          description={error || "Genereer een week om je maaltijdplanning te zien"}
          action={
            <Button onClick={generateNewWeek}>
              <RefreshCw className="w-4 h-4 mr-2" />
              {error ? "Opnieuw proberen" : "Week genereren"}
            </Button>
          }
        />
      </div>
    );
  }

  const handleGenerateShoppingList = () => {
    generateShoppingList();
    toast.success('Boodschappenlijst gegenereerd');
    trackEvent(AnalyticsEvents.SHOPPING_LIST_GENERATED, {
      weekNumber: currentWeek?.weekNumber,
    });
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="px-4 py-6 w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#2D3436] dark:text-gray-100">
              Week {currentWeek.weekNumber}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {format(parseISO(currentWeek.startDate), "d MMM", { locale: nl })} - {format(parseISO(currentWeek.endDate), "d MMM", { locale: nl })}
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              if (confirm('Weet je zeker dat je een nieuwe week wilt genereren? De huidige week wordt opgeslagen in je geschiedenis.')) {
                generateNewWeek();
                trackEvent(AnalyticsEvents.WEEK_GENERATED);
                toast.success('Nieuwe week gegenereerd');
              }
            }}
            title="Genereer nieuwe week"
          >
            <RefreshCw size={16} className="mr-1" />
            Nieuwe week
          </Button>
        </div>

        {/* Meal Prep Indicator - MVP: Keep this, it's useful */}
        {isMVPFeatureEnabled('MEAL_PREP_INDICATOR') && (
          <MealPrepIndicator
            week={currentWeek}
            mealsData={mealsData}
            className="mb-4"
          />
        )}

        {/* Nutrition Overview - MVP: Minimal */}
        {isMVPFeatureEnabled('NUTRITION_PANEL') && (
          <NutritionPanel
            week={currentWeek}
            mealsData={mealsData}
            variant="compact"
            className="mb-4"
          />
        )}

        {/* Add meal button */}
        <Button
          variant="outline"
          className="w-full mb-4"
          onClick={() => {
            setModalDayId(undefined);
            setModalMealType(undefined);
            setIsRecipeModalOpen(true);
          }}
        >
          <Plus size={18} className="mr-2" />
          Kies zelf een recept
        </Button>

        {/* Week overzicht */}
        {isFeatureEnabled('ENABLE_DRAG_DROP') ? (
          <DraggableWeekPlanner 
            days={currentWeek.days} 
            onSelectMeal={(dayId, mealType) => {
              setModalDayId(dayId);
              setModalMealType(mealType);
              setIsRecipeModalOpen(true);
            }}
          />
        ) : (
          <div className="space-y-3">
            {currentWeek.days.map((day) => (
              <WeekDayCard 
                key={day.id} 
                day={day}
                onSelectMeal={(dayId, mealType) => {
                  setModalDayId(dayId);
                  setModalMealType(mealType);
                  setIsRecipeModalOpen(true);
                }}
              />
            ))}
          </div>
        )}

        {/* Recipe Selection Modal */}
        <RecipeSelectionModal
          isOpen={isRecipeModalOpen}
          onClose={() => setIsRecipeModalOpen(false)}
          preselectedDayId={modalDayId}
          preselectedMealType={modalMealType}
        />

        {/* Boodschappen knop */}
        <Button 
          onClick={handleGenerateShoppingList}
          className="w-full mt-6"
          size="lg"
        >
          <ShoppingCart size={20} className="mr-2" />
          Maak boodschappenlijst
        </Button>
      </div>
    </PullToRefresh>
  );
}

export default function WeekPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<WeekViewSkeleton />}>
        <WeekPageContent />
      </Suspense>
    </AuthGuard>
  );
}
