"use client";

import { useWeekStore } from "@/lib/store/weekStore";
import { format, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HistoryPage() {
  const { weekHistory, currentWeek, setCurrentWeek } = useWeekStore();
  
  // Combineer huidige week met historie
  const allWeeks = currentWeek 
    ? [currentWeek, ...weekHistory]
    : weekHistory;

  return (
    <div className="px-4 py-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-[#2D3436] mb-6">
        Week Historie
      </h1>

      {allWeeks.length === 0 ? (
        <div className="text-center py-8">
          <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">
            Nog geen week historie. Genereer je eerste week!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {allWeeks.map((week, index) => {
            const isCurrent = currentWeek?.id === week.id;
            
            return (
              <button
                key={week.id}
                onClick={() => setCurrentWeek(week)}
                className={cn(
                  "w-full text-left bg-white rounded-xl p-4 border transition-all",
                  isCurrent 
                    ? "border-[#4A90A4] ring-1 ring-[#4A90A4]" 
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#2D3436]">
                      Week {week.weekNumber}, {week.year}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(parseISO(week.startDate), "d MMM", { locale: nl })} - {" "}
                      {format(parseISO(week.endDate), "d MMM", { locale: nl })}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    {isCurrent && (
                      <span className="text-xs bg-[#4A90A4] text-white px-2 py-1 rounded-full">
                        Huidig
                      </span>
                    )}
                    <div className="text-sm text-gray-500 mt-1">
                      {week.stats.trainingDays}x 🏋️
                    </div>
                  </div>
                </div>
                
                {/* Samenvatting maaltijden */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>{week.stats.mealsPlanned} maaltijden</span>
                    {week.shoppingList && (
                      <span>€{week.shoppingList.estimatedTotal}</span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
