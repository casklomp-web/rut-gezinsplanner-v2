'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Recipe {
  id: string
  name: string
  category: string
  prep_time_minutes: number
  difficulty: string
  tags: string[]
}

interface MealPlanItem {
  id: string
  date: string
  meal_type: string
  recipe: Recipe
  notes: string
}

const DAYS = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag']
const MEAL_TYPES = [
  { key: 'breakfast', label: '🌅 Ontbijt' },
n  { key: 'lunch', label: '🌞 Lunch' },
  { key: 'dinner', label: '🌙 Diner' }
]

export default function WeekPlanner() {
  const router = useRouter()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [mealPlans, setMealPlans] = useState<MealPlanItem[]>([])
  const [weekStart, setWeekStart] = useState(getMonday(new Date()))
  const [loading, setLoading] = useState(true)
  const [selectedCell, setSelectedCell] = useState<{day: number, meal: string} | null>(null)
  const [showRecipeModal, setShowRecipeModal] = useState(false)

  useEffect(() => {
    loadData()
  }, [weekStart])

  async function loadData() {
    setLoading(true)
    
    const recipesRes = await fetch('/api/recipes')
    const recipesData = await recipesRes.json()
    if (recipesData.recipes) {
      setRecipes(recipesData.recipes)
    }

    const mealPlanRes = await fetch(`/api/meal-plan?week_start=${weekStart}`)
    const mealPlanData = await mealPlanRes.json()
    if (mealPlanData.mealPlans) {
      setMealPlans(mealPlanData.mealPlans)
    }
    
    setLoading(false)
  }

  function getMealForDay(dayIndex: number, mealType: string): MealPlanItem | undefined {
    const date = getDateForDay(dayIndex)
    return mealPlans.find(mp => mp.date === date && mp.meal_type === mealType)
  }

  function getDateForDay(dayIndex: number): string {
    const date = new Date(weekStart)
    date.setDate(date.getDate() + dayIndex)
    return date.toISOString().split('T')[0]
  }

  function previousWeek() {
    const date = new Date(weekStart)
    date.setDate(date.getDate() - 7)
    setWeekStart(date.toISOString().split('T')[0])
  }

  function nextWeek() {
    const date = new Date(weekStart)
    date.setDate(date.getDate() + 7)
    setWeekStart(date.toISOString().split('T')[0])
  }

  async function assignRecipe(recipeId: string) {
    if (!selectedCell) return
    
    const date = getDateForDay(selectedCell.day)
    
    await fetch('/api/meal-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date,
        meal_type: selectedCell.meal,
        recipe_id: recipeId
      })
    })
    
    setShowRecipeModal(false)
    setSelectedCell(null)
    loadData()
  }

  async function removeMeal(mealId: string) {
    await fetch(`/api/meal-plan?id=${mealId}`, { method: 'DELETE' })
    loadData()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <div className="text-muted">Laden...</div>
      </div>
    )
  }
return
(
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-primary">Weekplanner</h1>
          <form action="/auth/signout" method="post">
            <button type="submit" className="text-muted hover:text-foreground transition-colors">
              Uitloggen
            </button>
          </form>
        </div>
        
        <div className="flex items-center justify-between bg-white rounded-xl p-4 border border-border">
          <button onClick={previousWeek} className="text-primary hover:bg-primary-50 px-4 py-2 rounded-lg transition-colors">
            ← Vorige week
          </button>
          <div className="text-center">
            <p className="font-medium text-foreground">
              Week van {formatDate(weekStart)}
            </p>
            <p className="text-sm text-muted">
              {formatDate(getDateForDay(6))}
            </p>
          </div>
          <button onClick={nextWeek} className="text-primary hover:bg-primary-50 px-4 py-2 rounded-lg transition-colors">
            Volgende week →
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {DAYS.map((day, dayIndex) => (
            <div key={day} className="bg-white rounded-xl border border-border overflow-hidden">
              <div className="bg-primary-50 p-3 border-b border-border">
                <p className="font-semibold text-primary text-center">{day}</p>
                <p className="text-xs text-muted text-center">
                  {formatDayDate(getDateForDay(dayIndex))}
                </p>
              </div>
              
              <div className="p-2 space-y-2">
                {MEAL_TYPES.map(meal => {
                  const mealPlan = getMealForDay(dayIndex, meal.key)
                  
                  return (
                    <div key={meal.key} className="space-y-1">
                      <p className="text-xs text-muted font-medium">{meal.label}</p>
                      
                      {mealPlan ? (
                        <div className="bg-primary-50 rounded-lg p-2 border border-primary-100">
                          <p className="text-sm font-medium text-foreground line-clamp-2">
                            {mealPlan.recipe.name}
                          </p>
                          {mealPlan.recipe.prep_time_minutes && (
                            <p className="text-xs text-muted mt-1">
                              ⏱️ {mealPlan.recipe.prep_time_minutes} min
                            </p>
                          )}
                          <button
                            onClick={() => removeMeal(mealPlan.id)}
                            className="text-xs text-red-400 hover:text-red-600 mt-1"
                          >
                            Verwijder
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedCell({ day: dayIndex, meal: meal.key })
                            setShowRecipeModal(true)
                          }}
                          className="w-full py-3 border-2 border-dashed border-border rounded-lg text-muted hover:border-primary hover:text-primary transition-colors text-sm"
                        >
                          + Toevoegen
                        </button>
                      )}
               </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showRecipeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[
80vh] overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                Kies een recept
              </h2>
              <button
                onClick={() => setShowRecipeModal(false)}
                className="text-muted hover:text-foreground"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {recipes.map(recipe => (
                  <button
                    key={recipe.id}
                    onClick={() => assignRecipe(recipe.id)}
                    className="text-left p-3 rounded-lg border border-border hover:border-primary hover:bg-primary-50 transition-colors"
                  >
                    <p className="font-medium text-foreground">{recipe.name}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted">
                      {recipe.prep_time_minutes && (
                        <span>⏱️ {recipe.prep_time_minutes} min</span>
                      )}
                      {recipe.difficulty && (
                        <span>• {recipe.difficulty}</span>
                      )}
                    </div>
                    {recipe.tags && recipe.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {recipe.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function getMonday(date: Date): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return d.toISOString().split('T')[0]
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })
}

function formatDayDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })
}
