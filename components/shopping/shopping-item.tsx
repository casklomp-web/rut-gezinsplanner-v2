'use client'

import { Check } from 'lucide-react'
import type { ShoppingItem as ItemType } from '@/lib/shopping-data'
import { cn } from '@/lib/utils'

interface ShoppingItemProps {
  item: ItemType
  onToggle: () => void
  isLast?: boolean
}

export function ShoppingItem({ item, onToggle, isLast = false }: ShoppingItemProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'w-full flex items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-secondary/50 active:bg-secondary group',
        !isLast && 'border-b border-border/30'
      )}
    >
      {/* Custom Checkbox */}
      <div
        className={cn(
          'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200',
          item.checked
            ? 'bg-primary border-primary'
            : 'border-muted-foreground/40 group-hover:border-primary/60'
        )}
      >
        {item.checked && (
          <Check className="w-3 h-3 text-primary-foreground" strokeWidth={3} />
        )}
      </div>

      {/* Item Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span
            className={cn(
              'font-medium transition-all duration-200',
              item.checked
                ? 'text-muted-foreground line-through decoration-muted-foreground/50'
                : 'text-foreground'
            )}
          >
            {item.name}
          </span>
          {item.fromMeal && (
            <span className="text-xs text-muted-foreground/70 truncate hidden sm:inline">
              {item.fromMeal}
            </span>
          )}
        </div>
      </div>

      {/* Quantity */}
      <div
        className={cn(
          'flex-shrink-0 text-right tabular-nums',
          item.checked ? 'text-muted-foreground/60' : 'text-muted-foreground'
        )}
      >
        <span className="font-medium">{item.quantity}</span>
        <span className="text-sm ml-1">{item.unit}</span>
      </div>
    </button>
  )
}