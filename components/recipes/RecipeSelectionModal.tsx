'use client';

import { useState, useMemo, useEffect } from 'react';
import { X, Search, ChevronRight, Utensils, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { meals as defaultMeals } from '@/lib/data/meals';
import { useWeekStore } from '@/lib/store/weekStore';
import { DayOfWeek, Meal, MealType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface RecipeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedDayId?: string;
  preselectedMealType?: MealType;
}

type Step = 'select-recipe' | 'select-day-meal';

const DAYS_OF_WEEK: { id: DayOfWeek; label: string; shortLabel: string }[] = [
  { id: 'monday', label: 'Maandag', shortLabel: 'Ma' },
  { id: 'tuesday', label: 'Dinsdag', shortLabel: 'Di' },
  { id: 'wednesday', label: 'Woensdag', shortLabel: 'Wo' },
  { id: 'thursday', label: 'Donderdag', shortLabel: 'Do' },
  { id: 'friday', label: 'Vrijdag', shortLabel: 'Vr' },
  { id: 'saturday', label: 'Zaterdag', shortLabel: 'Za' },
  { id: 'sunday', label: 'Zondag', shortLabel: 'Zo' },
];

const MEAL_TYPES: { id: MealType; label: string; icon: string }[] = [
  { id: 'breakfast', label: 'Ontbijt', icon: '🍳' },
  { id: 'lunch', label: 'Lunch', icon: '🥪' },
  { id: 'dinner', label: 'Diner', icon: '🍽️' },
];

export function RecipeSelectionModal({
  isOpen,
  onClose,
  preselectedDayId,
  preselectedMealType,
}: RecipeSelectionModalProps) {
  const [step, setStep] = useState<Step>('select-recipe');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Meal | null>(null);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<MealType | null>(
    preselectedMealType || null
  );

  // Get dayOfWeek from preselectedDayId
  const getDayOfWeekFromId = (dayId: string | undefined): DayOfWeek | null => {
    if (!dayId || !currentWeek) return null;
    const day = currentWeek.days.find(d => d.id === dayId);
    return day?.dayOfWeek || null;
  };

  const { currentWeek, swapMeal } = useWeekStore();

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Filter recipes based on search query
  const filteredRecipes = useMemo(() => {
    if (!searchQuery.trim()) return defaultMeals;
    
    const query = searchQuery.toLowerCase();
    return defaultMeals.filter(
      (meal) =>
        meal.name.toLowerCase().includes(query) ||
        meal.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        meal.ingredients.some((ing) => ing.name.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  // Group recipes by category
  const groupedRecipes = useMemo(() => {
    const groups: Record<string, Meal[]> = {
      breakfast: [],
      lunch: [],
      dinner: [],
    };
    
    filteredRecipes.forEach((meal) => {
      if (groups[meal.category]) {
        groups[meal.category].push(meal);
      }
    });
    
    return groups;
  }, [filteredRecipes]);

  const handleRecipeSelect = (recipe: Meal) => {
    setSelectedRecipe(recipe);

    // If both day and meal type are preselected, assign immediately
    if (preselectedDayId && preselectedMealType) {
      handleAssign(recipe.id, preselectedDayId, preselectedMealType);
    } else {
      // If only day is preselected, set it
      if (preselectedDayId) {
        const dayOfWeek = getDayOfWeekFromId(preselectedDayId);
        setSelectedDay(dayOfWeek);
      }
      setStep('select-day-meal');
    }
  };

  const handleAssign = (
    recipeId: string,
    dayId: string,
    mealType: MealType
  ) => {
    swapMeal(dayId, mealType, recipeId);
    handleClose();
  };

  const handleClose = () => {
    setStep('select-recipe');
    setSearchQuery('');
    setSelectedRecipe(null);
    setSelectedDay(null);
    setSelectedMealType(preselectedMealType || null);
    onClose();
  };

  const getDayIdFromDayOfWeek = (dayOfWeek: DayOfWeek): string | undefined => {
    if (!currentWeek) return undefined;
    const day = currentWeek.days.find((d) => d.dayOfWeek === dayOfWeek);
    return day?.id;
  };

  const canAssign = selectedDay && selectedMealType;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="recipe-modal-title"
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-3">
            {step === 'select-day-meal' && (
              <button
                onClick={() => setStep('select-recipe')}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Terug"
              >
                <ChevronRight className="w-5 h-5 text-gray-500 rotate-180" />
              </button>
            )}
            <div>
              <h2
                id="recipe-modal-title"
                className="text-lg font-semibold text-[#2D3436]"
              >
                {step === 'select-recipe'
                  ? 'Kies een recept'
                  : 'Wijs toe aan'}
              </h2>
              {step === 'select-day-meal' && selectedRecipe && (
                <p className="text-sm text-gray-500">{selectedRecipe.name}</p>
              )}
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Sluiten"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Step 1: Recipe Selection */}
        {step === 'select-recipe' && (
          <>
            {/* Search */}
            <div className="p-4 border-b border-gray-200 shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Zoek recepten..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90A4]"
                />
              </div>
            </div>

            {/* Recipe List */}
            <div className="overflow-y-auto flex-1 p-2">
              {filteredRecipes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Geen recepten gevonden
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Breakfast */}
                  {groupedRecipes.breakfast.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 py-1">
                        Ontbijt
                      </h3>
                      <div className="space-y-1">
                        {groupedRecipes.breakfast.map((meal) => (
                          <RecipeCard
                            key={meal.id}
                            meal={meal}
                            onClick={() => handleRecipeSelect(meal)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Lunch */}
                  {groupedRecipes.lunch.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 py-1">
                        Lunch
                      </h3>
                      <div className="space-y-1">
                        {groupedRecipes.lunch.map((meal) => (
                          <RecipeCard
                            key={meal.id}
                            meal={meal}
                            onClick={() => handleRecipeSelect(meal)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dinner */}
                  {groupedRecipes.dinner.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 py-1">
                        Diner
                      </h3>
                      <div className="space-y-1">
                        {groupedRecipes.dinner.map((meal) => (
                          <RecipeCard
                            key={meal.id}
                            meal={meal}
                            onClick={() => handleRecipeSelect(meal)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* Step 2: Day & Meal Selection */}
        {step === 'select-day-meal' && (
          <div className="overflow-y-auto flex-1 p-4 space-y-6">
            {/* Day Selection */}
            {!preselectedDayId && (
              <div>
                <h3 className="text-sm font-medium text-[#2D3436] mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#4A90A4]" />
                  Kies een dag
                </h3>
                <div className="grid grid-cols-7 gap-1">
                  {DAYS_OF_WEEK.map((day) => (
                    <button
                      key={day.id}
                      onClick={() => setSelectedDay(day.id)}
                      className={cn(
                        'p-2 rounded-lg text-center transition-colors',
                        selectedDay === day.id
                          ? 'bg-[#4A90A4] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      )}
                    >
                      <span className="text-xs font-medium">
                        {day.shortLabel}
                      </span>
                    </button>
                  ))}
                </div>
                {selectedDay && (
                  <p className="text-sm text-gray-600 mt-2 text-center">
                    {
                      DAYS_OF_WEEK.find((d) => d.id === selectedDay)?.label
                    }
                  </p>
                )}
              </div>
            )}

            {/* Preselected day display */}
            {preselectedDayId && (
              <div>
                <h3 className="text-sm font-medium text-[#2D3436] mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#4A90A4]" />
                  Dag
                </h3>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    {DAYS_OF_WEEK.find((d) => d.id === preselectedDayId)
                      ?.label || preselectedDayId}
                  </p>
                </div>
              </div>
            )}

            {/* Meal Type Selection */}
            {!preselectedMealType && (
              <div>
                <h3 className="text-sm font-medium text-[#2D3436] mb-3 flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-[#4A90A4]" />
                  Kies een maaltijd
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {MEAL_TYPES.map((mealType) => (
                    <button
                      key={mealType.id}
                      onClick={() => setSelectedMealType(mealType.id)}
                      className={cn(
                        'p-3 rounded-xl border-2 text-center transition-colors',
                        selectedMealType === mealType.id
                          ? 'border-[#4A90A4] bg-[#4A90A4]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <span className="text-2xl mb-1 block">
                        {mealType.icon}
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {mealType.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Preselected meal type display */}
            {preselectedMealType && (
              <div>
                <h3 className="text-sm font-medium text-[#2D3436] mb-2 flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-[#4A90A4]" />
                  Maaltijd
                </h3>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    {
                      MEAL_TYPES.find((m) => m.id === preselectedMealType)
                        ?.label
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        {step === 'select-day-meal' && (
          <div className="p-4 border-t border-gray-200 shrink-0 space-y-2">
            <Button
              className="w-full"
              disabled={!canAssign && !(preselectedDayId && selectedMealType)}
              onClick={() => {
                if (selectedRecipe && selectedMealType) {
                  // Use preselectedDayId if available, otherwise get from selectedDay
                  const dayId = preselectedDayId || (selectedDay ? getDayIdFromDayOfWeek(selectedDay) : null);
                  if (dayId) {
                    handleAssign(
                      selectedRecipe.id,
                      dayId,
                      selectedMealType
                    );
                  }
                }
              }}
            >
              Toewijzen
            </Button>
            <Button variant="outline" className="w-full" onClick={handleClose}>
              Annuleren
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Recipe Card Component
interface RecipeCardProps {
  meal: Meal;
  onClick: () => void;
}

function RecipeCard({ meal, onClick }: RecipeCardProps) {
  const tagLabels: Record<string, string> = {
    'high-protein': 'Eiwitrijk',
    quick: 'Snel',
    'ultra-quick': 'Supersnel',
    'kid-friendly': 'Kids',
    'meal-prep': 'Prep',
    vegetarian: 'Veggie',
    budget: 'Budget',
    'one-pan': 'One-pan',
    'no-cook': 'Geen koken',
    'freezer-friendly': 'Diepvries',
  };

  return (
    <button
      onClick={onClick}
      className="w-full p-3 rounded-lg hover:bg-gray-50 transition-colors text-left border border-transparent hover:border-gray-200"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="font-medium text-[#2D3436]">{meal.name}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-xs text-gray-500">
              {meal.prepTime + meal.cookTime} min
            </span>
            {meal.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded"
              >
                {tagLabels[tag] || tag}
              </span>
            ))}
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
      </div>
    </button>
  );
}
