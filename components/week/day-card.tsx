'use client'

import { Plus, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DayPlan } from '@/lib/app-data'

interface DayCardProps {
  day: DayPlan
  isToday?: boolean
  onAddMeal?: (date: string) => void
}

export function DayCard({ day, isToday = false, onAddMeal }: DayCardProps) {
  const hasDinner = !!day.meals.dinner
  
  return (
    <div 
      className={cn(
        'rounded-2xl border transition-all duration-200',
        isToday 
          ? 'bg-card border-primary/20 shadow-sm ring-1 ring-primary/10' 
          : 'bg-card/50 border-border/50 hover:bg-card hover:border-border'
      )}
    >
      {/* Day Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
        <div className="flex items-center gap-3">
          <div 
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold',
              isToday 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground'
            )}
          >
            {day.dayShort}
          </div>
          <div>
            <p className={cn(
              'font-medium',
              isToday ? 'text-foreground' : 'text-foreground/90'
            )}>
              {day.dayName}
            </p>
            {isToday && (
              <p className="text-xs text-primary font-medium">Vandaag</p>
            )}
          </div>
        </div>
      </div>

      {/* Meal Content */}
      <div className="p-4">
        {hasDinner ? (
          <div className="group cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Avondeten
                </p>
                <h3 className="font-medium text-foreground truncate pr-2">
                  {day.meals.dinner?.name}
                </h3>
                <div className="flex items-center gap-3 mt-2">
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {day.meals.dinner?.prepTime} min
                  </span>
                  {day.meals.dinner?.tags.slice(0, 2).map((tag) => (
                    <span 
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              {/* Meal Image Placeholder */}
              <div className="w-16 h-16 rounded-xl bg-secondary/50 flex-shrink-0 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-primary/5 to-primary/10" />
              </div>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => onAddMeal?.(day.date)}
            className="w-full py-6 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border/50 text-muted-foreground hover:border-primary/30 hover:text-primary transition-all duration-200 group"
          >
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <Plus className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium">Voeg maaltijd toe</span>
          </button>
        )}
      </div>
    </div>
  )
}