'use client';

import { useState, useMemo } from 'react';
import {
  Euro,
  TrendingDown,
  TrendingUp,
  Minus,
  Store,
  ShoppingCart,
  PieChart,
  ChevronDown,
  ChevronUp,
  Tag,
  AlertCircle,
} from 'lucide-react';
import {
  compareStorePrices,
  calculateBudgetOverview,
  getCheapestStore,
  formatPrice,
  calculateSavingsPercentage,
  STORE_NAMES,
  PriceEntry,
} from '@/lib/features/priceTracking';
import { Week, ShoppingList } from '@/lib/types';
import { cn } from '@/lib/utils';

interface PriceComparisonProps {
  week: Week;
  priceHistory: PriceEntry[];
  className?: string;
}

export function PriceComparison({ week, priceHistory, className }: PriceComparisonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedStore, setSelectedStore] = useState<string | null>(null);

  const comparisons = useMemo(() => {
    if (!week.shoppingList) return [];
    return compareStorePrices(week.shoppingList, priceHistory);
  }, [week.shoppingList, priceHistory]);

  const cheapestStore = comparisons[0];
  const budget = useMemo(() => 
    calculateBudgetOverview(week, priceHistory),
    [week, priceHistory]
  );

  if (!week.shoppingList || comparisons.length === 0) {
    return null;
  }

  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden', className)}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
            <Euro className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Prijsvergelijking</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {cheapestStore && `Beste keuze: ${STORE_NAMES[cheapestStore.store]}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {cheapestStore && (
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              Goedkoopste: {formatPrice(cheapestStore.totalPrice)}
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Store Comparison */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Supermarkt vergelijking</h4>
            <div className="space-y-2">
              {comparisons.map((comp, index) => (
                <div
                  key={comp.store}
                  onClick={() => setSelectedStore(selectedStore === comp.store ? null : comp.store)}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors',
                    index === 0
                      ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                      : 'bg-gray-50 dark:bg-gray-700',
                    selectedStore === comp.store && 'ring-2 ring-[#4A90A4]'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                      index === 0
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                    )}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        {STORE_NAMES[comp.store]}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {comp.itemCount} items
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800 dark:text-gray-200">
                      {formatPrice(comp.totalPrice)}
                    </p>
                    {index === 0 ? (
                      <p className="text-xs text-green-600 dark:text-green-400">
                        Goedkoopste
                      </p>
                    ) : comp.savings > 0 ? (
                      <p className="text-xs text-red-500">
                        +{formatPrice(comp.savings)} duurder
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Budget Overview */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-3">
              <PieChart className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Budget overzicht</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Geschat</p>
                <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                  {formatPrice(budget.estimatedTotal)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Daadwerkelijk</p>
                <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                  {formatPrice(budget.actualTotal)}
                </p>
              </div>
            </div>
            {budget.savings !== 0 && (
              <div className={cn(
                'mt-2 p-2 rounded-lg text-center text-sm font-medium',
                budget.savings > 0
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
              )}>
                {budget.savings > 0 ? '✓' : '⚠'} {formatPrice(Math.abs(budget.savings))} {' '}
                {budget.savings > 0 ? 'bespaard' : 'meer uitgegeven'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Price Trend Indicator
interface PriceTrendProps {
  trend: 'up' | 'down' | 'stable';
  className?: string;
}

export function PriceTrend({ trend, className }: PriceTrendProps) {
  const config = {
    up: { icon: TrendingUp, color: 'text-red-500', label: 'Stijgend' },
    down: { icon: TrendingDown, color: 'text-green-500', label: 'Dalend' },
    stable: { icon: Minus, color: 'text-gray-500', label: 'Stabiel' },
  };

  const { icon: Icon, color, label } = config[trend];

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <Icon className={cn('w-4 h-4', color)} />
      <span className={cn('text-xs', color)}>{label}</span>
    </div>
  );
}

// Best Deals Component
interface BestDealsProps {
  priceHistory: PriceEntry[];
  shoppingList?: ShoppingList;
  className?: string;
}

export function BestDeals({ priceHistory, shoppingList, className }: BestDealsProps) {
  const deals = useMemo(() => {
    const allDeals = priceHistory.filter(p => p.isOffer);
    if (!shoppingList) return allDeals.slice(0, 5);

    const listItemIds = new Set(
      shoppingList.byStore.flatMap(s =>
        s.categories.flatMap(c => c.items.map(i => i.ingredientId))
      )
    );

    return allDeals
      .sort((a, b) => (listItemIds.has(b.ingredientId) ? 1 : 0) - (listItemIds.has(a.ingredientId) ? 1 : 0))
      .slice(0, 5);
  }, [priceHistory, shoppingList]);

  if (deals.length === 0) return null;

  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700', className)}>
      <div className="flex items-center gap-2 mb-3">
        <Tag className="w-5 h-5 text-[#F5A623]" />
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">Beste aanbiedingen</h3>
      </div>
      <div className="space-y-2">
        {deals.map((deal, index) => (
          <div
            key={`${deal.ingredientId}-${index}`}
            className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">{deal.ingredientId}</span>
              {shoppingList?.byStore.some(s =>
                s.categories.some(c =>
                  c.items.some(i => i.ingredientId === deal.ingredientId)
                )
              ) && (
                <span className="text-xs px-1.5 py-0.5 bg-[#4A90A4]/10 text-[#4A90A4] rounded">
                  Op lijst
                </span>
              )}
            </div>
            <span className="font-medium text-green-600 dark:text-green-400">
              {formatPrice(deal.price)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
