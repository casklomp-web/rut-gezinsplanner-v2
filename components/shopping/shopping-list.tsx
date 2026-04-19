'use client'

import { useState, useEffect } from 'react'
import { Plus, RefreshCw } from 'lucide-react'
import { ShoppingHeader } from './shopping-header'
import { ShoppingCategory } from './shopping-category'
import { EmptyState } from './empty-state'
import { generateShoppingListFromWeekPlan, mockWeekPlan } from '@/lib/app-data'
import { weekContext, type ShoppingCategory as CategoryType } from '@/lib/shopping-data'
import { Button } from '@/components/ui/button'

interface ShoppingListProps {
  showEmptyState?: boolean
}

export function ShoppingList({ showEmptyState = false }: ShoppingListProps) {
  // Generate shopping list from week plan
  const [categories, setCategories] = useState<CategoryType[]>(() => 
    generateShoppingListFromWeekPlan(mockWeekPlan)
  )
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  // Calculate planned meals from week plan
  const plannedMeals = mockWeekPlan.filter(day => day.meals.dinner).length

  const handleToggleItem = (itemId: string) => {
    setCategories((prev) =>
      prev.map((category) => ({
        ...category,
        items: category.items.map((item) =>
          item.id === itemId ? { ...item, checked: !item.checked } : item
        ),
      }))
    )
  }

  const handleRegenerate = () => {
    // In a real app, this would fetch the current week plan from API/state
    const newCategories = generateShoppingListFromWeekPlan(mockWeekPlan)
    setCategories(newCategories)
    setLastUpdated(new Date())
  }

  const totalItems = categories.reduce((acc, cat) => acc + cat.items.length, 0)
  const checkedItems = categories.reduce(
    (acc, cat) => acc + cat.items.filter((item) => item.checked).length,
    0
  )

  if (showEmptyState || plannedMeals === 0) {
    return (
      <div className="min-h-screen bg-background">
        <ShoppingHeader
          weekNumber={weekContext.weekNumber}
          dateRange={weekContext.dateRange}
          plannedMeals={plannedMeals}
          progress={{ checked: 0, total: 0 }}
        />
        <EmptyState />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <ShoppingHeader
        weekNumber={weekContext.weekNumber}
        dateRange={weekContext.dateRange}
        plannedMeals={plannedMeals}
        progress={{ checked: checkedItems, total: totalItems }}
      />

      <main className="max-w-2xl mx-auto px-4 py-6 pb-8">
        {/* Regenerate Button */}
        <div className="flex gap-2 mb-6">
          <Button 
            variant="secondary" 
            className="flex-1 h-12 rounded-xl gap-2"
            onClick={handleRegenerate}
          >
            <RefreshCw className="h-4 w-4" />
            Opnieuw genereren
          </Button>
          <Button 
            variant="outline" 
            className="h-12 rounded-xl gap-2"
          >
            <Plus className="h-4 w-4" />
            Item toevoegen
          </Button>
        </div>

        {/* Last Updated */}
        <p className="text-xs text-muted-foreground mb-4 text-center">
          Gebaseerd op {plannedMeals} geplande maaltijden • Bijgewerkt {lastUpdated.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
        </p>

        {categories.map((category) => (
          <ShoppingCategory
            key={category.id}
            category={category}
            onToggleItem={handleToggleItem}
          />
        ))}

        {/* Completion Message */}
        {checkedItems === totalItems && totalItems > 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="font-serif text-3xl text-primary">V</span>
            </div>
            <p className="font-serif text-xl text-foreground">Alles opgehaald!</p>
            <p className="text-muted-foreground text-sm mt-1">
              Je bent klaar voor deze week
            </p>
          </div>
        )}
      </main>
    </div>
  )
}