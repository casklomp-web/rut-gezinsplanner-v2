'use client';

import { useState } from 'react';
import { Day, Meal } from '@/lib/types';
import { ArrowLeftRight, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { meals as defaultMeals } from '@/lib/data/meals';
import { cn } from '@/lib/utils';

interface MealSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  day: Day;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  onSwap: (mealId: string) => void;
}

export function MealSwapModal({ isOpen, onClose, day, mealType, onSwap }: MealSwapModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const currentMeal = day.meals[mealType];

  // Filter meals by category
  const availableMeals = defaultMeals.filter(
    (meal) => 
      meal.category === mealType &&
      meal.id !== currentMeal.mealId &&
      (searchQuery === '' || 
        meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meal.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const handleSwap = (mealId: string) => {
    onSwap(mealId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="swap-modal-title"
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 id="swap-modal-title" className="text-lg font-semibold text-[#2D3436]">
              Maaltijd wisselen
            </h2>
            <p className="text-sm text-gray-500">
              {day.dayOfWeek === 'monday' && 'Maandag'}
              {day.dayOfWeek === 'tuesday' && 'Dinsdag'}
              {day.dayOfWeek === 'wednesday' && 'Woensdag'}
              {day.dayOfWeek === 'thursday' && 'Donderdag'}
              {day.dayOfWeek === 'friday' && 'Vrijdag'}
              {day.dayOfWeek === 'saturday' && 'Zaterdag'}
              {day.dayOfWeek === 'sunday' && 'Zondag'}
              {' - '}
              {mealType === 'breakfast' && 'Ontbijt'}
              {mealType === 'lunch' && 'Lunch'}
              {mealType === 'dinner' && 'Diner'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Sluiten"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Current meal */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Huidige maaltijd</p>
          <p className="font-medium text-[#2D3436]">{currentMeal.mealName}</p>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Zoek maaltijden..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90A4]"
            />
          </div>
        </div>

        {/* Meal list */}
        <div className="overflow-y-auto max-h-[300px] p-2">
          {availableMeals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Geen andere maaltijden gevonden
            </div>
          ) : (
            <div className="space-y-1">
              {availableMeals.map((meal) => (
                <button
                  key={meal.id}
                  onClick={() => handleSwap(meal.id)}
                  className="w-full p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <p className="font-medium text-[#2D3436]">{meal.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {meal.prepTime + meal.cookTime} min
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">
                      {meal.tags.slice(0, 2).map(tag => {
                        const tagLabels: Record<string, string> = {
                          'high-protein': 'Eiwitrijk',
                          'quick': 'Snel',
                          'kid-friendly': 'Kids',
                          'meal-prep': 'Prep',
                          'vegetarian': 'Veggie',
                          'budget': 'Budget',
                        };
                        return tagLabels[tag] || tag;
                      }).join(', ')}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <Button variant="outline" className="w-full" onClick={onClose}>
            Annuleren
          </Button>
        </div>
      </div>
    </div>
  );
}
