'use client'

import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { currentWeek, weeklyFocusOptions } from '@/lib/app-data'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface WeekHeaderProps {
  activeFocus?: string
  onFocusChange?: (focusId: string | undefined) => void
}

export function WeekHeader({ activeFocus, onFocusChange }: WeekHeaderProps) {
  const [selectedFocus, setSelectedFocus] = useState(activeFocus)

  const handleFocusSelect = (focusId: string) => {
    const newFocus = selectedFocus === focusId ? undefined : focusId
    setSelectedFocus(newFocus)
    onFocusChange?.(newFocus)
  }

  return (
    <header className="bg-background">
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-4">
        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <div className="text-center">
            <h1 className="font-serif text-2xl tracking-tight text-foreground">
              Week {currentWeek.weekNumber}
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              {currentWeek.dateRange}
            </p>
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full text-muted-foreground hover:text-foreground"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Weekly Focus Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {weeklyFocusOptions.map((focus) => (
            <button
              key={focus.id}
              onClick={() => handleFocusSelect(focus.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-200',
                selectedFocus === focus.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              )}
            >
              {focus.id === 'meer-rust' && <Sparkles className="h-3.5 w-3.5" />}
              {focus.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}