'use client'

import { useState, useEffect } from 'react'

interface Recipe {
  id: string
  name: string
  prep_time_minutes: number
}

interface MealPlan {
  id: string
  date: string
  meal_type: string
  recipe: Recipe
}

const DAYS = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo']
const MEALS = [
  { key: 'breakfast', label: 'Ontbijt' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'dinner', label: 'Diner' }
]

export default function WeekPlanner() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([])
  const [weekStart, setWeekStart] = useState(getMonday(new Date()))
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<{day: number, meal: string} | null>(null)

  useEffect(() => {
    fetchData()
  }, [weekStart])

  async function fetchData() {
    setLoading(true)
    
    const r = await fetch('/api/recipes')
    const rd = await r.json()
    if (rd.recipes) setRecipes(rd.recipes)

    const m = await fetch(`/api/meal-plan?week_start=${weekStart}`)
    const md = await m.json()
    if (md.mealPlans) setMealPlans(md.mealPlans)
    
    setLoading(false)
  }

  function getMeal(dayIndex: number, mealType: string) {
    const date = getDate(dayIndex)
    return mealPlans.find(mp => mp.date === date && mp.meal_type === mealType)
  }

  function getDate(dayIndex: number) {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + dayIndex)
    return d.toISOString().split('T')[0]
  }

  async function addMeal(recipeId: string) {
    if (!selectedSlot) return
    await fetch('/api/meal-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: getDate(selectedSlot.day),
        meal_type: selectedSlot.meal,
        recipe_id: recipeId
      })
    })
    setShowModal(false)
    fetchData()
  }

  async function removeMeal(id: string) {
    await fetch(`/api/meal-plan?id=${id}`, { method: 'DELETE' })
    fetchData()
  }

  function prevWeek() {
    const d = new Date(weekStart)
    d.setDate(d.getDate() - 7)
    setWeekStart(d.toISOString().split('T')[0])
  }

  function nextWeek() {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + 7)
    setWeekStart(d.toISOString().split('T')[0])
  }

  if (loading) return <div className="p-8 text-center">Laden...</div>
return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Weekplanner</h1>
          <form action="/auth/signout" method="post">
            <button className="text-gray-600 hover:text-gray-900">Uitloggen</button>
          </form>
        </div>

        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow mb-6">
          <button onClick={prevWeek} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            ← Vorige
          </button>
          <span className="font-medium">Week van {weekStart}</span>
          <button onClick={nextWeek} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Volgende →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {DAYS.map((day, dayIndex) => (
            <div key={day} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-blue-100 p-2 text-center font-semibold">
                {day}
              </div>
              <div className="p-2 space-y-2">
                {MEALS.map(meal => {
                  const planned = getMeal(dayIndex, meal.key)
                  return (
                    <div key={meal.key} className="text-xs">
                      <div className="text-gray-500 mb-1">{meal.label}</div>
                      {planned ? (
                        <div className="bg-green-50 p-2 rounded border border-green-200">
                          <div className="font-medium truncate">{planned.recipe.name}</div>
                          <button 
                            onClick={() => removeMeal(planned.id)}
n                            className="text-red-500 text-xs mt-1"
                          >
                            Verwijder
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedSlot({ day: dayIndex, meal: meal.key })
                            setShowModal(true)
                          }}
                          className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-gray-500 hover:border-blue-500 hover:text-blue-500"
                        >
                          + Toevoegen
                        </button>
                      )}
                    </div>
n                  )
                })}
n              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Kies recept</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500">✕</button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh] space-y-2">
              {recipes.map(recipe => (
                <button
                  key={recipe.id}
                  onClick={() => addMeal(recipe.id)}
                  className="w-full text-left p-3 border rounded hover:bg-blue-50 hover:border-blue-300"
                >
                  <div className="font-medium">{recipe.name}</div>
n                  {recipe.prep_time_minutes && (
                <div className="text-sm text-gray-500">{recipe.prep_time_minutes} min</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function getMonday(date: Date): string {
  const d = new Date(date)
n  const day = d.getDay()
n  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
n  d.setDate(diff)
n  return d.toISOString().split('T')[0]
}
