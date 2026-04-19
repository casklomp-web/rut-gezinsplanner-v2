'use client'

import { useState } from 'react'
import { WeekHeader } from './week-header'
import { DayCard } from './day-card'
import { RecipeSelector } from '../recipes/recipe-selector'
import { mockWeekPlan, mockRecipes, type Recipe, type DayPlan } from '@/lib/app-data'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function WeekPlanner() {
  // State for week plan (start with mock data, but allow updates)
  const [weekPlan, setWeekPlan] = useState<DayPlan[]>(mockWeekPlan)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [isSelectorOpen, setIsSelectorOpen] = useState(false)
  
  // In a real app, determine today's date
  const todayIndex = 0 // Monday is today for demo

  const plannedMeals = weekPlan.filter(day => day.meals.dinner).length

  const handleAddMeal = (date: string) => {
    setSelectedDate(date)
    setIsSelectorOpen(true)
  }

  const handleSelectRecipe = (recipe: Recipe) => {
    if (!selectedDate) return

    // Update the week plan with the selected recipe
    setWeekPlan((prev) =>
      prev.map((day) =>
        day.date === selectedDate
          ? { ...day, meals: { ...day.meals, dinner: recipe } }
          : day
      )
    )

    setIsSelectorOpen(false)
    setSelectedDate(null)
  }

  const handleCloseSelector = () => {
    setIsSelectorOpen(false)
    setSelectedDate(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <WeekHeader />

      <main className="max-w-2xl mx-auto px-4 pb-8">
        {/* Summary Card */}
        <div className="mb-6 p-4 rounded-2xl bg-card border border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Deze week</p>
              <p className="font-medium text-foreground">
                {plannedMeals} van 7 dagen gepland
              </p>
            </div>
            <Button 
              variant="secondary"
              size="sm"
              className="gap-2 rounded-full"
            >
              <Sparkles className="h-4 w-4" />
              Vul aan met AI
            </Button>
          </div>
          {/* Mini progress bar */}
          <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${(plannedMeals / 7) * 100}%` }}
            />
          </div>
        </div>

        {/* Day Cards */}
        <div className="space-y-3">
          {weekPlan.map((day, index) => (
            <DayCard 
              key={day.date} 
              day={day} 
              isToday={index === todayIndex}
              onAddMeal={handleAddMeal}
              onChangeMeal={handleAddMeal}
            />
          ))}
        </div>
      </main>

      {/* Recipe Selector Modal */}
      <RecipeSelector
        isOpen={isSelectorOpen}
        onClose={handleCloseSelector}
        onSelect={handleSelectRecipe}
        selectedDate={selectedDate}
      />
    </div>
  )
}