'use client';

import { useMemo } from 'react';
import { Meal, Day, Week } from '@/lib/types';
import {
  calculateMealNutrition,
  calculateDailyNutrition,
  calculateWeeklyNutrition,
  NutritionTotals,
  getNutritionGrade,
  calculateMacroCalories,
} from '@/lib/features/nutrition';
import { cn } from '@/lib/utils';
import { Flame, Dumbbell, Wheat as WheatIcon, Droplets } from 'lucide-react';

interface NutritionPanelProps {
  meal?: Meal;
  day?: Day;
  week?: Week;
  mealsData?: Map<string, Meal>;
  variant?: 'compact' | 'full';
  className?: string;
}

export function NutritionPanel({
  meal,
  day,
  week,
  mealsData = new Map(),
  variant = 'compact',
  className,
}: NutritionPanelProps) {
  // Single meal view
  if (meal) {
    const nutrition = calculateMealNutrition(meal);
    return <MealNutritionView nutrition={nutrition} className={className} />;
  }

  // Daily view
  if (day && mealsData.size > 0) {
    const daily = calculateDailyNutrition(day, mealsData);
    return <DailyNutritionView daily={daily} variant={variant} className={className} />;
  }

  // Weekly view
  if (week && mealsData.size > 0) {
    const weekly = calculateWeeklyNutrition(week, mealsData);
    return <WeeklyNutritionView weekly={weekly} className={className} />;
  }

  return null;
}

function MealNutritionView({
  nutrition,
  className,
}: {
  nutrition: NutritionTotals;
  className?: string;
}) {
  return (
    <div className={cn('grid grid-cols-4 gap-2', className)}>
      <NutrientBadge
        icon={Flame}
        value={nutrition.calories}
        unit="kcal"
        label="Calorieën"
        color="orange"
      />
      <NutrientBadge
        icon={Dumbbell}
        value={nutrition.protein}
        unit="g"
        label="Eiwit"
        color="blue"
      />
      <NutrientBadge
        icon={WheatIcon}
        value={nutrition.carbs}
        unit="g"
        label="Koolhydraten"
        color="yellow"
      />
      <NutrientBadge
        icon={Droplets}
        value={nutrition.fat}
        unit="g"
        label="Vet"
        color="red"
      />
    </div>
  );
}

function DailyNutritionView({
  daily,
  variant,
  className,
}: {
  daily: ReturnType<typeof calculateDailyNutrition>;
  variant: 'compact' | 'full';
  className?: string;
}) {
  const macroCals = calculateMacroCalories(
    daily.totals.protein,
    daily.totals.carbs,
    daily.totals.fat
  );

  const grade = getNutritionGrade(daily.percentage.calories);

  if (variant === 'compact') {
    return (
      <div className={cn('bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700', className)}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">Voedingswaarden</h3>
          <span
            className="text-sm font-bold px-2 py-1 rounded-full"
            style={{ backgroundColor: `${grade.color}20`, color: grade.color }}
          >
            {grade.grade}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <CompactNutrient value={daily.totals.calories} unit="kcal" label="Cal" color="#F5A623" />
          <CompactNutrient value={daily.totals.protein} unit="g" label="Eiwit" color="#4A90A4" />
          <CompactNutrient value={daily.totals.carbs} unit="g" label="Koolh" color="#7CB342" />
          <CompactNutrient value={daily.totals.fat} unit="g" label="Vet" color="#E74C3C" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">Dagelijkse voedingswaarden</h3>
        <span
          className="text-sm font-bold px-2 py-1 rounded-full"
          style={{ backgroundColor: `${grade.color}20`, color: grade.color }}
        >
          {grade.grade} - {grade.message}
        </span>
      </div>

      {/* Main stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <p className="text-xs text-gray-500 dark:text-gray-400">Calorieën</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            {daily.totals.calories}
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">/ {daily.target?.calories}</span>
          </p>
          <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#F5A623] rounded-full transition-all"
              style={{ width: `${Math.min(daily.percentage.calories, 100)}%` }}
            />
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <p className="text-xs text-gray-500 dark:text-gray-400">Eiwit</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            {daily.totals.protein}g
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">/ {daily.target?.protein}g</span>
          </p>
          <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#4A90A4] rounded-full transition-all"
              style={{ width: `${Math.min(daily.percentage.protein, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Macro breakdown */}
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Macro verdeling</p>
        <div className="h-4 rounded-full overflow-hidden flex">
          <div
            className="bg-[#4A90A4]"
            style={{ width: `${(macroCals.proteinCals / macroCals.total) * 100}%` }}
          />
          <div
            className="bg-[#7CB342]"
            style={{ width: `${(macroCals.carbsCals / macroCals.total) * 100}%` }}
          />
          <div
            className="bg-[#E74C3C]"
            style={{ width: `${(macroCals.fatCals / macroCals.total) * 100}%` }}
          />
        </div>
        <div className="flex gap-4 mt-2 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#4A90A4]" />
            Eiwit {Math.round((macroCals.proteinCals / macroCals.total) * 100)}%
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#7CB342]" />
            Koolh. {Math.round((macroCals.carbsCals / macroCals.total) * 100)}%
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#E74C3C]" />
            Vet {Math.round((macroCals.fatCals / macroCals.total) * 100)}%
          </span>
        </div>
      </div>

      {/* Meal breakdown */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Per maaltijd</p>
        <MealRow label="Ontbijt" nutrition={daily.meals.breakfast} />
        <MealRow label="Lunch" nutrition={daily.meals.lunch} />
        <MealRow label="Diner" nutrition={daily.meals.dinner} />
      </div>
    </div>
  );
}

function WeeklyNutritionView({
  weekly,
  className,
}: {
  weekly: ReturnType<typeof calculateWeeklyNutrition>;
  className?: string;
}) {
  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">Week overzicht</h3>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {weekly.adherence}% binnen doel
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Gem. calorieën" value={weekly.average.calories} unit="kcal" />
        <StatCard label="Gem. eiwit" value={weekly.average.protein} unit="g" />
      </div>

      {/* Daily chart */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Dagelijks verloop</p>
        <div className="flex items-end gap-1 h-24">
          {weekly.daily.map((day, i) => {
            const height = Math.min((day.totals.calories / (day.target?.calories || 2000)) * 100, 100);
            const grade = getNutritionGrade(day.percentage.calories);
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t transition-all"
                  style={{
                    height: `${height}%`,
                    backgroundColor: grade.color,
                    opacity: 0.8,
                  }}
                />
                <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {day.dayOfWeek.slice(0, 2)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function NutrientBadge({
  icon: Icon,
  value,
  unit,
  label,
  color,
}: {
  icon: React.ElementType;
  value: number;
  unit: string;
  label: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    orange: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20',
    blue: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
    yellow: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
    red: 'text-red-500 bg-red-50 dark:bg-red-900/20',
  };

  return (
    <div className={cn('flex flex-col items-center p-2 rounded-lg', colorClasses[color])}>
      <Icon className="w-4 h-4 mb-1" />
      <span className="font-bold text-sm">
        {value}
        <span className="text-xs font-normal">{unit}</span>
      </span>
      <span className="text-xs opacity-70">{label}</span>
    </div>
  );
}

function CompactNutrient({
  value,
  unit,
  label,
  color,
}: {
  value: number;
  unit: string;
  label: string;
  color: string;
}) {
  return (
    <div className="text-center">
      <p className="text-lg font-bold" style={{ color }}>
        {value}
        <span className="text-xs">{unit}</span>
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}

function MealRow({ label, nutrition }: { label: string; nutrition: NutritionTotals }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-600 dark:text-gray-400">{label}</span>
      <div className="flex gap-3 text-xs">
        <span className="text-gray-500 dark:text-gray-400">{nutrition.calories} kcal</span>
        <span className="text-[#4A90A4]">{nutrition.protein}g eiwit</span>
      </div>
    </div>
  );
}

function StatCard({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
        {value}
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">{unit}</span>
      </p>
    </div>
  );
}
