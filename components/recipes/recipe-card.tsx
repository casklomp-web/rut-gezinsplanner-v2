'use client'

import { Clock, Heart, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Recipe } from '@/lib/app-data'

interface RecipeCardProps {
  recipe: Recipe
  variant?: 'default' | 'compact'
  onToggleFavorite?: (id: string) => void
  onClick?: () => void
}

export function RecipeCard({ 
  recipe, 
  variant = 'default',
  onToggleFavorite,
  onClick 
}: RecipeCardProps) {
  const totalTime = recipe.prepTime + recipe.cookTime

  if (variant === 'compact') {
    return (
      <div 
        onClick={onClick}
        className="flex items-center gap-4 p-3 rounded-xl bg-card border border-border/50 hover:border-border cursor-pointer transition-all duration-200"
      >
        {/* Image */}
        <div className="w-16 h-16 rounded-lg bg-secondary/50 flex-shrink-0 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-primary/5 to-primary/10" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground truncate">{recipe.name}</h3>
          <div className="flex items-center gap-3 mt-1">
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {totalTime} min
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
              {recipe.difficulty}
            </span>
          </div>
        </div>

        {/* Favorite */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite?.(recipe.id)
          }}
          className="p-2 rounded-full hover:bg-secondary transition-colors"
        >
          <Heart 
            className={cn(
              'h-5 w-5 transition-colors',
              recipe.isFavorite 
                ? 'fill-accent text-accent' 
                : 'text-muted-foreground'
            )} 
          />
        </button>
      </div>
    )
  }

  return (
    <div 
      onClick={onClick}
      className="group rounded-2xl bg-card border border-border/50 hover:border-border overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-sm"
    >
      {/* Image */}
      <div className="aspect-[4/3] bg-secondary/50 relative overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-primary/5 to-primary/15" />
        
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite?.(recipe.id)
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
        >
          <Heart 
            className={cn(
              'h-4 w-4 transition-colors',
              recipe.isFavorite 
                ? 'fill-accent text-accent' 
                : 'text-muted-foreground'
            )} 
          />
        </button>

        {/* Difficulty Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="text-xs px-2.5 py-1 rounded-full bg-card/90 backdrop-blur-sm text-foreground font-medium">
            {recipe.difficulty}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
          {recipe.name}
        </h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {recipe.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/30">
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {totalTime} min
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            {recipe.servings} pers
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {recipe.tags.slice(0, 3).map((tag) => (
            <span 
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}