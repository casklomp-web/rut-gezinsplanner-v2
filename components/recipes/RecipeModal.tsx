/**
 * Recipe Modal - Add/Edit Recipe
 * Modal for creating and editing recipes
 */

'use client';

import { useState } from 'react';
import { X, Plus, Trash2, Clock, Users, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Meal, MealCategory, MealTag } from '@/lib/types';
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
  { value: 'snack', label: 'Snack' }
];

const tags: { value: MealTag; label: string }[] = [
  { value: 'high-protein', label: 'Eiwitrijk' },
  { value: 'quick', label: 'Snel (<15min)' },
  { value: 'ultra-quick', label: 'Ultra snel (<5min)' },
  { value: 'budget', label: 'Budget' },
  { value: 'kid-friendly', label: 'Kindvriendelijk' },
  { value: 'meal-prep', label: 'Meal prep' },
  { value: 'one-pan', label: 'One pan' },
  { value: 'no-cook', label: 'Geen koken' },
  { value: 'vegetarian', label: 'Vegetarisch' },
  { value: 'freezer-friendly', label: 'Invriezen' }
];

export function RecipeModal({ isOpen, onClose, onSave, recipe }: RecipeModalProps) {
  const isEditing = !!recipe;
  
  const [formData, setFormData] = useState<Partial<Meal>>({
    name: recipe?.name || '',
    category: recipe?.category || 'dinner',
    tags: recipe?.tags || [],
    prepTime: recipe?.prepTime || 10,
    cookTime: recipe?.cookTime || 15,
    instructions: recipe?.instructions || [''],
    nutrition: recipe?.nutrition || { calories: 0, protein: 0, carbs: 0, fat: 0 },
    isFavorite: recipe?.isFavorite || false,
    frequency: recipe?.frequency || 'weekly',
    isPrepFriendly: recipe?.isPrepFriendly || false,
    keepsForDays: recipe?.keepsForDays || 0,
    estimatedCost: recipe?.estimatedCost || 5
  });
  
  const [ingredients, setIngredients] = useState(
    recipe?.ingredients || [{ ingredientId: '', name: '', amount: 0, unit: 'g', scalable: true, isOptional: false }]
  );
  
  if (!isOpen) return null;
  
  const handleAddIngredient = () => {
    setIngredients([...ingredients, { ingredientId: '', name: '', amount: 0, unit: 'g', scalable: true, isOptional: false }]);
  };
  
  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };
  
  const handleIngredientChange = (index: number, field: string, value: any) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
  };
  
  const handleAddInstruction = () => {
    setFormData({
      ...formData,
      instructions: [...(formData.instructions || []), '']
    });
  };
  
  const handleRemoveInstruction = (index: number) => {
    setFormData({
      ...formData,
      instructions: formData.instructions?.filter((_, i) => i !== index) || []
    });
  };
  
  const handleInstructionChange = (index: number, value: string) => {
    const newInstructions = [...(formData.instructions || [])];
    newInstructions[index] = value;
    setFormData({ ...formData, instructions: newInstructions });
  };
  
  const handleToggleTag = (tag: MealTag) => {
    const currentTags = formData.tags || [];
    if (currentTags.includes(tag)) {
      setFormData({ ...formData, tags: currentTags.filter(t => t !== tag) });
    } else {
      setFormData({ ...formData, tags: [...currentTags, tag] });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      ingredients: ingredients.filter(i => i.name.trim() !== '')
    });
    onClose();
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-[#4A90A4]" />
            <h2 className="text-lg font-semibold">
              {isEditing ? 'Recept bewerken' : 'Nieuw recept'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Naam
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90A4]"
                placeholder="Bijv. Gegrilde kip met groente"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categorie
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as MealCategory })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90A4]"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequentie
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90A4]"
                >
                  <option value="weekly">Wekelijks</option>
                  <option value="biweekly">Tweewekelijks</option>
                  <option value="monthly">Maandelijks</option>
                  <option value="occasional">Incidenteel</option>
                </select>
              </div>
            </div>
            
            {/* Time inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Voorbereiding (min)
                </label>
                <input
                  type="number"
                  value={formData.prepTime}
                  onChange={(e) => setFormData({ ...formData, prepTime: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90A4]"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Kooktijd (min)
                </label>
                <input
                  type="number"
                  value={formData.cookTime}
                  onChange={(e) => setFormData({ ...formData, cookTime: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90A4]"
                  min="0"
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
              {tags.map(tag => (
                <button
                  key={tag.value}
                  type="button"
                  onClick={() => handleToggleTag(tag.value)}
                  className={cn(
                    'px-3 py-1 rounded-full text-sm transition-colors',
                    formData.tags?.includes(tag.value)
                      ? 'bg-[#4A90A4] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Ingredients */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Ingrediënten
              </label>
              <button
                type="button"
                onClick={handleAddIngredient}
                className="text-sm text-[#4A90A4] hover:text-[#3a7a8c] flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Toevoegen
              </button>
            </div>
            <div className="space-y-2">
              {ingredients.map((ing, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={ing.name}
                    onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                    placeholder="Ingrediënt"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90A4] text-sm"
                  />
                  <input
                    type="number"
                    value={ing.amount || ''}
                    onChange={(e) => handleIngredientChange(index, 'amount', parseFloat(e.target.value) || 0)}
                    placeholder="Hoev."
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90A4] text-sm"
                  />
                  <select
                    value={ing.unit}
                    onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                    className="w-20 px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90A4] text-sm"
                  >
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="ml">ml</option>
                    <option value="l">l</option>
                    <option value="stuk">stuk</option>
                    <option value="el">el</option>
                    <option value="tl">tl</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Instructions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Bereiding
              </label>
              <button
                type="button"
                onClick={handleAddInstruction}
                className="text-sm text-[#4A90A4] hover:text-[#3a7a8c] flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Stap toevoegen
              </button>
            </div>
            <div className="space-y-2">
              {formData.instructions?.map((instruction, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm text-gray-600 flex-shrink-0 mt-2">
                    {index + 1}
                  </span>
                  <textarea
                    value={instruction}
                    onChange={(e) => handleInstructionChange(index, e.target.value)}
                    placeholder={`Stap ${index + 1}`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90A4] text-sm resize-none"
                    rows={2}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveInstruction(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg mt-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Options */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFavorite}
                onChange={(e) => setFormData({ ...formData, isFavorite: e.target.checked })}
                className="w-4 h-4 text-[#4A90A4] rounded focus:ring-[#4A90A4]"
              />
              <span className="text-sm text-gray-700">Favoriet</span>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPrepFriendly}
                onChange={(e) => setFormData({ ...formData, isPrepFriendly: e.target.checked })}
                className="w-4 h-4 text-[#4A90A4] rounded focus:ring-[#4A90A4]"
              />
              <span className="text-sm text-gray-700">Geschikt voor meal prep</span>
            </label>
          </div>
        </form>
        
        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Annuleren
          </Button>
          <Button onClick={handleSubmit}>
            {isEditing ? 'Opslaan' : 'Toevoegen'}
          </Button>
        </div>
      </div>
    </div>
  );
}
