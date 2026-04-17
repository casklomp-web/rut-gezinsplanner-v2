"use client";

import { useState } from "react";
import { Day, Meal } from "@/lib/types";
import { useWeekStore } from "@/lib/store/weekStore";
import { getMealAlternatives } from "@/lib/logic/weekGenerator";
import { meals } from "@/lib/data/meals";
import { X, Clock, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface MealSwapModalProps {
  day: Day;
  mealType: "breakfast" | "lunch" | "dinner";
  isOpen: boolean;
  onClose: () => void;
}

export function MealSwapModal({ day, mealType, isOpen, onClose }: MealSwapModalProps) {
  const { swapMeal } = useWeekStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const currentMealId = day.meals[mealType].mealId;
  const alternatives = getMealAlternatives(currentMealId, mealType, day.isTrainingDay);
  
  const handleSwap = (newMealId: string) => {
    swapMeal(day.id, mealType, newMealId);
    onClose();
  };
  
  if (!isOpen) return null;
  
  const labels = {
    breakfast: "ontbijt",
    lunch: "lunch",
    dinner: "diner"
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-[#2D3436]">
              Wissel {labels[mealType]}
            </h2>
            <p className="text-sm text-gray-500">
              Kies een alternatief
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Alternatieven lijst */}
        <div className="overflow-y-auto max-h-[60vh] p-4 space-y-3">
          {alternatives.map((meal) => {
            const isCurrent = meal.id === currentMealId;
            
            return (
              <button
                key={meal.id}
                onClick={() => handleSwap(meal.id)}
                disabled={isCurrent}
                className={cn(
                  "w-full text-left p-4 rounded-xl border transition-all",
                  isCurrent 
                    ? "border-[#7CB342] bg-[#7CB342]/5" 
                    : "border-gray-200 hover:border-[#4A90A4] hover:bg-[#4A90A4]/5"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-[#2D3436]">
                      {meal.name}
                      {isCurrent && (
                        <span className="ml-2 text-xs text-[#7CB342]">(huidig)</span>
                      )}
                    </p>
                    
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {meal.prepTime + meal.cookTime} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame size={14} />
                        {meal.nutrition.protein}g eiwit
                      </span>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {meal.tags.slice(0, 3).map(tag => (
                        <span 
                          key={tag}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                        >
                          {tag === "high-protein" && "💪 Eiwit"}
                          {tag === "quick" && "⚡ Snel"}
                          {tag === "budget" && "💰 Budget"}
                          {tag === "kid-friendly" && "👶 Kind"}
                          {tag === "meal-prep" && "🔄 Prep"}
                          {!["high-protein", "quick", "budget", "kid-friendly", "meal-prep"].includes(tag) && tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
