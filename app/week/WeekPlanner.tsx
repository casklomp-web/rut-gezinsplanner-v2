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

const DAYS_SHORT = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo']
const DAYS_FULL = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag']

const MEALS = [
  { key: 'breakfast', label: 'Ontbijt', color: 'bg-amber-50 border-amber-200 text-amber-900' },
  { key: 'lunch', label: 'Lunch', color: 'bg-emerald-50 border-emerald-200 text-emerald-900' },
  { key: 'dinner', label: 'Diner', color: 'bg-indigo-50 border-indigo-200 text-indigo-900' }
] as const

const CATEGORY_CONFIG: Record<string, { label: string; color: string; text: string }> = {
  'groente': { label: 'Groente', color: 'bg-green-100', text: 'text-green-800' },
  'fruit': { label: 'Fruit', color: 'bg-red-100', text: 'text-red-800' },
  'vlees': { label: 'Vlees', color: 'bg-rose-100', text: 'text-rose-800' },
  'vis': { label: 'Vis', color: 'bg-blue-100', text: 'text-blue-800' },
  'zuivel': { label: 'Zuivel', color: 'bg-yellow-100', text: 'text-yellow-800' },
  'granen': { label: 'Granen', color: 'bg-amber-100', text: 'text-amber-800' },
  'overig': { label: 'Overig', color: 'bg-gray-100', text: 'text-gray-800' }
}

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
    const [recipesRes, mealPlansRes] = await Promise.all([
      fetch('/api/recipes'),
      fetch(`/api/meal-plan?week_start=${weekStart}`)
    ])
    
    const recipesData = await recipesRes.json()
    const mealPlansData = await mealPlansRes.json()
    
    if (recipesData.recipes) setRecipes(recipesData.recipes)
    if (mealPlansData.mealPlans) setMealPlans(mealPlansData.mealPlans)
    
    setLoading(false)
  }

  async function fetchShoppingList() {
    const res = await fetch(`/api/shopping-list?week_start=${weekStart}`)
    const data = await res.json()
    if (data.items) setShoppingItems(data.items)
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
    
    const response = await fetch('/api/meal-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: getDate(selectedSlot.day),
        meal_type: selectedSlot.meal,
        recipe_id: recipeId
      })
    })
    
    if (response.ok) {
      setShowModal(false)
      fetchData()
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Laden...</div>
      </div>
    )
  }

  const weekNumber = getWeekNumber(new Date(weekStart))
  const dateRange = formatDateRange(weekStart)
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="font-bold text-xl text-gray-900">Rut</span>
            </div>
            <form action="/auth/signout" method="post">
              <button className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Uitloggen
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('planner')}
            className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'planner' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
            }`}
          >
            Weekplanner
          </button>
          <button
            onClick={() => setActiveTab('shopping')}
            className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'shopping' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
            }`}
          >
            Boodschappen
            {mealPlans.length > 0 && (
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'shopping' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700'
              }`}>
                {mealPlans.length}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'planner' ? (
          <div className="space-y-6">
            {/* Week Navigation */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <button 
                  onClick={prevWeek}
                  className="p-3 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">Week {weekNumber}</p>
                  <p className="text-base text-gray-500 mt-1">{dateRange}</p>
                </div>
                
                <button 
                  onClick={nextWeek}
                  className="p-3 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile View */}
            <div className="lg:hidden space-y-4">
              {DAYS_FULL.map((day, dayIndex) => {
                const isToday = getDate(dayIndex) === today
                return (
                  <div key={day} className={`bg-white rounded-2xl shadow-sm border-2 overflow-hidden ${
                    isToday ? 'border-blue-500' : 'border-gray-200'
                  }`}>
                    <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-gray-900 text-lg">{DAYS_SHORT[dayIndex]}</span>
                          {isToday && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                              Vandaag
                            </span>
                          )}
                        </div>
                        <span className="text-base text-gray-500">{formatDate(getDate(dayIndex))}</span>
                      </div>
                    </div>
                    <div className="p-5 space-y-4">
                      {MEALS.map(meal => {
                        const planned = getMeal(dayIndex, meal.key)
                        return (
                          <div key={meal.key}>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                              {meal.label}
                            </p>
                            {planned ? (
                              <div className={`p-4 rounded-xl border-2 ${meal.color}`}>
                                <p className="font-bold text-base">{planned.recipe.name}</p>
                                <p className="text-sm opacity-70 mt-1">{planned.recipe.prep_time_minutes} min</p>
                                <button 
                                  onClick={() => removeMeal(planned.id)}
                                  className="text-sm font-semibold text-red-600 hover:text-red-700 mt-3"
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
                                className="w-full py-4 px-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all font-semibold flex items-center justify-center gap-2"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Toevoegen
                              </button>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Desktop View */}
            <div className="hidden lg:grid lg:grid-cols-7 gap-4">
              {DAYS_SHORT.map((dayShort, dayIndex) => {
                const isToday = getDate(dayIndex) === today
                return (
                  <div key={dayShort} className={`bg-white rounded-2xl shadow-sm border-2 overflow-hidden flex flex-col ${
                    isToday ? 'border-blue-500' : 'border-gray-200'
                  }`}>
                    <div className={`px-3 py-4 border-b text-center ${
                      isToday ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <p className={`font-bold text-lg ${isToday ? 'text-blue-900' : 'text-gray-900'}`}>{dayShort}</p>
                      <p className={`text-sm mt-1 ${isToday ? 'text-blue-600' : 'text-gray-500'}`}>
                        {formatDate(getDate(dayIndex))}
                      </p>
                    </div>
                    <div className="p-3 space-y-3 flex-1">
                      {MEALS.map(meal => {
                        const planned = getMeal(dayIndex, meal.key)
                        return (
                          <div key={meal.key} className="space-y-1">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                              {meal.label}
                            </p>
                            {planned ? (
                              <div className={`p-3 rounded-xl border-2 ${meal.color} group`}>
                                <p className="font-bold text-sm leading-snug line-clamp-2">
                                  {planned.recipe.name}
                                </p>
                                <p className="text-xs opacity-70 mt-1">{planned.recipe.prep_time_minutes} min</p>
                                <button 
                                  onClick={() => removeMeal(planned.id)}
                                  className="text-xs font-semibold text-red-600 hover:text-red-700 mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
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
                                className="w-full h-14 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center"
                              >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <ShoppingList 
            items={shoppingItems} 
            mealCount={mealPlans.length}
            weekNumber={weekNumber}
            dateRange={dateRange}
          />
        )}
      </main>

      {/* Recipe Modal */}
      {showModal && selectedSlot && (
        <RecipeModal
          recipes={recipes}
          selectedDay={DAYS_FULL[selectedSlot.day]}
          selectedMeal={MEALS.find(m => m.key === selectedSlot.meal)?.label || ''}
          onClose={() => setShowModal(false)}
          onSelect={addMeal}
        />
      )}
    </div>
  )
}

// Sub-components

function ShoppingList({ items, mealCount, weekNumber, dateRange }: {
  items: ShoppingItem[]
  mealCount: number
  weekNumber: number
  dateRange: string
}) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Boodschappenlijst</h2>
              <p className="text-base text-gray-500 mt-1">
                Week {weekNumber} • {dateRange} • {mealCount} maaltijden
              </p>
            </div>
            {items.length > 0 && (
              <span className="px-4 py-2 bg-blue-100 text-blue-800 text-base font-bold rounded-full">
                {items.length} items
              </span>
            )}
          </div>
        </div>
        
        <div className="p-6">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-xl font-semibold text-gray-900">Geen boodschappen nodig</p>
              <p className="text-gray-500 text-base mt-2">Plan eerst maaltijden in de weekplanner</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.keys(CATEGORY_CONFIG).map(category => {
                const categoryItems = items.filter(item => item.category === category)
                if (categoryItems.length === 0) return null
                
                const config = CATEGORY_CONFIG[category]
                
                return (
                  <div key={category}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`px-4 py-2 rounded-xl font-bold text-sm ${config.color} ${config.text}`}>
                        {config.label}
                      </span>
                      <span className="text-base text-gray-400 font-medium">({categoryItems.length})</span>
                    </div>
                    <div className="space-y-3">
                      {categoryItems.map((item, idx) => (
                        <label 
                          key={idx}
                          className="flex items-center gap-4 p-5 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer transition-all"
                        >
                          <input 
                            type="checkbox" 
                            className="w-6 h-6 rounded-lg border-2 border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 shrink-0"
                          />
                          <span className="flex-1 font-semibold text-gray-800 text-lg">{item.name}</span>
                          <span className="text-base font-bold text-gray-600 bg-gray-100 px-4 py-2 rounded-lg tabular-nums shrink-0">
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
  )
}

function RecipeModal({ recipes, selectedDay, selectedMeal, onClose, onSelect }: {
  recipes: Recipe[]
  selectedDay: string
  selectedMeal: string
  onClose: () => void
  onSelect: (recipeId: string) => void
}) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="px-8 py-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Kies een recept</h2>
            <p className="text-base text-gray-500 mt-1">{selectedDay} • {selectedMeal}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-3">
          {recipes.map(recipe => (
            <button
              key={recipe.id}
              onClick={() => onSelect(recipe.id)}
              className="w-full text-left p-5 rounded-2xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-lg text-gray-900 group-hover:text-blue-700 transition-colors">
                    {recipe.name}
                  </p>
                  <p className="text-base text-gray-500 mt-1 capitalize">{recipe.category}</p>
                </div>
                <span className="text-base font-bold text-gray-500 bg-gray-100 px-4 py-2 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                  {recipe.prep_time_minutes} min
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Utilities

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
