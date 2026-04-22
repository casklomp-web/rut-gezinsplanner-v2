'use client';

import { Day, MealInstance, Ingredient } from '@/lib/types';
import { UtensilsCrossed, Dumbbell, Check, X, ChevronRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';
import { useWeekStore } from '@/lib/store/weekStore';
import { useHaptic, HAPTIC_PATTERNS } from '@/components/providers/HapticProvider';
import { toast } from '@/components/ui/Toast';
import { QuickAddModal } from './QuickAddModal';
import { useState } from 'react';

interface WeekDayCardProps {
  day: Day;
  onSelectMeal?: (dayId: string, mealType: 'breakfast' | 'lunch' | 'dinner') => void;
}

export function WeekDayCard({ day, onSelectMeal }: WeekDayCardProps) {
  const { toggleMealComplete, toggleTrainingComplete, swapMeal, addShoppingItem } = useWeekStore();
  const { vibrate } = useHaptic();
  const dayDate = parseISO(day.date);
  const isToday = day.date === new Date().toISOString().split('T')[0];
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const handleMealToggle = (mealType: 'breakfast' | 'lunch' | 'dinner') => {
    vibrate(HAPTIC_PATTERNS.LIGHT);
    toggleMealComplete(day.id, mealType);
  };

  const handleTrainingToggle = () => {
    vibrate(HAPTIC_PATTERNS.MEDIUM);
    toggleTrainingComplete(day.id);
  };

  const handleClearMeal = (mealType: 'breakfast' | 'lunch' | 'dinner', e: React.MouseEvent) => {
    e.stopPropagation();
    vibrate(HAPTIC_PATTERNS.MEDIUM);
    // Clear the meal by swapping to an empty/default meal
    swapMeal(day.id, mealType, 'empty_meal');
    toast.success('Maaltijd verwijderd');
  };

  const handleQuickAdd = (ingredient: Ingredient, amount: number, unit: string, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    // Add to shopping list
    addShoppingItem({
      name: ingredient.name,
      amount,
      unit,
      estimatedPrice: ingredient.estimatedPrice * amount,
    });
    
    toast.success(`${amount} ${unit} ${ingredient.name} toegevoegd aan ${mealType === 'breakfast' ? 'ontbijt' : mealType === 'lunch' ? 'lunch' : mealType === 'dinner' ? 'diner' : 'tussendoortje'}`);
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

      {/* Quick add button */}
      <button
        onClick={() => setIsQuickAddOpen(true)}
        className="w-full mb-3 py-2 px-3 rounded-xl border-2 border-dashed border-[#4A90A4]/30 text-[#4A90A4] hover:border-[#4A90A4] hover:bg-[#4A90A4]/5 transition-all flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm font-medium">Snel iets toevoegen</span>
      </button>

      {/* Meals */}
      <div className="space-y-2">
        <MealRow
          meal={day.meals.breakfast}
          label="Ontbijt"
          onToggle={() => handleMealToggle('breakfast')}
          onSelect={onSelectMeal ? () => onSelectMeal(day.id, 'breakfast') : undefined}
          onClear={(e) => handleClearMeal('breakfast', e)}
        />
        <MealRow
          meal={day.meals.lunch}
          label="Lunch"
          onToggle={() => handleMealToggle('lunch')}
          onSelect={onSelectMeal ? () => onSelectMeal(day.id, 'lunch') : undefined}
          onClear={(e) => handleClearMeal('lunch', e)}
        />
        <MealRow
          meal={day.meals.dinner}
          label="Diner"
          onToggle={() => handleMealToggle('dinner')}
          onSelect={onSelectMeal ? () => onSelectMeal(day.id, 'dinner') : undefined}
          onClear={(e) => handleClearMeal('dinner', e)}
        />
      </div>

      {/* Training - Visually separated from meals */}
      {day.isTrainingDay && day.training && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Beweging</p>
          <button
            onClick={handleTrainingToggle}
            className={cn(
              "w-full p-3 rounded-xl flex items-center gap-3 transition-colors",
              day.training.completed
                ? "bg-[#7CB342]/10 text-[#7CB342] border border-[#7CB342]/20"
                : "bg-[#4A90A4]/5 text-[#4A90A4] border border-[#4A90A4]/20 hover:bg-[#4A90A4]/10"
            )}
            aria-pressed={day.training.completed}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              day.training.completed ? "bg-[#7CB342]/20" : "bg-[#4A90A4]/10"
            )}>
              <Dumbbell className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium flex-1 text-left">
              Training {day.training.time && `(${day.training.time})`}
            </span>
            {day.training.completed && <Check className="w-5 h-5" />}
          </button>
        </div>
      )}

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onAdd={handleQuickAdd}
        dayLabel={format(dayDate, 'EEEE d MMMM', { locale: nl })}
      />
    </div>
  );
}

interface MealRowProps {
  meal: MealInstance;
  label: string;
  onToggle: () => void;
  onSelect?: () => void;
}

interface MealRowProps {
  meal: MealInstance;
  label: string;
  onToggle: () => void;
  onSelect?: () => void;
  onClear?: (e: React.MouseEvent) => void;
}

function MealRow({ meal, label, onToggle, onSelect, onClear }: MealRowProps) {
  const isEmpty = meal.mealName === 'Leeg';
  
  return (
    <div
      className={cn(
        "w-full flex items-center gap-2 p-2 rounded-lg transition-all group border-2",
        meal.completed
          ? "bg-gray-50 border-transparent"
          : isEmpty 
            ? "bg-gray-50 border-dashed border-gray-200 hover:border-[#4A90A4]/50"
            : "bg-white border-transparent hover:border-[#4A90A4]/30 hover:shadow-sm"
      )}
    >
      <button
        onClick={onToggle}
        className="flex items-center gap-2 text-left"
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
      </button>
      <button
        onClick={onSelect}
        className="flex-1 flex items-center gap-2 text-left min-w-0"
      >
        <div className="flex-1 min-w-0">
          {isEmpty ? (
            <p className="text-sm text-gray-400 italic">
              Klik om {label.toLowerCase()} toe te voegen...
            </p>
          ) : (
            <p className={cn(
              "text-sm truncate",
              meal.completed ? "text-gray-400 line-through" : "text-[#2D3436]"
            )}>
              {meal.mealName}
            </p>
          )}
        </div>
        {!isEmpty && (
          <span className="text-xs text-gray-400">{label}</span>
        )}
        {isEmpty && (
          <ChevronRight className="w-4 h-4 text-gray-300" />
        )}
      </button>
      {/* Clear button - only show on hover and if meal is not empty */}
      {onClear && !isEmpty && (
        <button
          onClick={onClear}
          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
          title="Verwijder maaltijd"
          aria-label="Verwijder maaltijd"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
