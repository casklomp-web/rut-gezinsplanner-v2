'use client'

import { ChevronLeft, Share2, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ShoppingHeaderProps {
  weekNumber: number
  dateRange: string
  plannedMeals: number
  progress: { checked: number; total: number }
}

export function ShoppingHeader({
  weekNumber,
  dateRange,
  plannedMeals,
  progress,
}: ShoppingHeaderProps) {
  const progressPercent = Math.round((progress.checked / progress.total) * 100)

  return (
    <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50">
      <div className="max-w-2xl mx-auto px-4 py-4">
        {/* Top Row - Navigation */}
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" className="rounded-full -ml-2 text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Title */}
        <div className="mb-4">
          <h1 className="font-serif text-3xl tracking-tight text-foreground">
            Boodschappenlijst
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Week {weekNumber} · {dateRange}
          </p>
        </div>

        {/* Context Pills */}
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>{plannedMeals} maaltijden gepland</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {progress.checked} van {progress.total} items
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-1 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </header>
  )
}