'use client'

import { useState, useEffect } from 'react'

interface Recipe {
  id: string
  name: string
  prep_time_minutes: number
  category: string
}

interface MealPlan {
  id: string
  date: string
  meal_type: string
  recipe: Recipe
}

interface ShoppingItem {
  name: string
  amount: number
  unit: string
  category: string
}

const DAYS = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo']
const MEALS = [
  { key: 'breakfast', label: 'Ontbijt', icon: '🌅' },
  { key: 'lunch', label: 'Lunch', icon: '🌞' },
  { key: 'dinner', label: 'Diner', icon: '🌙' }
]

export default function WeekPlanner() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([])
  const [weekStart, setWeekStart] = useState(getMonday(new Date()))
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'planner' | 'shopping'>('planner')
  const [showModal, setShowModal] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<{day: number, meal: string} | null>(null)
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([])

  useEffect(() => {
    fetchData()
  }, [weekStart])

  useEffect(() => {
    if (activeTab === 'shopping') {
      fetchShoppingList()
    }
  }, [activeTab, weekStart])

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

  async function fetchShoppingList() {
    const s = await fetch(`/api/shopping-list?week_start=${weekStart}`)
    const sd = await s.json()
    if (sd.items) setShoppingItems(sd.items)
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
    
    const date = getDate(selectedSlot.day)
    const meal_type = selectedSlot.meal
    
    console.log('Adding meal:', { date, meal_type, recipeId })
    
    try {
      const response = await fetch('/api/meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          meal_type,
          recipe_id: recipeId
        })
      })
      
      const result = await response.json()
      console.log('Response:', result)
      
      if (!response.ok) {
        console.error('Error adding meal:', result.error)
        alert('Fout bij toevoegen: ' + result.error)
        return
      }
      
      setShowModal(false)
      fetchData()
    } catch (err) {
      console.error('Network error:', err)
      alert('Netwerk fout bij toevoegen maaltijd')
    }
  }

  async function removeMeal(id: string) {
    await fetch(`/api/meal-plan?id=${id}`, { method: 'DELETE' })
    fetchData()
  }

  function generateShoppingList(): ShoppingItem[] {
    const items: ShoppingItem[] = []
    
    mealPlans.forEach(mp => {
      // For now, add placeholder items based on recipe name
      // In real implementation, this would come from recipe_ingredients table
      items.push({
        name: `Ingrediënten voor ${mp.recipe.name}`,
        amount: 1,
        unit: 'portie',
        category: 'overig'
      })
    })
    
    return items
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
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Weekplanner</h1>
          <form action="/auth/signout" method="post">
            <button className="text-gray-600 hover:text-gray-900">Uitloggen</button>
          </form>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('planner')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'planner' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
            }`}
          >
            📅 Weekplanner
          </button>
          <button
            onClick={() => setActiveTab('shopping')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'shopping' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
            }`}
          >
            🛒 Boodschappen ({mealPlans.length} maaltijden)
          </button>
        </div>

        {activeTab === 'planner' ? (
          <>
            {/* Week navigation */}
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow mb-6">
              <button onClick={prevWeek} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                ← Vorige
              </button>
              <div className="text-center">
                <p className="font-medium">Week van {formatDate(weekStart)}</p>
                <p className="text-sm text-gray-500">{formatDate(getDate(6))}</p>
              </div>
              <button onClick={nextWeek} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Volgende →
              </button>
            </div>

            {/* Week grid */}
            <div className="grid grid-cols-7 gap-2">
              {DAYS.map((day, dayIndex) => (
                <div key={day} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="bg-blue-100 p-2 text-center font-semibold text-sm">
                    {day}<br/>
                    <span className="text-xs font-normal">{formatDate(getDate(dayIndex))}</span>
                  </div>
                  <div className="p-2 space-y-2">
                    {MEALS.map(meal => {
                      const planned = getMeal(dayIndex, meal.key)
                      return (
                        <div key={meal.key} className="text-xs">
                          <div className="text-gray-500 mb-1">{meal.icon} {meal.label}</div>
                          {planned ? (
                            <div className="bg-green-50 p-2 rounded border border-green-200">
                              <div className="font-medium truncate text-sm">{planned.recipe.name}</div>
                              <div className="text-gray-500 text-xs">{planned.recipe.prep_time_minutes} min</div>
                              <button 
                                onClick={() => removeMeal(planned.id)}
                                className="text-red-500 text-xs mt-1 hover:underline"
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
                              className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-gray-500 hover:border-blue-500 hover:text-blue-500 text-xs"
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
          </>
        ) : (
          /* Shopping List */
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">🛒 Boodschappenlijst</h2>
            <p className="text-gray-600 mb-4">
              Gebaseerd op {mealPlans.length} geplande maaltijden
            </p>
            {shoppingItems.length === 0 ? (
              <p className="text-gray-500">Geen ingrediënten gevonden. Plan eerst maaltijden in de weekplanner.</p>
            ) : (
              <div className="space-y-6">
                {['groente', 'fruit', 'vlees', 'vis', 'zuivel', 'granen', 'overig'].map(category => {
                  const categoryItems = shoppingItems.filter(item => item.category === category)
                  if (categoryItems.length === 0) return null
                  
                  return (
                    <div key={category}>
                      <h3 className="font-semibold text-gray-700 mb-2 capitalize">{category}</h3>
                      <div className="space-y-2">
                        {categoryItems.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded hover:bg-gray-100">
                            <input type="checkbox" className="w-5 h-5 rounded border-gray-300" />
                            <span className="flex-1">{item.name.trim()}</span>
                            <span className="text-gray-500 text-sm font-medium">{item.amount} {item.unit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recipe Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Kies recept voor {selectedSlot && DAYS[selectedSlot.day]} - {MEALS.find(m => m.key === selectedSlot?.meal)?.label}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 text-xl">✕</button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh] space-y-2">
              {recipes.map(recipe => (
                <button
                  key={recipe.id}
                  onClick={() => addMeal(recipe.id)}
                  className="w-full text-left p-3 border rounded hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  <div className="font-medium">{recipe.name}</div>
                  <div className="text-sm text-gray-500">
                    {recipe.prep_time_minutes} min • {recipe.category}
                  </div>
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
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return d.toISOString().split('T')[0]
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })
}
