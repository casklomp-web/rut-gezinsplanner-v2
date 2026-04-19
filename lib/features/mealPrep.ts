/**
 * Meal Prep Utilities
 * Feature 2: Meal Prep Mode - Batch cooking planning, prep dag indicator, bewaartips
 */

import { Day, Week, Meal, MealInstance } from '@/lib/types';

export interface PrepPlan {
  prepDay: string;
  prepDayLabel: string;
  mealsToPrep: PrepMeal[];
  totalPrepTime: number;
  storageTips: StorageTip[];
}

export interface PrepMeal {
  mealId: string;
  mealName: string;
  servings: number;
  prepTime: number;
  cookTime: number;
  storageDays: number;
  storageMethod: 'fridge' | 'freezer';
  assignedDays: string[];
}

export interface StorageTip {
  mealId: string;
  mealName: string;
  method: 'fridge' | 'freezer';
  duration: number;
  tips: string[];
  reheatingInstructions: string;
}

export const PREP_DAY_OPTIONS = [
  { value: 'sunday', label: 'Zondag', shortLabel: 'Zo' },
  { value: 'saturday', label: 'Zaterdag', shortLabel: 'Za' },
  { value: 'monday', label: 'Maandag', shortLabel: 'Ma' },
  { value: 'wednesday', label: 'Woensdag', shortLabel: 'Wo' },
] as const;

export function identifyPrepFriendlyMeals(week: Week, mealsData: Map<string, Meal>): PrepMeal[] {
  const prepMeals: PrepMeal[] = [];
  const processedMeals = new Set<string>();

  week.days.forEach(day => {
    ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
      const mealInstance = day.meals[mealType as keyof Day['meals']] as MealInstance;
      if (!mealInstance || processedMeals.has(mealInstance.mealId)) return;

      const meal = mealsData.get(mealInstance.mealId);
      if (!meal || !meal.isPrepFriendly) return;

      // Find all days this meal appears
      const assignedDays = week.days
        .filter(d =>
          d.meals.breakfast.mealId === mealInstance.mealId ||
          d.meals.lunch.mealId === mealInstance.mealId ||
          d.meals.dinner.mealId === mealInstance.mealId
        )
        .map(d => d.dayOfWeek);

      prepMeals.push({
        mealId: meal.id,
        mealName: meal.name,
        servings: assignedDays.length * (meal.variants.family.portions || 1),
        prepTime: meal.prepTime,
        cookTime: meal.cookTime,
        storageDays: meal.keepsForDays,
        storageMethod: meal.keepsForDays > 4 ? 'freezer' : 'fridge',
        assignedDays,
      });

      processedMeals.add(mealInstance.mealId);
    });
  });

  return prepMeals;
}

export function generatePrepPlan(
  week: Week,
  mealsData: Map<string, Meal>,
  prepDayPreference: string = 'sunday'
): PrepPlan {
  const prepMeals = identifyPrepFriendlyMeals(week, mealsData);
  const totalPrepTime = prepMeals.reduce((sum, m) => sum + m.prepTime + m.cookTime, 0);

  const storageTips = prepMeals.map(meal => {
    const mealData = mealsData.get(meal.mealId);
    return generateStorageTip(meal, mealData);
  });

  const prepDayLabel = PREP_DAY_OPTIONS.find(o => o.value === prepDayPreference)?.label || 'Zondag';

  return {
    prepDay: prepDayPreference,
    prepDayLabel,
    mealsToPrep: prepMeals,
    totalPrepTime,
    storageTips,
  };
}

export function generateStorageTip(prepMeal: PrepMeal, meal?: Meal): StorageTip {
  const tips: string[] = [];
  let reheatingInstructions = '';

  if (prepMeal.storageMethod === 'fridge') {
    tips.push(`Bewaar maximaal ${prepMeal.storageDays} dagen in de koelkast`);
    tips.push('Bewaar in luchtdichte containers');
    tips.push('Laat volledig afkoelen voor opslag');
    reheatingInstructions = 'Verwarm 2-3 minuten in de magnetron of 10-15 minuten in de oven op 180°C';
  } else {
    tips.push(`Invriezen: bewaar maximaal ${prepMeal.storageDays} dagen`);
    tips.push('Gebruik vriezerbestendige containers of zakken');
    tips.push('Label met datum en inhoud');
    tips.push('Ontdooi een nacht van tevoren in de koelkast');
    reheatingInstructions = 'Ontdooi eerst, verwarm dan 3-4 minuten in de magnetron of 15-20 minuten in de oven op 180°C';
  }

  // Meal-specific tips
  if (meal?.tags.includes('high-protein')) {
    tips.push('Eiwitrijke maaltijden: voeg verse groenten toe bij opwarmen voor extra voedingswaarde');
  }

  return {
    mealId: prepMeal.mealId,
    mealName: prepMeal.mealName,
    method: prepMeal.storageMethod,
    duration: prepMeal.storageDays,
    tips,
    reheatingInstructions,
  };
}

export function getPrepDayForWeek(week: Week): Day | undefined {
  return week.days.find(d => d.isMealPrepDay);
}

export function setPrepDay(week: Week, dayOfWeek: string): Week {
  return {
    ...week,
    days: week.days.map(day => ({
      ...day,
      isMealPrepDay: day.dayOfWeek === dayOfWeek,
    })),
  };
}

export function calculateBatchSize(meal: Meal, daysPlanned: number): number {
  const basePortions = meal.variants.family.portions || 1;
  return basePortions * daysPlanned;
}

export function getPrepTimeEstimate(mealsToPrep: PrepMeal[]): {
  total: number;
  cooking: number;
  prep: number;
  parallel: number;
} {
  const total = mealsToPrep.reduce((sum, m) => sum + m.prepTime + m.cookTime, 0);
  const cooking = mealsToPrep.reduce((sum, m) => sum + m.cookTime, 0);
  const prep = mealsToPrep.reduce((sum, m) => sum + m.prepTime, 0);

  // Estimate parallel cooking time (assuming some overlap)
  const parallel = Math.round(total * 0.7);

  return { total, cooking, prep, parallel };
}

export function formatPrepTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0) {
    return `${hours}u ${mins}m`;
  }
  return `${mins}m`;
}

// Storage guidelines by food type
export const STORAGE_GUIDELINES: Record<string, { fridge: number; freezer: number; tips: string[] }> = {
  'poultry': {
    fridge: 3,
    freezer: 90,
    tips: ['Bewaar rauwe kip apart van andere voedingsmiddelen', 'Kook tot kern 75°C'],
  },
  'meat': {
    fridge: 3,
    freezer: 90,
    tips: ['Laat vlees rusten na koken', 'Snijd tegen de draad in voor malsheid'],
  },
  'fish': {
    fridge: 2,
    freezer: 60,
    tips: ['Vis het liefst vers eten', 'Ontdooi vis nooit op kamertemperatuur'],
  },
  'grains': {
    fridge: 5,
    freezer: 90,
    tips: ['Rijst af laten koelen voor opslag', 'Voeg een beetje water toe bij opwarmen'],
  },
  'vegetables': {
    fridge: 4,
    freezer: 90,
    tips: ['Bewaar groenten apart van sauzen', 'Herhaal groenten niet opwarmen'],
  },
  'soup': {
    fridge: 4,
    freezer: 90,
    tips: ['Soep snel afkoelen in koud water bad', 'Bewaar in porties'],
  },
};
