/**
 * Week Generator Logic
 * Genereert een gebalanceerde week op basis van regels
 */

import { Week, Day, MealInstance, DayOfWeek, User } from "@/lib/types";
import { meals, getMealsByCategory } from "@/lib/data/meals";
import { format, addDays, startOfWeek, getWeek } from "date-fns";
import { nl } from "date-fns/locale";

// Helper: willekeurig item uit array
function random<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Helper: filter maaltijden die passen bij criteria
function filterMeals(
  category: "breakfast" | "lunch" | "dinner",
  excludeIds: string[] = [],
  requireTags: string[] = [],
  maxPrepTime?: number
) {
  let filtered = getMealsByCategory(category).filter(m => !excludeIds.includes(m.id));
  
  if (requireTags.length > 0) {
    filtered = filtered.filter(m => requireTags.some(tag => m.tags.includes(tag as any)));
  }
  
  if (maxPrepTime) {
    filtered = filtered.filter(m => m.prepTime + m.cookTime <= maxPrepTime);
  }
  
  // Fallback: als er niets over is, gebruik favorites
  if (filtered.length === 0) {
    filtered = getMealsByCategory(category).filter(m => m.isFavorite);
  }
  
  return filtered;
}

// Genereer één dag
function generateDay(
  date: Date,
  dayOfWeek: DayOfWeek,
  isTrainingDay: boolean,
  user: User,
  previousDay?: Day
): Day {
  const dayId = `day_${format(date, "yyyy-MM-dd")}`;
  
  // Bepaal welke maaltijden we al hebben gehad (voor variatie)
  const usedMealIds: string[] = [];
  
  // Ontbijt
  const breakfastOptions = filterMeals("breakfast", usedMealIds, ["quick"]);
  const breakfastMeal = random(breakfastOptions);
  usedMealIds.push(breakfastMeal.id);
  
  // Lunch - check of we restjes hebben van gisteren
  let lunchMeal;
  let isLeftoverLunch = false;
  
  // Check of gisteren's diner geschikt is voor meal prep
  const previousDinnerMeal = previousDay 
    ? meals.find(m => m.id === previousDay.meals.dinner.mealId)
    : undefined;
  
  if (previousDinnerMeal?.isPrepFriendly && previousDay!.meals.dinner.portions >= 4) {
    // Gebruik gisteren's diner als lunch
    lunchMeal = previousDinnerMeal;
    isLeftoverLunch = true;
  } else {
    const lunchOptions = filterMeals("lunch", usedMealIds, ["quick"]);
    lunchMeal = random(lunchOptions);
    usedMealIds.push(lunchMeal.id);
  }
  
  // Diner - op trainingsdag meer eiwit
  const dinnerTags = isTrainingDay ? ["high-protein"] : [];
  const dinnerOptions = filterMeals("dinner", usedMealIds, dinnerTags, 15);
  const dinnerMeal = random(dinnerOptions);
  
  // Maak meal instances
  const breakfastInstance: MealInstance = {
    id: `mi_${dayId}_breakfast`,
    mealId: breakfastMeal.id,
    mealName: breakfastMeal.name,
    variant: "family",
    portions: 3,
    completed: false,
    isLeftover: false,
    isModified: false
  };
  
  const lunchInstance: MealInstance = {
    id: `mi_${dayId}_lunch`,
    mealId: lunchMeal.id,
    mealName: lunchMeal.name,
    variant: "family",
    portions: 3,
    completed: false,
    isLeftover: isLeftoverLunch,
    fromPrepDay: isLeftoverLunch ? previousDay?.date : undefined,
    isModified: false
  };
  
  const dinnerInstance: MealInstance = {
    id: `mi_${dayId}_dinner`,
    mealId: dinnerMeal.id,
    mealName: dinnerMeal.name,
    variant: "family",
    portions: dinnerMeal.isPrepFriendly ? 4 : 3,
    completed: false,
    isLeftover: false,
    isModified: false
  };
  
  return {
    id: dayId,
    date: format(date, "yyyy-MM-dd"),
    dayOfWeek,
    meals: {
      breakfast: breakfastInstance,
      lunch: lunchInstance,
      dinner: dinnerInstance,
      snacks: []
    },
    training: isTrainingDay ? {
      scheduled: true,
      time: "19:00",
      description: "Small group training",
      completed: false
    } : undefined,
    checkins: {
      breakfast: false,
      lunch: false,
      dinner: false,
      training: false,
      walking: false,
      medication: false,
      sleepRoutine: false
    },
    isTrainingDay,
    isMealPrepDay: dinnerMeal.isPrepFriendly,
    isLeftoverDay: isLeftoverLunch,
    notes: ""
  };
}

// Hoofd functie: genereer complete week
export function generateWeek(
  startDate: Date = new Date(),
  user: User
): Week {
  const weekStart = startOfWeek(startDate, { weekStartsOn: 1 }); // Maandag start
  const weekNumber = getWeek(weekStart, { weekStartsOn: 1 });
  const year = weekStart.getFullYear();
  
  const days: Day[] = [];
  const dayNames: DayOfWeek[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  
  for (let i = 0; i < 7; i++) {
    const date = addDays(weekStart, i);
    const dayOfWeek = dayNames[i];
    const isTrainingDay = user.schedule.trainingDays.includes(dayOfWeek);
    const previousDay = i > 0 ? days[i - 1] : undefined;
    
    const day = generateDay(date, dayOfWeek, isTrainingDay, user, previousDay);
    days.push(day);
  }
  
  // Bereken stats
  const trainingDays = days.filter(d => d.isTrainingDay).length;
  const prepMoments = days.filter(d => d.isMealPrepDay).length;
  
  return {
    id: `week_${year}_${weekNumber}`,
    weekNumber,
    year,
    startDate: format(weekStart, "yyyy-MM-dd"),
    endDate: format(addDays(weekStart, 6), "yyyy-MM-dd"),
    days,
    isGenerated: true,
    isLocked: false,
    stats: {
      mealsPlanned: 21,
      trainingDays,
      estimatedCost: 0, // Wordt later berekend
      prepMoments
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

// Wissel een maaltijd
export function swapMeal(
  day: Day,
  mealType: "breakfast" | "lunch" | "dinner",
  newMealId: string
): Day {
  const meal = meals.find(m => m.id === newMealId);
  if (!meal) return day;
  
  const newInstance: MealInstance = {
    id: `mi_${day.id}_${mealType}_${Date.now()}`,
    mealId: meal.id,
    mealName: meal.name,
    variant: "family",
    portions: meal.isPrepFriendly ? 4 : 3,
    completed: false,
    isLeftover: false,
    isModified: true
  };
  
  return {
    ...day,
    meals: {
      ...day.meals,
      [mealType]: newInstance
    },
    isMealPrepDay: mealType === "dinner" ? meal.isPrepFriendly : day.isMealPrepDay
  };
}

// Krijg alternatieven voor een maaltijd
export function getMealAlternatives(
  currentMealId: string,
  category: "breakfast" | "lunch" | "dinner",
  isTrainingDay: boolean
): typeof meals {
  const requireTags = isTrainingDay && category === "dinner" ? ["high-protein"] : [];
  return filterMeals(category, [currentMealId], requireTags);
}
