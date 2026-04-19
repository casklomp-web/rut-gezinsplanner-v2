'use client'

import { X, Clock, Users, Heart, ChefHat, Flame } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { mockRecipes, type Recipe } from '@/lib/app-data'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface RecipeDetailProps {
  recipe: Recipe | null
  isOpen: boolean
  onClose: () => void
}

// Mock ingredients data (in real app, this would come from database)
const getMockIngredients = (recipeId: string) => {
  const ingredients: Record<string, Array<{name: string, amount: string}>> = {
    'r1': [
      { name: 'Pasta', amount: '400g' },
      { name: 'Cherry tomaten', amount: '300g' },
      { name: 'Courgette', amount: '2 stuks' },
      { name: 'Knoflook', amount: '3 teentjes' },
      { name: 'Olijfolie', amount: '3 el' },
      { name: 'Parmezaan', amount: '50g' },
      { name: 'Basilicum', amount: 'handje' },
    ],
    'r2': [
      { name: 'Zalmfilet', amount: '400g' },
      { name: 'Groene asperges', amount: '300g' },
      { name: 'Citroen', amount: '1 stuk' },
      { name: 'Olijfolie', amount: '2 el' },
      { name: 'Dille', amount: '1 el' },
    ],
    'r3': [
      { name: 'Kipfilet', amount: '500g' },
      { name: 'Curry pasta', amount: '2 el' },
      { name: 'Kokosmelk', amount: '400ml' },
      { name: 'Paprika', amount: '2 stuks' },
      { name: 'Ui', amount: '1 stuk' },
      { name: 'Basmatirijst', amount: '300g' },
    ],
    'r4': [
      { name: 'Aubergine', amount: '2 stuks' },
      { name: 'Courgette', amount: '2 stuks' },
      { name: 'Paprika', amount: '2 stuks' },
      { name: 'Tomatenblokjes', amount: '400g' },
      { name: 'Knoflook', amount: '4 teentjes' },
      { name: 'Tijm', amount: '2 takjes' },
    ],
    'r5': [
      { name: 'Biefstuk', amount: '400g' },
      { name: 'Champignons', amount: '250g' },
      { name: 'Sperziebonen', amount: '300g' },
      { name: 'Boter', amount: '50g' },
      { name: 'Tijm', amount: '2 takjes' },
    ],
    'r6': [
      { name: 'Tomaten', amount: '1kg' },
      { name: 'Ui', amount: '2 stuks' },
      { name: 'Knoflook', amount: '3 teentjes' },
      { name: 'Bouillon', amount: '500ml' },
      { name: 'Room', amount: '100ml' },
      { name: 'Basilicum', amount: 'handje' },
    ],
  }
  return ingredients[recipeId] || []
}

// Mock instructions (in real app, this would come from database)
const getMockInstructions = (recipeId: string) => {
  const instructions: Record<string, string[]> = {
    'r1': [
      'Kook de pasta volgens de instructies op de verpakking.',
      'Snijd de courgette in kleine blokjes en halveer de cherry tomaten.',
      'Verhit olijfolie in een pan en bak de courgette 5 minuten.',
      'Voeg de tomaten en knoflook toe, bak nog 3 minuten.',
      'Meng de groenten met de pasta en serveer met parmezaan.',
    ],
    'r2': [
      'Verwarm de oven voor op 200°C.',
      'Leg de zalm op een bakplaat met bakpapier.',
      'Besprenkel met olijfolie, citroensap en dille.',
      'Bak 12-15 minuten tot de zalm gaar is.',
      'Kook de asperges 5 minuten en serveer samen.',
    ],
    'r3': [
      'Snijd de kip in blokjes en bak ze goudbruin.',
      'Voeg de curry pasta toe en bak 1 minuut mee.',
      'Schenk de kokosmelk erbij en laat 10 minuten pruttelen.',
      'Voeg de groenten toe en kook nog 5 minuten.',
      'Serveer met rijst.',
    ],
    'r4': [
      'Snijd alle groenten in gelijke blokjes.',
      'Verhit olijfolie in een grote pan.',
      'Bak de groenten in lagen, begin met aubergine.',
      'Voeg tomatenblokjes en kruiden toe.',
      'Laat 30 minuten pruttelen op laag vuur.',
    ],
    'r5': [
      'Laat de biefstuk op kamertemperatuur komen.',
      'Bak de champignons in boter tot goudbruin.',
      'Bak de biefstuk 3 minuten per kant voor medium.',
      'Laat het vlees 5 minuten rusten.',
      'Serveer met gebakken sperziebonen.',
    ],
    'r6': [
      'Snijd de tomaten en ui in stukken.',
      'Fruit de ui en knoflook in olijfolie.',
      'Voeg tomaten toe en bak 10 minuten.',
      'Schenk bouillon erbij en kook 20 minuten.',
      'Pureer met een staafmixer en roer room door.',
    ],
  }
  return instructions[recipeId] || []
}

export function RecipeDetail({ recipe, isOpen, onClose }: RecipeDetailProps) {
  const [isFavorite, setIsFavorite] = useState(recipe?.isFavorite || false)
  
  if (!recipe) return null

  const ingredients = getMockIngredients(recipe.id)
  const instructions = getMockInstructions(recipe.id)
  const totalTime = recipe.prepTime + recipe.cookTime

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden p-0">
        {/* Header Image */}
        <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/40">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full bg-background/80 backdrop-blur-sm"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-serif font-bold text-foreground">
                  {recipe.name}
                </h2>
                <p className="text-muted-foreground mt-1">
                  {recipe.description}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFavorite(!isFavorite)}
                className="rounded-full"
              >
                <Heart 
                  className={cn(
                    'h-5 w-5',
                    isFavorite ? 'fill-accent text-accent' : 'text-muted-foreground'
                  )} 
                />
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-12rem)]">
          {/* Meta Info */}
          <div className="flex items-center gap-4 p-4 border-b">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{totalTime} min</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{recipe.servings} pers</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <ChefHat className="h-4 w-4" />
              <span>{recipe.difficulty}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Flame className="h-4 w-4" />
              <span>~{Math.round(totalTime * 3)} kcal</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 p-4 border-b">
            {recipe.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="p-4 space-y-6">
            {/* Ingredients */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Ingrediënten</h3>
              <ul className="space-y-2">
                {ingredients.map((ingredient, index) => (
                  <li 
                    key={index}
                    className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                  >
                    <span className="text-foreground">{ingredient.name}</span>
                    <span className="text-muted-foreground text-sm">{ingredient.amount}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            {/* Instructions */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Bereiding</h3>
              <ol className="space-y-4">
                {instructions.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center">
                      {index + 1}
                    </span>
                    <p className="text-foreground pt-0.5">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex gap-2">
          <Button 
            className="flex-1"
            onClick={onClose}
          >
            Sluiten
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}