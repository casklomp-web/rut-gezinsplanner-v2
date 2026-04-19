'use client';

import { useState, useMemo } from 'react';
import {
  ChefHat,
  Clock,
  Refrigerator,
  Snowflake,
  Calendar,
  Thermometer,
  Info,
  ChevronDown,
  ChevronUp,
  Package,
  Flame,
} from 'lucide-react';
import {
  generatePrepPlan,
  getPrepTimeEstimate,
  formatPrepTime,
  PREP_DAY_OPTIONS,
  PrepPlan,
  StorageTip,
} from '@/lib/features/mealPrep';
import { Week, Meal } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MealPrepIndicatorProps {
  week: Week;
  mealsData: Map<string, Meal>;
  className?: string;
}

export function MealPrepIndicator({ week, mealsData, className }: MealPrepIndicatorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [prepDay, setPrepDay] = useState('sunday');

  const prepPlan = useMemo(() => 
    generatePrepPlan(week, mealsData, prepDay),
    [week, mealsData, prepDay]
  );

  const timeEstimate = useMemo(() => 
    getPrepTimeEstimate(prepPlan.mealsToPrep),
    [prepPlan]
  );

  const hasPrepMeals = prepPlan.mealsToPrep.length > 0;

  if (!hasPrepMeals) {
    return (
      <div className={cn('bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700', className)}>
        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
          <ChefHat className="w-5 h-5" />
          <p className="text-sm">Geen meal-prep vriendelijke maaltijden deze week</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden', className)}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#7CB342]/10 rounded-lg flex items-center justify-center">
            <ChefHat className="w-5 h-5 text-[#7CB342]" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Meal Prep Mode</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {prepPlan.mealsToPrep.length} maaltijden • {formatPrepTime(timeEstimate.parallel)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#7CB342] font-medium">
            {prepPlan.prepDayLabel}
          </span>
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
          {/* Prep Day Selector */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Kies prep dag
            </label>
            <div className="flex gap-2">
              {PREP_DAY_OPTIONS.map(option => (
                <button
                  key={option.value}
                  onClick={() => setPrepDay(option.value)}
                  className={cn(
                    'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors',
                    prepDay === option.value
                      ? 'bg-[#7CB342] text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  )}
                >
                  {option.shortLabel}
                </button>
              ))}
            </div>
          </div>

          {/* Time Estimate */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tijdsinschatting</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{formatPrepTime(timeEstimate.prep)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Voorbereiden</p>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{formatPrepTime(timeEstimate.cooking)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Koken</p>
              </div>
              <div>
                <p className="text-lg font-bold text-[#7CB342]">{formatPrepTime(timeEstimate.parallel)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Parallel</p>
              </div>
            </div>
          </div>

          {/* Meals to Prep */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Te prepareren maaltijden</h4>
            <div className="space-y-2">
              {prepPlan.mealsToPrep.map(meal => (
                <div
                  key={meal.mealId}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{meal.mealName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {meal.servings} porties • {formatPrepTime(meal.prepTime + meal.cookTime)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {meal.storageMethod === 'fridge' ? (
                      <Refrigerator className="w-4 h-4 text-blue-500" />
                    ) : (
                      <Snowflake className="w-4 h-4 text-cyan-500" />
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400">{meal.storageDays}d</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Storage Tips */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bewaartips</h4>
            <div className="space-y-2">
              {prepPlan.storageTips.map(tip => (
                <StorageTipCard key={tip.mealId} tip={tip} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StorageTipCard({ tip }: { tip: StorageTip }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full flex items-center justify-between p-3"
      >
        <div className="flex items-center gap-2">
          {tip.method === 'fridge' ? (
            <Refrigerator className="w-4 h-4 text-blue-500" />
          ) : (
            <Snowflake className="w-4 h-4 text-cyan-500" />
          )}
          <span className="font-medium text-sm text-gray-800 dark:text-gray-200">{tip.mealName}</span>
        </div>
        {showDetails ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {showDetails && (
        <div className="px-3 pb-3 space-y-2">
          <div className="flex items-start gap-2">
            <Package className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Bewaring</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {tip.method === 'fridge' ? 'Koelkast' : 'Vriezer'} • {tip.duration} dagen
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Tips</p>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                {tip.tips.map((t, i) => (
                  <li key={i}>• {t}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Flame className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Opwarmen</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{tip.reheatingInstructions}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Compact indicator for day cards
interface PrepDayBadgeProps {
  isPrepDay: boolean;
  hasPrepMeals: boolean;
  className?: string;
}

export function PrepDayBadge({ isPrepDay, hasPrepMeals, className }: PrepDayBadgeProps) {
  if (!isPrepDay && !hasPrepMeals) return null;

  return (
    <div
      className={cn(
        'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
        isPrepDay
          ? 'bg-[#7CB342] text-white'
          : 'bg-[#7CB342]/10 text-[#7CB342]',
        className
      )}
    >
      <ChefHat className="w-3 h-3" />
      <span>{isPrepDay ? 'Prep dag' : 'Meal prep'}</span>
    </div>
  );
}
