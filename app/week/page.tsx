'use client';

import { useWeekStore } from "@/lib/store/weekStore";
import { WeekViewSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/ErrorBoundary";
import { Button } from "@/components/ui/Button";
import { RefreshCw, ShoppingCart, CalendarDays, Share2, ChefHat } from "lucide-react";
import { format, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import { WeekDayCard } from "@/components/week/WeekDayCard";
import { DraggableWeekPlanner } from "@/components/week/DraggableWeekPlanner";
import { toast } from "@/components/ui/Toast";
import { PullToRefresh } from "@/components/ui/Swipeable";
import { useOffline } from "@/components/providers/OfflineProvider";
import { isFeatureEnabled } from "@/components/providers/FeatureProvider";
import { trackEvent, AnalyticsEvents } from "@/components/providers/FeatureProvider";
import { Suspense, useState } from "react";
import { SocialShareButtons } from "@/components/features/SocialShareButtons";
import { MealPrepIndicator } from "@/components/features/MealPrepIndicator";
import { NutritionPanel } from "@/components/features/NutritionPanel";
import { CollaborativeStatus } from "@/components/features/CollaborativeStatus";
import { useUserStore } from "@/lib/store/userStore";
import { meals as defaultMeals } from "@/lib/data/meals";

function WeekPageContent() {
  const { currentWeek, generateNewWeek, generateShoppingList, isLoading } = useWeekStore();
  const { currentUser } = useUserStore();
  const { triggerSync } = useOffline();
  const [showCollaborative, setShowCollaborative] = useState(false);

  const handleRefresh = async () => {
    await triggerSync();
    return new Promise<void>((resolve) => setTimeout(resolve, 500));
  };

  // Create meals data map for nutrition calculations
  const mealsData = new Map(defaultMeals.map(m => [m.id, m]));

  if (isLoading) {
    return (
      <div className="px-4 py-6 max-w-md mx-auto">
        <WeekViewSkeleton />
      </div>
    );
  }

  if (!currentWeek) {
    return (
      <div className="px-4 py-6 max-w-md mx-auto">
        <EmptyState
          icon={CalendarDays}
          title="Geen week gepland"
          description="Genereer een week om je maaltijdplanning te zien"
          action={
            <Button onClick={generateNewWeek}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Week genereren
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
      <div className="px-4 py-6 max-w-md mx-auto">
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
          <div className="flex items-center gap-2">
            <SocialShareButtons
              week={currentWeek}
              type="week"
              className="!px-3"
            />
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                generateNewWeek();
                trackEvent(AnalyticsEvents.WEEK_GENERATED);
              }}
            >
              <RefreshCw size={16} className="mr-1" />
              Nieuw
            </Button>
          </div>
        </div>

        {/* Meal Prep Indicator */}
        <MealPrepIndicator
          week={currentWeek}
          mealsData={mealsData}
          className="mb-4"
        />

        {/* Nutrition Overview */}
        <NutritionPanel
          week={currentWeek}
          mealsData={mealsData}
          variant="compact"
          className="mb-4"
        />

        {/* Collaborative Toggle */}
        <button
          onClick={() => setShowCollaborative(!showCollaborative)}
          className="flex items-center gap-2 mb-4 text-sm text-[#4A90A4] hover:text-[#3a7a8c]"
        >
          <Share2 className="w-4 h-4" />
          {showCollaborative ? 'Verberg samenwerking' : 'Toon samenwerking'}
        </button>

        {/* Collaborative Status */}
        {showCollaborative && currentUser && (
          <CollaborativeStatus
            week={currentWeek}
            currentUser={currentUser}
            className="mb-4"
          />
        )}

        {/* Week overzicht */}
        {isFeatureEnabled('ENABLE_DRAG_DROP') ? (
          <DraggableWeekPlanner days={currentWeek.days} />
        ) : (
          <div className="space-y-3">
            {currentWeek.days.map((day) => (
              <WeekDayCard key={day.id} day={day} />
            ))}
          </div>
        )}

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
    <Suspense fallback={<WeekViewSkeleton />}>
      <WeekPageContent />
    </Suspense>
  );
}
