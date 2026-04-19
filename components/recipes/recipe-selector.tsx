'use client'

import { useState } from 'react'
import { X, Search, Clock, Heart } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { mockRecipes, type Recipe } from '@/lib/app-data'
import { cn } from '@/lib/utils'

interface RecipeSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (recipe: Recipe) => void
  selectedDate: string | null
}

export function RecipeSelector({ isOpen, onClose, onSelect, selectedDate }: RecipeSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<'all' | 'favorites' | 'quick'>('all')

  const filteredRecipes = mockRecipes.filter((recipe) => {
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
      default:
        return true
    }
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-hidden p-0">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle className="font-serif text-xl">
            Kies een recept
          </DialogTitle>
          {selectedDate && (
            <p className="text-sm text-muted-foreground">
              Voor {new Date(selectedDate).toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          )}
        </DialogHeader>

        {/* Search & Filters */}
        <div className="px-4 pb-2 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Zoek recepten..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={activeFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter('all')}
              className="rounded-full text-xs"
            >
              Alle
            </Button>
            <Button
              variant={activeFilter === 'favorites' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter('favorites')}
              className="rounded-full text-xs"
            >
              <Heart className="h-3 w-3 mr-1" />
              Favorieten
            </Button>
            <Button
              variant={activeFilter === 'quick' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter('quick')}
              className="rounded-full text-xs"
            >
              <Clock className="h-3 w-3 mr-1" />
              Snel
            </Button>
          </div>
        </div>

        {/* Recipe List */}
        <div className="overflow-y-auto max-h-[50vh] px-4 pb-4 space-y-2">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <button
                key={recipe.id}
                onClick={() => onSelect(recipe)}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all',
                  'hover:border-primary hover:bg-primary/5'
                )}
              >
                {/* Image Placeholder */}
                <div className="w-14 h-14 rounded-lg bg-secondary flex-shrink-0 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/20" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foreground truncate">
                      {recipe.name}
                    </h3>
                    {recipe.isFavorite && (
                      <Heart className="h-3 w-3 fill-accent text-accent flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                    {recipe.description}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {recipe.prepTime + recipe.cookTime} min
                    </span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">
                      {recipe.difficulty}
                    </span>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Geen recepten gevonden</p>
            </div>
          )}
        </div>

        {/* Cancel Button */}
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full"
          >
            Annuleren
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}