/**
 * Nutrition Info Utilities
 * Feature 5: Nutrition Info - Calorieën, macro's, dagelijkse overzichten
 */

import { Meal, MealInstance, Day, Week } from '@/lib/types';

export interface NutritionTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

export interface DailyNutrition {
  date: string;
  dayOfWeek: string;
  totals: NutritionTotals;
  meals: {
    breakfast: NutritionTotals;
    lunch: NutritionTotals;
    dinner: NutritionTotals;
    snacks: NutritionTotals;
  };
  target?: NutritionTotals;
  percentage: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface WeeklyNutrition {
  weekId: string;
  daily: DailyNutrition[];
  average: NutritionTotals;
  total: NutritionTotals;
  target: NutritionTotals;
  adherence: number; // percentage of days within target
}

const DEFAULT_TARGETS: NutritionTotals = {
  calories: 2000,
  protein: 150,
  carbs: 200,
  fat: 65,
};

export function calculateMealNutrition(meal: Meal | undefined, portions: number = 1): NutritionTotals {
  if (!meal) {
    return { calories: 0, protein: 0, carbs: 0, fat: 0 };
  }

  const multiplier = portions / (meal.variants.family.portions || 1);

  return {
    calories: Math.round(meal.nutrition.calories * multiplier),
    protein: Math.round(meal.nutrition.protein * multiplier),
    carbs: Math.round(meal.nutrition.carbs * multiplier),
    fat: Math.round(meal.nutrition.fat * multiplier),
  };
}

export function calculateDailyNutrition(
  day: Day,
  mealsData: Map<string, Meal>,
  targets: NutritionTotals = DEFAULT_TARGETS
): DailyNutrition {
  const breakfast = calculateMealNutrition(
    mealsData.get(day.meals.breakfast.mealId),
    day.meals.breakfast.portions
  );
  const lunch = calculateMealNutrition(
    mealsData.get(day.meals.lunch.mealId),
    day.meals.lunch.portions
  );
  const dinner = calculateMealNutrition(
    mealsData.get(day.meals.dinner.mealId),
    day.meals.dinner.portions
  );

  // Snacks (simplified - would need snack data)
  const snacks: NutritionTotals = { calories: 0, protein: 0, carbs: 0, fat: 0 };

  const totals: NutritionTotals = {
    calories: breakfast.calories + lunch.calories + dinner.calories + snacks.calories,
    protein: breakfast.protein + lunch.protein + dinner.protein + snacks.protein,
    carbs: breakfast.carbs + lunch.carbs + dinner.carbs + snacks.carbs,
    fat: breakfast.fat + lunch.fat + dinner.fat + snacks.fat,
  };

  return {
    date: day.date,
    dayOfWeek: day.dayOfWeek,
    totals,
    meals: { breakfast, lunch, dinner, snacks },
    target: targets,
    percentage: {
      calories: Math.round((totals.calories / targets.calories) * 100),
      protein: Math.round((totals.protein / targets.protein) * 100),
      carbs: Math.round((totals.carbs / targets.carbs) * 100),
      fat: Math.round((totals.fat / targets.fat) * 100),
    },
  };
}

export function calculateWeeklyNutrition(
  week: Week,
  mealsData: Map<string, Meal>,
  targets: NutritionTotals = DEFAULT_TARGETS
): WeeklyNutrition {
  const daily = week.days.map(day => calculateDailyNutrition(day, mealsData, targets));

  const total: NutritionTotals = daily.reduce(
    (acc, day) => ({
      calories: acc.calories + day.totals.calories,
      protein: acc.protein + day.totals.protein,
      carbs: acc.carbs + day.totals.carbs,
      fat: acc.fat + day.totals.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const daysCount = week.days.length || 1;
  const average: NutritionTotals = {
    calories: Math.round(total.calories / daysCount),
    protein: Math.round(total.protein / daysCount),
    carbs: Math.round(total.carbs / daysCount),
    fat: Math.round(total.fat / daysCount),
  };

  // Calculate adherence (days within 10% of calorie target)
  const daysWithinTarget = daily.filter(
    day => Math.abs(day.percentage.calories - 100) <= 10
  ).length;
  const adherence = Math.round((daysWithinTarget / daysCount) * 100);

  return {
    weekId: week.id,
    daily,
    average,
    total,
    target: targets,
    adherence,
  };
}

export function getNutritionGrade(percentage: number): {
  grade: 'A' | 'B' | 'C' | 'D';
  color: string;
  message: string;
} {
  if (percentage >= 90 && percentage <= 110) {
    return { grade: 'A', color: '#7CB342', message: 'Perfect!' };
  }
  if (percentage >= 80 && percentage <= 120) {
    return { grade: 'B', color: '#4A90A4', message: 'Goed' };
  }
  if (percentage >= 70 && percentage <= 130) {
    return { grade: 'C', color: '#F5A623', message: 'Acceptabel' };
  }
  return { grade: 'D', color: '#E74C3C', message: 'Aandacht nodig' };
}

export function formatMacroPercentage(value: number, total: number): string {
  if (total === 0) return '0%';
  return `${Math.round((value / total) * 100)}%`;
}

// Calorie per macro calculations
export function calculateMacroCalories(protein: number, carbs: number, fat: number): {
  proteinCals: number;
  carbsCals: number;
  fatCals: number;
  total: number;
} {
  return {
    proteinCals: protein * 4,
    carbsCals: carbs * 4,
    fatCals: fat * 9,
    total: protein * 4 + carbs * 4 + fat * 9,
  };
}
