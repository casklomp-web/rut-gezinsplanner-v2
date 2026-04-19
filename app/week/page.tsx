'use client';

import { useWeekStore } from "@/lib/store/weekStore";
import { WeekViewSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/ErrorBoundary";
import { Button } from "@/components/ui/Button";
import { RefreshCw, ShoppingCart, CalendarDays } from "lucide-react";
import { format, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import { WeekDayCard } from "@/components/week/WeekDayCard";
import { toast } from "@/components/ui/Toast";

export default function WeekPage() {
  const { currentWeek, generateNewWeek, generateShoppingList, isLoading } = useWeekStore();

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
  };

  return (
    <div className="px-4 py-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2D3436]">
            Week {currentWeek.weekNumber}
          </h1>
          <p className="text-sm text-gray-500">
            {format(parseISO(currentWeek.startDate), "d MMM", { locale: nl })} - {format(parseISO(currentWeek.endDate), "d MMM", { locale: nl })}
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={generateNewWeek}
        >
          <RefreshCw size={16} className="mr-1" />
          Nieuw
        </Button>
      </div>

      {/* Week overzicht */}
      <div className="space-y-3">
        {currentWeek.days.map((day) => (
          <WeekDayCard key={day.id} day={day} />
        ))}
      </div>

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
  );
}
