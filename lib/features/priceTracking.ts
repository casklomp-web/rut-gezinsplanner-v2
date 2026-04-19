/**
 * Price Tracking Utilities
 * Feature 4: Ingrediënt prijzen bijhouden, goedkoopste supermarkt, budget overzicht
 */

import { Ingredient, Store, Week, ShoppingList, ShoppingItem } from '@/lib/types';

export interface PriceEntry {
  ingredientId: string;
  store: Store;
  price: number;
  unit: string;
  date: string;
  isOffer: boolean;
}

export interface StorePriceComparison {
  store: Store;
  totalPrice: number;
  itemCount: number;
  savings: number; // compared to most expensive
  unavailable: string[]; // ingredient IDs not available
}

export interface BudgetOverview {
  weekId: string;
  estimatedTotal: number;
  actualTotal: number;
  savings: number;
  byCategory: Record<string, { estimated: number; actual: number }>;
  byStore: Record<string, { estimated: number; actual: number }>;
}

// Default prices per store (fallback)
export const DEFAULT_STORE_MULTIPLIERS: Record<Store, number> = {
  'aldi': 0.85,
  'lidl': 0.85,
  'ah': 1.0,
  'jumbo': 0.95,
  'dirk': 0.90,
  'market': 0.80,
  'other': 1.0,
};

export const STORE_NAMES: Record<Store, string> = {
  'aldi': 'Aldi',
  'lidl': 'Lidl',
  'ah': 'Albert Heijn',
  'jumbo': 'Jumbo',
  'dirk': 'Dirk',
  'market': 'Markt',
  'other': 'Overig',
};

export function calculateItemPrice(
  item: ShoppingItem,
  store: Store,
  priceHistory: PriceEntry[]
): number {
  // Find most recent price for this ingredient at this store
  const relevantPrices = priceHistory
    .filter(p => p.ingredientId === item.ingredientId && p.store === store)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (relevantPrices.length > 0) {
    const pricePerUnit = relevantPrices[0].price;
    return pricePerUnit * item.amount;
  }

  // Fallback to estimated price with store multiplier
  const multiplier = DEFAULT_STORE_MULTIPLIERS[store] || 1;
  return item.estimatedPrice * multiplier;
}

export function compareStorePrices(
  shoppingList: ShoppingList,
  priceHistory: PriceEntry[]
): StorePriceComparison[] {
  const stores: Store[] = ['aldi', 'lidl', 'ah', 'jumbo', 'dirk', 'market'];
  
  const comparisons = stores.map(store => {
    let totalPrice = 0;
    let itemCount = 0;
    const unavailable: string[] = [];

    shoppingList.byStore.forEach(storeSection => {
      storeSection.categories.forEach(category => {
        category.items.forEach(item => {
          const price = calculateItemPrice(item, store, priceHistory);
          if (price > 0) {
            totalPrice += price;
            itemCount++;
          } else {
            unavailable.push(item.ingredientId);
          }
        });
      });
    });

    return {
      store,
      totalPrice,
      itemCount,
      savings: 0, // Will be calculated after
      unavailable,
    };
  });

  // Calculate savings relative to most expensive
  const maxPrice = Math.max(...comparisons.map(c => c.totalPrice));
  return comparisons.map(c => ({
    ...c,
    savings: maxPrice - c.totalPrice,
  })).sort((a, b) => a.totalPrice - b.totalPrice);
}

export function getCheapestStore(
  shoppingList: ShoppingList,
  priceHistory: PriceEntry[]
): StorePriceComparison | null {
  const comparisons = compareStorePrices(shoppingList, priceHistory);
  return comparisons[0] || null;
}

export function calculateBudgetOverview(
  week: Week,
  priceHistory: PriceEntry[],
  actualSpending?: Record<string, number>
): BudgetOverview {
  const shoppingList = week.shoppingList;
  if (!shoppingList) {
    return {
      weekId: week.id,
      estimatedTotal: 0,
      actualTotal: 0,
      savings: 0,
      byCategory: {},
      byStore: {},
    };
  }

  // Calculate estimated total (using cheapest store prices)
  const cheapestStore = getCheapestStore(shoppingList, priceHistory);
  const estimatedTotal = cheapestStore?.totalPrice || shoppingList.estimatedTotal;

  // Calculate actual total
  const actualTotal = actualSpending
    ? Object.values(actualSpending).reduce((sum, val) => sum + val, 0)
    : estimatedTotal;

  // Calculate by category
  const byCategory: Record<string, { estimated: number; actual: number }> = {};
  shoppingList.byStore.forEach(storeSection => {
    storeSection.categories.forEach(category => {
      const categoryItems = category.items;
      const estimated = categoryItems.reduce((sum, item) => 
        sum + calculateItemPrice(item, cheapestStore?.store || 'ah', priceHistory), 0
      );
      
      byCategory[category.category] = {
        estimated: (byCategory[category.category]?.estimated || 0) + estimated,
        actual: (byCategory[category.category]?.actual || 0) + estimated, // Same as estimated until actual tracked
      };
    });
  });

  // Calculate by store
  const byStore: Record<string, { estimated: number; actual: number }> = {};
  const storeComparisons = compareStorePrices(shoppingList, priceHistory);
  storeComparisons.forEach(comp => {
    byStore[comp.store] = {
      estimated: comp.totalPrice,
      actual: comp.totalPrice,
    };
  });

  return {
    weekId: week.id,
    estimatedTotal,
    actualTotal,
    savings: estimatedTotal - actualTotal,
    byCategory,
    byStore,
  };
}

export function trackPrice(
  ingredientId: string,
  store: Store,
  price: number,
  unit: string,
  isOffer: boolean = false
): PriceEntry {
  return {
    ingredientId,
    store,
    price,
    unit,
    date: new Date().toISOString(),
    isOffer,
  };
}

export function getPriceHistory(
  ingredientId: string,
  priceHistory: PriceEntry[]
): PriceEntry[] {
  return priceHistory
    .filter(p => p.ingredientId === ingredientId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPriceTrend(
  ingredientId: string,
  priceHistory: PriceEntry[]
): 'up' | 'down' | 'stable' {
  const history = getPriceHistory(ingredientId, priceHistory);
  if (history.length < 2) return 'stable';

  const recent = history[0].price;
  const previous = history[1].price;
  const change = (recent - previous) / previous;

  if (change > 0.1) return 'up';
  if (change < -0.1) return 'down';
  return 'stable';
}

export function findBestDeals(
  priceHistory: PriceEntry[],
  shoppingList?: ShoppingList
): PriceEntry[] {
  const deals = priceHistory.filter(p => p.isOffer);
  
  if (!shoppingList) {
    return deals.slice(0, 10);
  }

  // Prioritize deals for items on the shopping list
  const listItemIds = new Set(
    shoppingList.byStore.flatMap(s =>
      s.categories.flatMap(c => c.items.map(i => i.ingredientId))
    )
  );

  return deals
    .sort((a, b) => {
      const aOnList = listItemIds.has(a.ingredientId) ? 1 : 0;
      const bOnList = listItemIds.has(b.ingredientId) ? 1 : 0;
      return bOnList - aOnList;
    })
    .slice(0, 10);
}

export function formatPrice(price: number): string {
  return `€${price.toFixed(2)}`;
}

export function calculateSavingsPercentage(estimated: number, actual: number): number {
  if (estimated === 0) return 0;
  return Math.round(((estimated - actual) / estimated) * 100);
}
