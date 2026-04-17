"use client";

import { useState } from "react";
import { Day, MealInstance } from "@/lib/types";
import { useWeekStore } from "@/lib/store/weekStore";
import { Check, Dumbbell, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import { MealSwapModal } from "./MealSwapModal";

interface WeekDayCardProps {
  day: Day;
}

function MealRow({ 
  meal, 
  type, 
  day,
  onSwap
}: { 
  meal: MealInstance; 
  type: "breakfast" | "lunch" | "dinner";
  day: Day;
  onSwap: () => void;
}) {
  const { toggleMealComplete } = useWeekStore();
  
  const icons = {
    breakfast: "🍳",
    lunch: "🥗",
    dinner: "🍽️"
  };

  return (
    <div className={cn(
      "flex items-center justify-between py-2 border-b border-gray-100 last:border-0",
      meal.completed && "opacity-60"
    )}>
      <div className="flex items-center gap-2 flex-1">
        <span>{icons[type]}</span>
        <div className="flex-1">
          <p className={cn(
            "text-sm",
            meal.completed && "line-through text-gray-400"
          )}>
            {meal.mealName}
            {meal.isLeftover && (
              <span className="ml-1 text-xs text-[#4A90A4]">🔄</span>
            )}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <button
          onClick={onSwap}
          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-[#4A90A4] hover:bg-[#4A90A4]/10"
          title="Wissel maaltijd"
        >
          <RefreshCw size={14} />
        </button>
        
        <button
          onClick={() => toggleMealComplete(day.id, type)}
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center transition-all",
            meal.completed
              ? "bg-[#7CB342] text-white"
              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
          )}
        >
          <Check size={14} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}

export function WeekDayCard({ day }: WeekDayCardProps) {
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [swapMealType, setSwapMealType] = useState<"breakfast" | "lunch" | "dinner">("breakfast");
  
  const date = parseISO(day.date);
  const isToday = new Date().toISOString().split("T")[0] === day.date;
  
  const openSwapModal = (type: "breakfast" | "lunch" | "dinner") => {
    setSwapMealType(type);
    setSwapModalOpen(true);
  };

  return (
    <>
      <div className={cn(
        "bg-white rounded-xl p-4 border",
        isToday ? "border-[#4A90A4] ring-1 ring-[#4A90A4]" : "border-gray-200",
        day.isTrainingDay && "border-l-4 border-l-[#4A90A4]"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="font-medium text-[#2D3436]">
              {format(date, "EEEE", { locale: nl })}
            </span>
            <span className="text-sm text-gray-500">
              {format(date, "d/M", { locale: nl })}
            </span>
            {isToday && (
              <span className="text-xs bg-[#4A90A4] text-white px-2 py-0.5 rounded-full">
                Vandaag
              </span>
            )}
          </div>
          
          {day.isTrainingDay && (
            <div className="flex items-center gap-1 text-xs text-[#4A90A4] bg-[#4A90A4]/10 px-2 py-1 rounded-full">
              <Dumbbell size={12} />
              19:00
            </div>
          )}
        </div>
        
        {/* Maaltijden */}
        <div className="space-y-1">
          <MealRow 
            meal={day.meals.breakfast} 
            type="breakfast" 
            day={day}
            onSwap={() => openSwapModal("breakfast")}
          />
          <MealRow 
            meal={day.meals.lunch} 
            type="lunch" 
            day={day}
            onSwap={() => openSwapModal("lunch")}
          />
          <MealRow 
            meal={day.meals.dinner} 
            type="dinner" 
            day={day}
            onSwap={() => openSwapModal("dinner")}
          />
        </div>
      </div>
      
      {/* Swap Modal */}
      <MealSwapModal
        day={day}
        mealType={swapMealType}
        isOpen={swapModalOpen}
        onClose={() => setSwapModalOpen(false)}
      />
    </>
  );
}
