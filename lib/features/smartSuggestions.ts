/**
 * Smart Suggestions Utilities
 * Feature 3: AI suggesties op basis van voorkeuren, "Meer van dit", seizoensgebonden
 */

import { Meal, User, MealTag, Week } from '@/lib/types';

export interface Suggestion {
  id: string;
  type: 'similar' | 'seasonal' | 'preference' | 'trending' | 'quick';
  meal: Meal;
  reason: string;
  confidence: number; // 0-1
}

export interface UserPreferences {
  favoriteTags: MealTag[];
  dislikedTags: string[];
  preferredCategories: string[];
  maxPrepTime: number;
  dietary: string[];
}

// Seasonal ingredients by month (Northern Hemisphere)
export const SEASONAL_INGREDIENTS: Record<number, { produce: string[]; tags: string[] }> = {
  0: { // January
    produce: ['boerenkool', 'spruitjes', 'pastinaak', 'rode kool', 'witlof'],
    tags: ['winter', 'stew', 'comfort-food'],
  },
  1: { // February
    produce: ['boerenkool', 'spruitjes', 'pastinaak', 'rode kool'],
    tags: ['winter', 'stew', 'comfort-food'],
  },
  2: { // March
    produce: ['spinazie', 'radijs', 'lente-ui', 'asperges'],
    tags: ['spring', 'fresh', 'light'],
  },
  3: { // April
    produce: ['asperges', 'spinazie', 'radijs', 'lente-ui', 'tuinbonen'],
    tags: ['spring', 'fresh', 'light'],
  },
  4: { // May
    produce: ['asperges', 'aardbeien', 'tuinbonen', 'jonge aardappelen'],
    tags: ['spring', 'fresh', 'light'],
  },
  5: { // June
    produce: ['aardbeien', 'kersen', 'komkommer', 'tomaten', 'courgette'],
    tags: ['summer', 'bbq', 'salad'],
  },
  6: { // July
    produce: ['tomaten', 'courgette', 'aubergine', 'perziken', 'pruimen'],
    tags: ['summer', 'bbq', 'salad', 'light'],
  },
  7: { // August
    produce: ['tomaten', 'courgette', 'aubergine', 'pruimen', 'appels'],
    tags: ['summer', 'bbq', 'salad', 'light'],
  },
  8: { // September
    produce: ['pompoen', 'appels', 'peren', 'paddestoelen', 'druiven'],
    tags: ['autumn', 'comfort-food', 'warming'],
  },
  9: { // October
    produce: ['pompoen', 'paddestoelen', 'kastanjes', 'spruitjes'],
    tags: ['autumn', 'comfort-food', 'warming'],
  },
  10: { // November
    produce: ['spruitjes', 'pastinaak', 'boerenkool', 'witlof'],
    tags: ['autumn', 'winter', 'comfort-food'],
  },
  11: { // December
    produce: ['spruitjes', 'pastinaak', 'boerenkool', 'witlof'],
    tags: ['winter', 'comfort-food', 'holiday'],
  },
};

export function analyzeUserPreferences(
  user: User,
  mealHistory: Meal[],
  favoriteMealIds: string[]
): UserPreferences {
  const favoriteTags: MealTag[] = [];
  const tagCounts: Record<string, number> = {};

  // Count tags from favorite meals
  mealHistory.forEach(meal => {
    if (favoriteMealIds.includes(meal.id)) {
      meal.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });

  // Get top tags
  const sortedTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag]) => tag as MealTag);

  return {
    favoriteTags: sortedTags,
    dislikedTags: user.preferences.dislikes,
    preferredCategories: user.preferences.dietary,
    maxPrepTime: Math.max(
      user.preferences.maxPrepTime.breakfast,
      user.preferences.maxPrepTime.lunch,
      user.preferences.maxPrepTime.dinner
    ),
    dietary: user.preferences.dietary,
  };
}

export function generateSuggestions(
  allMeals: Meal[],
  userPreferences: UserPreferences,
  recentMealIds: string[],
  currentWeek?: Week
): Suggestion[] {
  const suggestions: Suggestion[] = [];
  const currentMonth = new Date().getMonth();

  // Filter out recently used meals
  const availableMeals = allMeals.filter(m => !recentMealIds.includes(m.id));

  // 1. Similar meals (based on favorite tags)
  userPreferences.favoriteTags.forEach(tag => {
    const similarMeals = availableMeals
      .filter(m => m.tags.includes(tag) && !recentMealIds.includes(m.id))
      .slice(0, 2);

    similarMeals.forEach(meal => {
      suggestions.push({
        id: `similar-${meal.id}`,
        type: 'similar',
        meal,
        reason: `Omdat je ${tag.replace('-', ' ')} maaltijden lekker vindt`,
        confidence: 0.8,
      });
    });
  });

  // 2. Seasonal suggestions
  const seasonalData = SEASONAL_INGREDIENTS[currentMonth];
  if (seasonalData) {
    const seasonalMeals = availableMeals.filter(meal => {
      const hasSeasonalIngredient = meal.ingredients.some(ing =>
        seasonalData.produce.some(si =>
          ing.name.toLowerCase().includes(si.toLowerCase())
        )
      );
      const hasSeasonalTag = meal.season?.some(s => {
        const seasonMap: Record<string, number[]> = {
          spring: [2, 3, 4],
          summer: [5, 6, 7],
          autumn: [8, 9, 10],
          winter: [11, 0, 1],
        };
        return seasonMap[s]?.includes(currentMonth);
      });
      return hasSeasonalIngredient || hasSeasonalTag;
    }).slice(0, 3);

    seasonalMeals.forEach(meal => {
      suggestions.push({
        id: `seasonal-${meal.id}`,
        type: 'seasonal',
        meal,
        reason: `Seizoensgebonden: perfect voor ${getMonthName(currentMonth)}`,
        confidence: 0.7,
      });
    });
  }

  // 3. Quick meals (if user has busy days)
  const quickMeals = availableMeals
    .filter(m => m.tags.includes('quick') || m.prepTime + m.cookTime <= 20)
    .slice(0, 2);

  quickMeals.forEach(meal => {
    suggestions.push({
      id: `quick-${meal.id}`,
      type: 'quick',
      meal,
      reason: 'Snel klaar - perfect voor drukke dagen',
      confidence: 0.6,
    });
  });

  // 4. Preference-based suggestions
  if (userPreferences.dietary.includes('vegetarian')) {
    const vegetarianMeals = availableMeals
      .filter(m => m.tags.includes('vegetarian'))
      .slice(0, 2);

    vegetarianMeals.forEach(meal => {
      suggestions.push({
        id: `pref-${meal.id}`,
        type: 'preference',
        meal,
        reason: 'Past bij je vegetarische voorkeur',
        confidence: 0.75,
      });
    });
  }

  // Remove duplicates and sort by confidence
  const uniqueSuggestions = Array.from(
    new Map(suggestions.map(s => [s.meal.id, s])).values()
  );

  return uniqueSuggestions
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 8);
}

export function getMoreLikeThis(
  meal: Meal,
  allMeals: Meal[],
  limit: number = 3
): Meal[] {
  // Score each meal based on similarity
  const scoredMeals = allMeals
    .filter(m => m.id !== meal.id)
    .map(m => {
      let score = 0;

      // Tag overlap
      const commonTags = m.tags.filter(t => meal.tags.includes(t));
      score += commonTags.length * 2;

      // Same category
      if (m.category === meal.category) score += 3;

      // Similar prep time (within 10 min)
      if (Math.abs(m.prepTime - meal.prepTime) <= 10) score += 1;

      // Similar nutrition profile
      const calorieDiff = Math.abs(m.nutrition.calories - meal.nutrition.calories);
      if (calorieDiff < 100) score += 2;

      // Ingredient overlap
      const commonIngredients = m.ingredients.filter(mi =>
        meal.ingredients.some(oi => oi.ingredientId === mi.ingredientId)
      );
      score += commonIngredients.length;

      return { meal: m, score };
    });

  return scoredMeals
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.meal);
}

export function getTrendingMeals(
  allMeals: Meal[],
  usageCounts: Record<string, number>,
  limit: number = 3
): Meal[] {
  return allMeals
    .map(m => ({ meal: m, count: usageCounts[m.id] || 0 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map(s => s.meal);
}

function getMonthName(month: number): string {
  const months = [
    'januari', 'februari', 'maart', 'april', 'mei', 'juni',
    'juli', 'augustus', 'september', 'oktober', 'november', 'december',
  ];
  return months[month];
}

// Smart search with fuzzy matching
export function smartSearchMeals(
  meals: Meal[],
  query: string,
  userPreferences?: UserPreferences
): Meal[] {
  const lowerQuery = query.toLowerCase();
  const queryWords = lowerQuery.split(' ').filter(w => w.length > 2);

  return meals
    .map(meal => {
      let score = 0;

      // Exact name match
      if (meal.name.toLowerCase().includes(lowerQuery)) score += 10;

      // Word matches in name
      queryWords.forEach(word => {
        if (meal.name.toLowerCase().includes(word)) score += 5;
      });

      // Ingredient matches
      meal.ingredients.forEach(ing => {
        if (ing.name.toLowerCase().includes(lowerQuery)) score += 3;
        queryWords.forEach(word => {
          if (ing.name.toLowerCase().includes(word)) score += 2;
        });
      });

      // Tag matches
      meal.tags.forEach(tag => {
        if (tag.toLowerCase().includes(lowerQuery)) score += 4;
      });

      // Boost based on user preferences
      if (userPreferences) {
        // Boost meals matching favorite tags
        const matchingTags = meal.tags.filter(t =>
          userPreferences.favoriteTags.includes(t)
        );
        score += matchingTags.length * 2;

        // Penalize meals with disliked ingredients
        const hasDisliked = meal.ingredients.some(ing =>
          userPreferences.dislikedTags.some(d =>
            ing.name.toLowerCase().includes(d.toLowerCase())
          )
        );
        if (hasDisliked) score -= 5;
      }

      return { meal, score };
    })
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(s => s.meal);
}
