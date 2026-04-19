'use client'

import { ShoppingItem } from './shopping-item'
import type { ShoppingCategory as CategoryType } from '@/lib/shopping-data'

interface ShoppingCategoryProps {
  category: CategoryType
  onToggleItem: (itemId: string) => void
}

export function ShoppingCategory({ category, onToggleItem }: ShoppingCategoryProps) {
  const uncheckedItems = category.items.filter(item => !item.checked)
  const checkedItems = category.items.filter(item => item.checked)

  return (
    <section className="mb-8">
      {/* Category Header */}
      <div className="flex items-center gap-3 mb-3 px-1">
        <span className="text-lg">{category.icon}</span>
        <h2 className="font-medium text-foreground tracking-tight">
          {category.name}
        </h2>
        <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
          {uncheckedItems.length}
        </span>
      </div>

      {/* Items Container */}
      <div className="bg-card rounded-2xl border border-border/60 overflow-hidden shadow-sm">
        {/* Unchecked Items */}
        {uncheckedItems.map((item, index) => (
          <ShoppingItem
            key={item.id}
            item={item}
            onToggle={() => onToggleItem(item.id)}
            isLast={index === uncheckedItems.length - 1 && checkedItems.length === 0}
          />
        ))}

        {/* Checked Items (faded) */}
        {checkedItems.length > 0 && (
          <>
            {uncheckedItems.length > 0 && (
              <div className="border-t border-dashed border-border/50" />
            )}
            {checkedItems.map((item, index) => (
              <ShoppingItem
                key={item.id}
                item={item}
                onToggle={() => onToggleItem(item.id)}
                isLast={index === checkedItems.length - 1}
              />
            ))}
          </>
        )}
      </div>
    </section>
  )
}