'use client'

import { useState } from 'react'
import { Search, SlidersHorizontal, Heart } from 'lucide-react'
import { RecipeCard } from './recipe-card'
import { mockRecipes, type Recipe } from '@/lib/app-data'
import { cn } from '@/lib/utils'

const filterTabs = [
  { id: 'all', label: 'Alle' },
  { id: 'favorites', label: 'Favorieten' },
  { id: 'quick', label: 'Snel' },
  { id: 'vegetarian', label: 'Vegetarisch' },
]

export function RecipeLibrary() {
  const [recipes, setRecipes] = useState<Recipe[]>(mockRecipes)
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const handleToggleFavorite = (id: string) => {
    setRecipes((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, isFavorite: !r.isFavorite } : r
      )
    )
  }

  const filteredRecipes = recipes.filter((recipe) => {
    // Search filter
    if (searchQuery && !recipe.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Tab filter
    switch (activeFilter) {
      case 'favorites':
        return recipe.isFavorite
      case 'quick':
        return recipe.prepTime + recipe.cookTime <= 30
      case 'vegetarian':
        return recipe.tags.includes('vegetarisch')
      default:
        return true
    }
  })

  const favoriteCount = recipes.filter((r) => r.isFavorite).length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background pt-6 pb-4">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-serif text-2xl tracking-tight text-foreground">
              Recepten
            </h1>
            <button className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Heart className="h-4 w-4" />
              {favoriteCount} favorieten
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Zoek recepten..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-11 pr-12 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-secondary transition-colors">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200',
                  activeFilter === tab.id
                    ? 'bg-foreground text-background'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Recipe Grid */}
      <main className="max-w-2xl mx-auto px-4 pb-8">
        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onToggleFavorite={handleToggleFavorite}
                onClick={() => console.log('Open recipe', recipe.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="font-medium text-foreground">Geen recepten gevonden</p>
            <p className="text-sm text-muted-foreground mt-1">
              Probeer een andere zoekterm of filter
            </p>
          </div>
        )}
      </main>
    </div>
  )
}