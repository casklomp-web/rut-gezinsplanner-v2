'use client';

import { Day, MealInstance } from '@/lib/types';
import { UtensilsCrossed, Dumbbell, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';
import { useWeekStore } from '@/lib/store/weekStore';
import { useHaptic, HAPTIC_PATTERNS } from '@/components/providers/HapticProvider';

interface WeekDayCardProps {
  day: Day;
}

export function WeekDayCard({ day }: WeekDayCardProps) {
  const { toggleMealComplete, toggleTrainingComplete } = useWeekStore();
  const { vibrate } = useHaptic();
  const dayDate = parseISO(day.date);
  const isToday = day.date === new Date().toISOString().split('T')[0];

  const handleMealToggle = (mealType: 'breakfast' | 'lunch' | 'dinner') => {
    vibrate(HAPTIC_PATTERNS.LIGHT);
    toggleMealComplete(day.id, mealType);
  };

  const handleTrainingToggle = () => {
    vibrate(HAPTIC_PATTERNS.MEDIUM);
    toggleTrainingComplete(day.id);
  };

  return (
    <div 
      className={cn(
        "bg-white rounded-xl p-4 border-2 transition-all",
        isToday ? "border-[#4A90A4] shadow-md" : "border-transparent hover:border-gray-200"
      )}
    >
      {/* Day header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-sm font-medium",
            isToday ? "text-[#4A90A4]" : "text-gray-500"
          )}>
            {format(dayDate, 'EEEE', { locale: nl })}
          </span>
          {isToday && (
            <span className="text-xs bg-[#4A90A4]/10 text-[#4A90A4] px-2 py-0.5 rounded-full">
              Vandaag
            </span>
          )}
        </div>
        <span className="text-sm text-gray-400">
          {format(dayDate, 'd MMM', { locale: nl })}
        </span>
      </div>

      {/* Meals */}
      <div className="space-y-2">
        <MealRow
          meal={day.meals.breakfast}
          label="Ontbijt"
          onToggle={() => handleMealToggle('breakfast')}
        />
        <MealRow
          meal={day.meals.lunch}
          label="Lunch"
          onToggle={() => handleMealToggle('lunch')}
        />
        <MealRow
          meal={day.meals.dinner}
          label="Diner"
          onToggle={() => handleMealToggle('dinner')}
        />
      </div>

      {/* Training */}
      {day.isTrainingDay && day.training && (
        <button
          onClick={handleTrainingToggle}
          className={cn(
            "w-full mt-3 p-2 rounded-lg flex items-center gap-2 transition-colors",
            day.training.completed
              ? "bg-[#7CB342]/10 text-[#7CB342]"
              : "bg-[#4A90A4]/10 text-[#4A90A4]"
          )}
          aria-pressed={day.training.completed}
        >
          <Dumbbell className="w-4 h-4" />
          <span className="text-sm font-medium flex-1 text-left">
            Training {day.training.time && `(${day.training.time})`}
          </span>
          {day.training.completed && <Check className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
}

interface MealRowProps {
  meal: MealInstance;
  label: string;
  onToggle: () => void;
}

function MealRow({ meal, label, onToggle }: MealRowProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "w-full flex items-center gap-2 p-2 rounded-lg transition-colors text-left",
        meal.completed
          ? "bg-gray-50"
          : "hover:bg-gray-50"
      )}
      aria-pressed={meal.completed}
    >
      <div className={cn(
        "w-5 h-5 rounded border flex items-center justify-center transition-colors flex-shrink-0",
        meal.completed
          ? "bg-[#7CB342] border-[#7CB342]"
          : "border-gray-300"
      )}>
        {meal.completed && <Check className="w-3 h-3 text-white" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm truncate",
          meal.completed ? "text-gray-400 line-through" : "text-[#2D3436]"
        )}>
          {meal.mealName}
        </p>
      </div>
      <span className="text-xs text-gray-400">{label}</span>
    </button>
  );
}
