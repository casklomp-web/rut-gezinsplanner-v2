'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { ShoppingHeader } from './shopping-header'
import { ShoppingCategory } from './shopping-category'
import { EmptyState } from './empty-state'
import { mockShoppingData, weekContext, type ShoppingCategory as CategoryType } from '@/lib/shopping-data'
import { Button } from '@/components/ui/button'

interface ShoppingListProps {
  showEmptyState?: boolean
}

export function ShoppingList({ showEmptyState = false }: ShoppingListProps) {
  const [categories, setCategories] = useState<CategoryType[]>(mockShoppingData)

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

  const totalItems = categories.reduce((acc, cat) => acc + cat.items.length, 0)
  const checkedItems = categories.reduce(
    (acc, cat) => acc + cat.items.filter((item) => item.checked).length,
    0
  )

  if (showEmptyState) {
    return (
      <div className="min-h-screen bg-background">
        <ShoppingHeader
          weekNumber={weekContext.weekNumber}
          dateRange={weekContext.dateRange}
          plannedMeals={0}
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
        plannedMeals={weekContext.plannedMeals}
        progress={{ checked: checkedItems, total: totalItems }}
      />

      <main className="max-w-2xl mx-auto px-4 py-6 pb-8">
        {/* Add Item Button */}
        <Button 
          variant="secondary" 
          className="w-full mb-6 h-12 rounded-xl gap-2 text-muted-foreground hover:text-foreground"
        >
          <Plus className="h-4 w-4" />
          Item toevoegen
        </Button>

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