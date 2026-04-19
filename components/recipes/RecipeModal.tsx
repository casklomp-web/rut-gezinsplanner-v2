'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Clock, ChefHat, Tag } from 'lucide-react';
import { Meal, MealCategory, MealTag } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (recipe: Partial<Meal>) => void;
  recipe?: Meal | null;
}

const categories: { value: MealCategory; label: string }[] = [
  { value: 'breakfast', label: 'Ontbijt' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Diner' },
  { value: 'snack', label: 'Snack' },
];

const availableTags: { value: MealTag; label: string }[] = [
  { value: 'high-protein', label: 'Eiwitrijk' },
  { value: 'quick', label: 'Snel (< 15 min)' },
  { value: 'ultra-quick', label: 'Ultra snel (< 5 min)' },
  { value: 'kid-friendly', label: 'Kindvriendelijk' },
  { value: 'meal-prep', label: 'Meal prep' },
  { value: 'one-pan', label: 'One pan' },
  { value: 'no-cook', label: 'Geen koken' },
  { value: 'vegetarian', label: 'Vegetarisch' },
  { value: 'budget', label: 'Budget' },
  { value: 'freezer-friendly', label: 'Vriesvriendelijk' },
];

export function RecipeModal({ isOpen, onClose, onSave, recipe }: RecipeModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<MealCategory>('dinner');
  const [selectedTags, setSelectedTags] = useState<MealTag[]>([]);
  const [prepTime, setPrepTime] = useState(15);
  const [cookTime, setCookTime] = useState(20);

  useEffect(() => {
    if (recipe) {
      setName(recipe.name);
      setCategory(recipe.category);
      setSelectedTags(recipe.tags);
      setPrepTime(recipe.prepTime);
      setCookTime(recipe.cookTime);
    } else {
      setName('');
      setCategory('dinner');
      setSelectedTags([]);
      setPrepTime(15);
      setCookTime(20);
    }
  }, [recipe, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      category,
      tags: selectedTags,
      prepTime,
      cookTime,
    });
    onClose();
  };

  const toggleTag = (tag: MealTag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="recipe-modal-title"
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
            <h2 id="recipe-modal-title" className="text-lg font-semibold text-[#2D3436]">
              {recipe ? 'Recept bewerken' : 'Nieuw recept'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Sluiten"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="recipe-name" className="block text-sm font-medium text-gray-700 mb-1">
                Naam
              </label>
              <input
                id="recipe-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Bijv. Gegrilde zalm met groenten"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90A4]"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categorie
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm transition-colors",
                      category === cat.value
                        ? "bg-[#4A90A4] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="prep-time" className="block text-sm font-medium text-gray-700 mb-1">
                  Voorbereiding (min)
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="prep-time"
                    type="number"
                    value={prepTime}
                    onChange={(e) => setPrepTime(Number(e.target.value))}
                    min={0}
                    max={180}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90A4]"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="cook-time" className="block text-sm font-medium text-gray-700 mb-1">
                  Kooktijd (min)
                </label>
                <div className="relative">
                  <ChefHat className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="cook-time"
                    type="number"
                    value={cookTime}
                    onChange={(e) => setCookTime(Number(e.target.value))}
                    min={0}
                    max={300}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90A4]"
                  />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <button
                    key={tag.value}
                    type="button"
                    onClick={() => toggleTag(tag.value)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm transition-colors",
                      selectedTags.includes(tag.value)
                        ? "bg-[#4A90A4] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-4 border-t border-gray-200 sticky bottom-0 bg-white">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Annuleren
            </Button>
            <Button type="submit" className="flex-1">
              {recipe ? 'Opslaan' : 'Toevoegen'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
