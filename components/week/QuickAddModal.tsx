'use client';

import { useState, useMemo } from 'react';
import { Search, Plus, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ingredients as defaultIngredients } from '@/lib/data/ingredients';
import { Ingredient, StoreCategory } from '@/lib/types';
import { cn } from '@/lib/utils';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (ingredient: Ingredient, amount: number, unit: string, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => void;
  dayLabel: string;
}

const CATEGORY_NAMES: Record<StoreCategory, string> = {
  produce: 'Groente & Fruit',
  bakery: 'Brood & Bakker',
  meat: 'Vlees & Vis',
  dairy: 'Zuivel',
  frozen: 'Diepvries',
  pantry: 'Voorraad',
  drinks: 'Drinken',
  household: 'Huishoudelijk',
  snacks: 'Snacks',
};

const MEAL_TYPES = [
  { id: 'breakfast' as const, label: 'Ontbijt', icon: '🌅' },
  { id: 'lunch' as const, label: 'Lunch', icon: '☀️' },
  { id: 'dinner' as const, label: 'Diner', icon: '🌙' },
  { id: 'snack' as const, label: 'Tussendoortje', icon: '🍎' },
];

export function QuickAddModal({ isOpen, onClose, onAdd, dayLabel }: QuickAddModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [amount, setAmount] = useState(1);
  const [unit, setUnit] = useState('stuk');
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');

  // Filter ingredients based on search
  const filteredIngredients = useMemo(() => {
    if (!searchQuery.trim()) return defaultIngredients.slice(0, 20); // Show first 20 by default
    
    const query = searchQuery.toLowerCase();
    return defaultIngredients.filter(
      ing => 
        ing.name.toLowerCase().includes(query) ||
        ing.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Group by category
  const groupedIngredients = useMemo(() => {
    const groups: Record<string, Ingredient[]> = {};
    filteredIngredients.forEach(ing => {
      if (!groups[ing.category]) {
        groups[ing.category] = [];
      }
      groups[ing.category].push(ing);
    });
    return groups;
  }, [filteredIngredients]);

  const handleAdd = () => {
    if (selectedIngredient) {
      onAdd(selectedIngredient, amount, unit, selectedMealType);
      resetAndClose();
    }
  };

  const resetAndClose = () => {
    setSelectedIngredient(null);
    setSearchQuery('');
    setAmount(1);
    setUnit('stuk');
    setSelectedMealType('breakfast');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={resetAndClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-[#2D3436]">
              {selectedIngredient ? 'Toevoegen aan dag' : 'Snel toevoegen'}
            </h2>
            <p className="text-sm text-gray-500">{dayLabel}</p>
          </div>
          <button
            onClick={resetAndClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {!selectedIngredient ? (
            <>
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Zoek ingrediënt (bijv. banaan, yoghurt...)"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A90A4]"
                  autoFocus
                />
              </div>

              {/* Quick suggestions */}
              {!searchQuery && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Populair</p>
                  <div className="flex flex-wrap gap-2">
                    {['Banaan', 'Yoghurt', 'Havermout', 'Ei', 'Kipfilet', 'Broccoli'].map((name) => {
                      const ing = defaultIngredients.find(i => i.name === name);
                      if (!ing) return null;
                      return (
                        <button
                          key={ing.id}
                          onClick={() => setSelectedIngredient(ing)}
                          className="px-3 py-1.5 bg-[#4A90A4]/10 text-[#4A90A4] rounded-full text-sm hover:bg-[#4A90A4]/20 transition-colors"
                        >
                          {ing.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Results */}
              <div className="space-y-4">
                {Object.entries(groupedIngredients).map(([category, items]) => (
                  <div key={category}>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      {CATEGORY_NAMES[category as StoreCategory] || category}
                    </h3>
                    <div className="space-y-1">
                      {items.map((ingredient) => (
                        <button
                          key={ingredient.id}
                          onClick={() => setSelectedIngredient(ingredient)}
                          className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-[#4A90A4] hover:bg-[#4A90A4]/5 transition-all text-left"
                        >
                          <div>
                            <p className="font-medium text-[#2D3436]">{ingredient.name}</p>
                            <p className="text-sm text-gray-500">
                              €{ingredient.estimatedPrice.toFixed(2)} per {ingredient.priceUnit}
                            </p>
                          </div>
                          <Plus className="w-5 h-5 text-[#4A90A4]" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {filteredIngredients.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>Geen ingrediënten gevonden</p>
                  <p className="text-sm">Probeer een andere zoekterm</p>
                </div>
              )}
            </>
          ) : (
            /* Configure addition */
            <div className="space-y-4">
              <div className="bg-[#4A90A4]/10 rounded-xl p-4">
                <p className="font-medium text-[#2D3436]">{selectedIngredient.name}</p>
                <p className="text-sm text-gray-600">
                  €{selectedIngredient.estimatedPrice.toFixed(2)} per {selectedIngredient.priceUnit}
                </p>
              </div>

              {/* Meal type selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wanneer?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {MEAL_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedMealType(type.id)}
                      className={cn(
                        'p-3 rounded-xl border-2 text-center transition-colors',
                        selectedMealType === type.id
                          ? 'border-[#4A90A4] bg-[#4A90A4]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <span className="text-2xl mb-1 block">{type.icon}</span>
                      <span className="text-sm font-medium text-gray-700">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hoeveelheid
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAmount(Math.max(0.5, amount - 0.5))}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-lg"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    className="w-20 text-center py-2 border border-gray-300 rounded-lg"
                    step="0.5"
                    min="0.5"
                  />
                  <button
                    onClick={() => setAmount(amount + 0.5)}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Unit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Eenheid
                </label>
                <div className="flex gap-2 flex-wrap">
                  {['stuk', 'g', 'kg', 'ml', 'liter', 'pak', 'doos', 'sneetje'].map((u) => (
                    <button
                      key={u}
                      onClick={() => setUnit(u)}
                      className={cn(
                        'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                        unit === u
                          ? 'bg-[#4A90A4] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      )}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Geschatte prijs: <span className="font-medium">€{(amount * selectedIngredient.estimatedPrice).toFixed(2)}</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          {!selectedIngredient ? (
            <Button variant="outline" className="w-full" onClick={resetAndClose}>
              Annuleren
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setSelectedIngredient(null)}>
                Terug
              </Button>
              <Button className="flex-1" onClick={handleAdd}>
                <Check className="w-4 h-4 mr-2" />
                Toevoegen
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
