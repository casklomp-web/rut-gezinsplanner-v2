"use client";

import { useWeekStore } from "@/lib/store/weekStore";
import { Button } from "@/components/ui/Button";
import { RefreshCw, ShoppingCart } from "lucide-react";
import { format, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import { WeekDayCard } from "@/components/week/WeekDayCard";

export default function WeekPage() {
  const { currentWeek, generateNewWeek, generateShoppingList } = useWeekStore();

  if (!currentWeek) {
    return (
      <div className="px-4 py-6 max-w-md mx-auto">
        <p className="text-center text-gray-500">Geen week gepland</p>
        <Button onClick={generateNewWeek} className="w-full mt-4">
          Genereer week
        </Button>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2D3436]">
            Week {currentWeek.weekNumber}
          </h1>
          <p className="text-sm text-gray-500">
            {format(parseISO(currentWeek.startDate), "d MMM", { locale: nl })} - {" "}
            {format(parseISO(currentWeek.endDate), "d MMM", { locale: nl })}
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
        onClick={generateShoppingList}
        className="w-full mt-6"
        size="lg"
      >
        <ShoppingCart size={20} className="mr-2" />
        Maak boodschappenlijst
      </Button>
    </div>
  );
}
