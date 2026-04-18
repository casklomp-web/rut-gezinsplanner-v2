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

const DAYS = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag']
const DAYS_SHORT = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo']
const MEALS = [
  { key: 'breakfast', label: 'Ontbijt', icon: '🌅', color: 'bg-amber-50 border-amber-200' },
  { key: 'lunch', label: 'Lunch', icon: '🌞', color: 'bg-orange-50 border-orange-200' },
  { key: 'dinner', label: 'Diner', icon: '🌙', color: 'bg-indigo-50 border-indigo-200' }
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
    
    try {
      const response = await fetch('/api/meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, meal_type, recipe_id: recipeId })
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        console.error('Error adding meal:', result.error)
        return
      }
      
      setShowModal(false)
      fetchData()
    } catch (err) {
      console.error('Network error:', err)
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500">Laden...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">R</span>
              </div>
              <h1 className="text-xl font-semibold text-slate-900">Rut</h1>
            </div>
            <form action="/auth/signout" method="post">
              <button className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                Uitloggen
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-1 mb-8 bg-slate-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('planner')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'planner' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Weekplanner
          </button>
          <button
            onClick={() => setActiveTab('shopping')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'shopping' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Boodschappen
            {mealPlans.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                {mealPlans.length}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'planner' ? (
          <div className="space-y-6">
            {/* Week Navigation */}
            <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
              <button 
                onClick={prevWeek} 
                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">Vorige week</span>
              </button>
              
              <div className="text-center">
                <p className="text-lg font-semibold text-slate-900">
                  Week {getWeekNumber(new Date(weekStart))}
                </p>
                <p className="text-sm text-slate-500">
                  {formatDateRange(weekStart)}
                </p>
              </div>
              
              <button 
                onClick={nextWeek} 
                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <span className="hidden sm:inline">Volgende week</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Week Grid - Mobile */}
            <div className="lg:hidden space-y-4">
              {DAYS.map((day, dayIndex) => (
                <div key={day} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-900">{day}</span>
                      <span className="text-sm text-slate-500">{formatDate(getDate(dayIndex))}</span>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    {MEALS.map(meal => {
                      const planned = getMeal(dayIndex, meal.key)
                      return (
                        <div key={meal.key}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">{meal.icon}</span>
                            <span className="text-sm font-medium text-slate-600">{meal.label}</span>
                          </div>
                          {planned ? (
                            <div className={`p-3 rounded-lg border ${meal.color}`}>
                              <p className="font-medium text-slate-900 text-sm">{planned.recipe.name}</p>
                              <p className="text-xs text-slate-500 mt-1">{planned.recipe.prep_time_minutes} min</p>
                              <button 
                                onClick={() => removeMeal(planned.id)}
                                className="text-xs text-red-600 hover:text-red-700 mt-2 font-medium"
                              >
                                Verwijderen
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedSlot({ day: dayIndex, meal: meal.key })
                                setShowModal(true)
                              }}
                              className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all text-sm font-medium"
                            >
                              + Maaltijd toevoegen
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Week Grid - Desktop */}
            <div className="hidden lg:grid lg:grid-cols-7 gap-4">
              {DAYS.map((day, dayIndex) => (
                <div key={day} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                  <div className="bg-slate-50 px-3 py-4 border-b border-slate-200 text-center">
                    <p className="font-semibold text-slate-900 text-sm">{DAYS_SHORT[dayIndex]}</p>
                    <p className="text-xs text-slate-500 mt-1">{formatDate(getDate(dayIndex))}</p>
                  </div>
                  <div className="p-3 space-y-3 flex-1">
                    {MEALS.map(meal => {
                      const planned = getMeal(dayIndex, meal.key)
                      return (
                        <div key={meal.key} className="space-y-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm">{meal.icon}</span>
                            <span className="text-xs font-medium text-slate-500">{meal.label}</span>
                          </div>
                          {planned ? (
                            <div className={`p-2.5 rounded-lg border ${meal.color} group`}>
                              <p className="font-medium text-slate-900 text-xs leading-tight line-clamp-2">{planned.recipe.name}</p>
                              <p className="text-xs text-slate-500 mt-1">{planned.recipe.prep_time_minutes} min</p>
                              <button 
                                onClick={() => removeMeal(planned.id)}
                                className="text-xs text-red-600 hover:text-red-700 mt-2 opacity-0 group-hover:opacity-100 transition-opacity font-medium"
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
                              className="w-full py-4 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all text-xs font-medium"
                            >
                              +
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
        ) : (
          /* Shopping List */
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Boodschappenlijst</h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Week {getWeekNumber(new Date(weekStart))} • {mealPlans.length} maaltijden
                    </p>
                  </div>
                  {shoppingItems.length > 0 && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                      {shoppingItems.length} items
                    </span>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                {shoppingItems.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <p className="text-slate-900 font-medium">Geen boodschappen nodig</p>
                    <p className="text-slate-500 text-sm mt-1">Plan eerst maaltijden in de weekplanner</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {['groente', 'fruit', 'vlees', 'vis', 'zuivel', 'granen', 'overig'].map(category => {
                      const categoryItems = shoppingItems.filter(item => item.category === category)
                      if (categoryItems.length === 0) return null
                      
                      const categoryConfig: Record<string, { label: string; icon: string; color: string }> = {
                        'groente': { label: 'Groente', icon: '🥬', color: 'text-green-600 bg-green-50' },
                        'fruit': { label: 'Fruit', icon: '🍎', color: 'text-red-600 bg-red-50' },
                        'vlees': { label: 'Vlees', icon: '🥩', color: 'text-rose-600 bg-rose-50' },
                        'vis': { label: 'Vis', icon: '🐟', color: 'text-blue-600 bg-blue-50' },
                        'zuivel': { label: 'Zuivel', icon: '🥛', color: 'text-yellow-600 bg-yellow-50' },
                        'granen': { label: 'Granen', icon: '🌾', color: 'text-amber-600 bg-amber-50' },
                        'overig': { label: 'Overig', icon: '📦', color: 'text-slate-600 bg-slate-50' }
                      }
                      
                      const config = categoryConfig[category]
                      
                      return (
                        <div key={category}>
                          <div className="flex items-center gap-2 mb-3">
                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${config.color}`}>
                              {config.icon}
                            </span>
                            <h3 className="font-semibold text-slate-900">{config.label}</h3>
                            <span className="text-sm text-slate-400">({categoryItems.length})</span>
                          </div>
                          <div className="space-y-2">
                            {categoryItems.map((item, idx) => (
                              <label 
                                key={idx} 
                                className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 cursor-pointer transition-all group"
                              >
                                <input 
                                  type="checkbox" 
                                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 transition-colors" 
                                />
                                <span className="flex-1 text-slate-700 font-medium">{item.name}</span>
                                <span className="text-slate-500 text-sm tabular-nums bg-slate-100 px-2 py-1 rounded">
                                  {item.amount} {item.unit}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Recipe Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Kies een recept
                </h2>
                <p className="text-sm text-slate-500">
                  {selectedSlot && DAYS[selectedSlot.day]} • {MEALS.find(m => m.key === selectedSlot?.meal)?.label}
                </p>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh] space-y-2">
              {recipes.map(recipe => (
                <button
                  key={recipe.id}
                  onClick={() => addMeal(recipe.id)}
                  className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">{recipe.name}</p>
                      <p className="text-sm text-slate-500 mt-1 capitalize">{recipe.category}</p>
                    </div>
                    <span className="text-sm text-slate-400 bg-slate-100 px-2 py-1 rounded">
                      {recipe.prep_time_minutes} min
                    </span>
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

function formatDateRange(weekStart: string): string {
  const start = new Date(weekStart)
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  
  const startStr = start.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long' })
  const endStr = end.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long' })
  
  return `${startStr} - ${endStr}`
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}
