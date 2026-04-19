'use client';

import { useState, useMemo } from 'react';
import {
  Sparkles,
  TrendingUp,
  Sun,
  Heart,
  Zap,
  ChevronRight,
  RefreshCw,
  ThumbsUp,
  Clock,
} from 'lucide-react';
import {
  generateSuggestions,
  getMoreLikeThis,
  Suggestion,
  SEASONAL_INGREDIENTS,
} from '@/lib/features/smartSuggestions';
import { Meal, User, Week } from '@/lib/types';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/Toast';

interface SmartSuggestionsProps {
  allMeals: Meal[];
  user: User;
  recentMealIds: string[];
  favoriteMealIds: string[];
  currentWeek?: Week;
  onSelectMeal?: (meal: Meal) => void;
  className?: string;
}

export function SmartSuggestions({
  allMeals,
  user,
  recentMealIds,
  favoriteMealIds,
  currentWeek,
  onSelectMeal,
  className,
}: SmartSuggestionsProps) {
  const [selectedType, setSelectedType] = useState<Suggestion['type'] | 'all'>('all');

  const suggestions = useMemo(() => {
    const prefs = {
      favoriteTags: [],
      dislikedTags: user.preferences.dislikes,
      preferredCategories: user.preferences.dietary,
      maxPrepTime: Math.max(
        user.preferences.maxPrepTime.breakfast,
        user.preferences.maxPrepTime.lunch,
        user.preferences.maxPrepTime.dinner
      ),
      dietary: user.preferences.dietary,
    };

    return generateSuggestions(allMeals, prefs, recentMealIds, currentWeek);
  }, [allMeals, user, recentMealIds, currentWeek]);

  const filteredSuggestions = useMemo(() => {
    if (selectedType === 'all') return suggestions;
    return suggestions.filter(s => s.type === selectedType);
  }, [suggestions, selectedType]);

  const currentMonth = new Date().getMonth();
  const seasonalIngredients = SEASONAL_INGREDIENTS[currentMonth]?.produce.slice(0, 3) || [];

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#F5A623]" />
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">Slimme suggesties</h3>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {seasonalIngredients.join(', ')}
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <FilterTab
          label="Alles"
          isActive={selectedType === 'all'}
          onClick={() => setSelectedType('all')}
        />
        <FilterTab
          label="Voor jou"
          icon={Heart}
          isActive={selectedType === 'preference'}
          onClick={() => setSelectedType('preference')}
        />
        <FilterTab
          label="Seizoensgebonden"
          icon={Sun}
          isActive={selectedType === 'seasonal'}
          onClick={() => setSelectedType('seasonal')}
        />
        <FilterTab
          label="Snel"
          icon={Zap}
          isActive={selectedType === 'quick'}
          onClick={() => setSelectedType('quick')}
        />
      </div>

      {/* Suggestions Grid */}
      <div className="grid grid-cols-1 gap-3">
        {filteredSuggestions.map(suggestion => (
          <SuggestionCard
            key={suggestion.id}
            suggestion={suggestion}
            onSelect={() => onSelectMeal?.(suggestion.meal)}
          />
        ))}
      </div>
    </div>
  );
}

interface SuggestionCardProps {
  suggestion: Suggestion;
  onSelect: () => void;
}

function SuggestionCard({ suggestion, onSelect }: SuggestionCardProps) {
  const { meal, type, reason, confidence } = suggestion;

  const typeConfig = {
    similar: { icon: Heart, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
    seasonal: { icon: Sun, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
    preference: { icon: ThumbsUp, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    trending: { icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
    quick: { icon: Zap, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <button
      onClick={onSelect}
      className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-[#4A90A4] dark:hover:border-[#4A90A4] transition-colors text-left"
    >
      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', config.bg)}>
        <Icon className={cn('w-5 h-5', config.color)} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{meal.name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{reason}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {meal.prepTime + meal.cookTime}m
          </span>
          {meal.tags.slice(0, 2).map(tag => (
            <span
              key={tag}
              className="text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
            >
              {tag.replace('-', ' ')}
            </span>
          ))}
        </div>
      </div>

      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
    </button>
  );
}

interface FilterTabProps {
  label: string;
  icon?: React.ElementType;
  isActive: boolean;
  onClick: () => void;
}

function FilterTab({ label, icon: Icon, isActive, onClick }: FilterTabProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors',
        isActive
          ? 'bg-[#4A90A4] text-white'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
      )}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      <span>{label}</span>
    </button>
  );
}

// More Like This Component
interface MoreLikeThisProps {
  meal: Meal;
  allMeals: Meal[];
  onSelectMeal?: (meal: Meal) => void;
  className?: string;
}

export function MoreLikeThis({ meal, allMeals, onSelectMeal, className }: MoreLikeThisProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const similarMeals = useMemo(() => 
    getMoreLikeThis(meal, allMeals, 3),
    [meal, allMeals]
  );

  if (similarMeals.length === 0) return null;

  return (
    <div className={cn('bg-gray-50 dark:bg-gray-800 rounded-xl p-4', className)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-[#4A90A4]" />
          <span className="font-medium text-gray-800 dark:text-gray-200">Meer zoals dit</span>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {similarMeals.length} opties
        </span>
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-2">
          {similarMeals.map(similarMeal => (
            <button
              key={similarMeal.id}
              onClick={() => onSelectMeal?.(similarMeal)}
              className="w-full flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <span className="text-sm text-gray-700 dark:text-gray-300">{similarMeal.name}</span>
              <span className="text-xs text-gray-400">
                {similarMeal.prepTime + similarMeal.cookTime}m
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
