/**
 * Recipes Page
 * Browse, search, and manage recipes
 */

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Plus, Heart, Clock, ChefHat, Edit2, Trash2, X } from 'lucide-react';
import { meals as defaultMeals } from '@/lib/data/meals';
import { Meal, MealCategory, MealTag } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { RecipeModal } from '@/components/recipes/RecipeModal';
import { DeleteConfirmModal } from '@/components/ui/DeleteConfirmModal';
import { EmptyState } from '@/components/ui/ErrorBoundary';
import { RecipesListSkeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/Toast';

const categoryFilters: { value: MealCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'Alles' },
  { value: 'breakfast', label: 'Ontbijt' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Diner' },
  { value: 'snack', label: 'Snack' }
];

const tagFilters: { value: MealTag; label: string }[] = [
  { value: 'high-protein', label: 'Eiwitrijk' },
  { value: 'quick', label: 'Snel' },
  { value: 'kid-friendly', label: 'Kindvriendelijk' },
  { value: 'meal-prep', label: 'Meal prep' },
  { value: 'vegetarian', label: 'Vegetarisch' },
  { value: 'budget', label: 'Budget' }
];

function RecipesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [recipes, setRecipes] = useState<Meal[]>(defaultMeals);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState<MealCategory | 'all'>(
    (searchParams.get('category') as MealCategory | 'all') || 'all'
  );
  const [selectedTags, setSelectedTags] = useState<MealTag[]>(
    searchParams.get('tags')?.split(',').filter(Boolean) as MealTag[] || []
  );
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(
    searchParams.get('favorites') === 'true'
  );
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Meal | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<Meal | null>(null);
  
  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem('rut-search-history');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
    setIsLoading(false);
  }, []);
  
  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (selectedTags.length > 0) params.set('tags', selectedTags.join(','));
    if (showFavoritesOnly) params.set('favorites', 'true');
    
    router.replace(`/recipes?${params.toString()}`, { scroll: false });
  }, [searchQuery, selectedCategory, selectedTags, showFavoritesOnly, router]);
  
  // Filter recipes
  const filteredRecipes = recipes.filter(recipe => {
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = recipe.name.toLowerCase().includes(query);
      const matchesIngredient = recipe.ingredients.some(i => 
        i.name.toLowerCase().includes(query)
      );
      const matchesTag = recipe.tags.some(t => 
        t.toLowerCase().includes(query)
      );
      if (!matchesName && !matchesIngredient && !matchesTag) return false;
    }
    
    // Category
    if (selectedCategory !== 'all' && recipe.category !== selectedCategory) {
      return false;
    }
    
    // Tags
    if (selectedTags.length > 0 && !selectedTags.some(tag => recipe.tags.includes(tag))) {
      return false;
    }
    
    // Favorites
    if (showFavoritesOnly && !recipe.isFavorite) {
      return false;
    }
    
    return true;
  });
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    // Save to history
    if (query.trim() && !searchHistory.includes(query.trim())) {
      const newHistory = [query.trim(), ...searchHistory].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem('rut-search-history', JSON.stringify(newHistory));
    }
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedTags([]);
    setShowFavoritesOnly(false);
  };
  
  const toggleTag = (tag: MealTag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  const handleSaveRecipe = (recipeData: Partial<Meal>) => {
    if (editingRecipe) {
      // Update existing
      setRecipes(recipes.map(r => 
        r.id === editingRecipe.id 
          ? { ...r, ...recipeData } as Meal
          : r
      ));
      toast.success('Recept bijgewerkt');
    } else {
      // Create new
      const newRecipe: Meal = {
        ...recipeData,
        id: `meal_custom_${Date.now()}`,
        isCustom: true
      } as Meal;
      setRecipes([newRecipe, ...recipes]);
      toast.success('Recept toegevoegd');
    }
    setEditingRecipe(null);
  };
  
  const handleEditRecipe = (recipe: Meal) => {
    setEditingRecipe(recipe);
    setIsModalOpen(true);
  };
  
  const handleDeleteClick = (recipe: Meal) => {
    setRecipeToDelete(recipe);
    setDeleteModalOpen(true);
  };
  
  const handleConfirmDelete = () => {
    if (recipeToDelete) {
      setRecipes(recipes.filter(r => r.id !== recipeToDelete.id));
      toast.success('Recept verwijderd');
      setRecipeToDelete(null);
      setDeleteModalOpen(false);
    }
  };
  
  const toggleFavorite = (recipeId: string) => {
    setRecipes(recipes.map(r => 
      r.id === recipeId ? { ...r, isFavorite: !r.isFavorite } : r
    ));
  };
  
  if (isLoading) {
    return (
      <div className="px-4 py-6 max-w-md mx-auto">
        <RecipesListSkeleton />
      </div>
    );
  }
  
  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || selectedTags.length > 0 || showFavoritesOnly;
  
  return (
    <div className="px-4 py-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#2D3436]">
          Recepten
        </h1>
        <button
          onClick={() => {
            setEditingRecipe(null);
            setIsModalOpen(true);
          }}
          className="w-10 h-10 bg-[#4A90A4] text-white rounded-full flex items-center justify-center hover:bg-[#3a7a8c] transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Zoek recepten..."
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A90A4]"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>
      
      {/* Search history */}
      {searchHistory.length > 0 && !searchQuery && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Recente zoekopdrachten</p>
          <div className="flex flex-wrap gap-2">
            {searchHistory.slice(0, 5).map((query, index) => (
              <button
                key={index}
                onClick={() => handleSearch(query)}
                className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {categoryFilters.map(cat => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
              selectedCategory === cat.value
                ? 'bg-[#4A90A4] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>
      
      {/* Tag filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        <button
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className={cn(
            'px-3 py-1.5 rounded-full text-sm flex items-center gap-1 whitespace-nowrap transition-colors',
            showFavoritesOnly
              ? 'bg-red-100 text-red-700 border border-red-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          <Heart className={cn('w-3.5 h-3.5', showFavoritesOnly && 'fill-current')} />
          Favorieten
        </button>
        {tagFilters.map(tag => (
          <button
            key={tag.value}
            onClick={() => toggleTag(tag.value)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors',
              selectedTags.includes(tag.value)
                ? 'bg-[#4A90A4] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            {tag.label}
          </button>
        ))}
      </div>
      
      {/* Active filters summary */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            {filteredRecipes.length} resultaten
          </p>
          <button
            onClick={clearSearch}
            className="text-sm text-[#4A90A4] hover:text-[#3a7a8c]"
          >
            Filters wissen
          </button>
        </div>
      )}
      
      {/* Recipes list */}
      {filteredRecipes.length === 0 ? (
        <EmptyState
          icon={ChefHat}
          title="Geen recepten gevonden"
          description={
            hasActiveFilters
              ? 'Probeer andere zoektermen of filters'
              : 'Voeg je eerste recept toe om te beginnen'
          }
          action={
            hasActiveFilters ? (
              <Button variant="outline" onClick={clearSearch}>
                Filters wissen
              </Button>
            ) : (
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Recept toevoegen
              </Button>
            )
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredRecipes.map(recipe => (
            <div
              key={recipe.id}
              className="bg-white rounded-xl p-4 border border-gray-200 hover:border-[#4A90A4] transition-colors group"
            >
              <div className="flex items-start gap-4">
                {/* Image placeholder */}
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ChefHat className="w-8 h-8 text-gray-400" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-[#2D3436] truncate">
                      {recipe.name}
                    </h3>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditRecipe(recipe)}
                        className="p-1.5 text-gray-400 hover:text-[#4A90A4] hover:bg-[#4A90A4]/10 rounded-lg"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(recipe)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {recipe.prepTime + recipe.cookTime} min
                    </span>
                    <span className="capitalize">
                      {recipe.category === 'breakfast' && 'Ontbijt'}
                      {recipe.category === 'lunch' && 'Lunch'}
                      {recipe.category === 'dinner' && 'Diner'}
                      {recipe.category === 'snack' && 'Snack'}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {recipe.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
                      >
                        {tag === 'high-protein' && 'Eiwit'}
                        {tag === 'quick' && 'Snel'}
                        {tag === 'kid-friendly' && 'Kids'}
                        {tag === 'meal-prep' && 'Prep'}
                        {tag === 'vegetarian' && 'Veggie'}
                        {tag === 'budget' && 'Budget'}
                        {!['high-protein', 'quick', 'kid-friendly', 'meal-prep', 'vegetarian', 'budget'].includes(tag) && tag}
                      </span>
                    ))}
                    {recipe.tags.length > 3 && (
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                        +{recipe.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Favorite button */}
                <button
                  onClick={() => toggleFavorite(recipe.id)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Heart
                    className={cn(
                      'w-5 h-5',
                      recipe.isFavorite
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-400'
                    )}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Recipe Modal */}
      <RecipeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRecipe(null);
        }}
        onSave={handleSaveRecipe}
        recipe={editingRecipe}
      />
      
      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setRecipeToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Recept verwijderen"
        description="Weet je zeker dat je dit recept wilt verwijderen? Dit kan niet ongedaan worden gemaakt."
        itemName={recipeToDelete?.name}
      />
    </div>
  );
}

// Main export with Suspense
export default function RecipesPage() {
  return (
    <Suspense fallback={<RecipesListSkeleton />}>
      <RecipesPageContent />
    </Suspense>
  );
}
