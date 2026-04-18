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
  { key: 'breakfast', label: 'Ontbijt', icon: '🌅' },
  { key: 'lunch', label: 'Lunch', icon: '🌞' },
  { key: 'dinner', label: 'Diner', icon: '🌙' }
] as const

const CATEGORY_CONFIG: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  'groente': { label: 'Groente', icon: '🥬', color: 'text-green-700', bg: 'bg-green-50' },
  'fruit': { label: 'Fruit', icon: '🍎', color: 'text-red-700', bg: 'bg-red-50' },
  'vlees': { label: 'Vlees', icon: '🥩', color: 'text-rose-700', bg: 'bg-rose-50' },
  'vis': { label: 'Vis', icon: '🐟', color: 'text-blue-700', bg: 'bg-blue-50' },
  'zuivel': { label: 'Zuivel', icon: '🥛', color: 'text-yellow-700', bg: 'bg-yellow-50' },
  'granen': { label: 'Granen', icon: '🌾', color: 'text-amber-700', bg: 'bg-amber-50' },
  'overig': { label: 'Overig', icon: '📦', color: 'text-slate-700', bg: 'bg-slate-50' }
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500">Laden...</div>
      </div>
    )
  }

  const weekNumber = getWeekNumber(new Date(weekStart))
  const dateRange = formatDateRange(weekStart)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">R</span>
              </div>
              <span className="font-semibold text-slate-900">Rut</span>
            </div>
            <form action="/auth/signout" method="post">
              <button className="text-sm text-slate-600 hover:text-slate-900">
                Uitloggen
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('planner')}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'planner' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Weekplanner
          </button>
          <button
            onClick={() => setActiveTab('shopping')}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'shopping' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Boodschappen
            {mealPlans.length > 0 && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">
                {mealPlans.length}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'planner' ? (
          <div className="space-y-6">
            {/* Week Navigation */}
            <div className="flex items-center justify-between">
              <button 
                onClick={prevWeek}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="text-center">
                <p className="text-lg font-semibold text-slate-900">Week {weekNumber}</p>
                <p className="text-sm text-slate-500">{dateRange}</p>
              </div>
              
              <button 
                onClick={nextWeek}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Mobile View */}
            <div className="lg:hidden space-y-4">
              {DAYS_FULL.map((day, dayIndex) => (
                <DayCard
                  key={day}
                  day={day}
                  dayShort={DAYS_SHORT[dayIndex]}
                  date={formatDate(getDate(dayIndex))}
                  meals={MEALS}
                  getMeal={(mealType) => getMeal(dayIndex, mealType)}
                  onAddMeal={(mealKey) => {
                    setSelectedSlot({ day: dayIndex, meal: mealKey })
                    setShowModal(true)
                  }}
                  onRemoveMeal={removeMeal}
                />
              ))}
            </div>

            {/* Desktop View */}
            <div className="hidden lg:grid lg:grid-cols-7 gap-3">
              {DAYS_SHORT.map((dayShort, dayIndex) => (
                <div key={dayShort} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 px-3 py-3 border-b border-slate-200 text-center">
                    <p className="font-semibold text-slate-900 text-sm">{dayShort}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{formatDate(getDate(dayIndex))}</p>
                  </div>
                  <div className="p-2 space-y-2">
                    {MEALS.map(meal => {
                      const planned = getMeal(dayIndex, meal.key)
                      return (
                        <div key={meal.key}>
                          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                            {meal.label}
                          </p>
                          {planned ? (
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 group">
                              <p className="font-medium text-slate-900 text-xs leading-snug line-clamp-2">
                                {planned.recipe.name}
                              </p>
                              <p className="text-xs text-slate-500 mt-1">
                                {planned.recipe.prep_time_minutes} min
                              </p>
                              <button 
                                onClick={() => removeMeal(planned.id)}
                                className="text-xs text-red-600 hover:text-red-700 mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
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
                              className="w-full h-10 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all text-lg font-light"
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

// Sub-components for better organization

function DayCard({ day, dayShort, date, meals, getMeal, onAddMeal, onRemoveMeal }: {
  day: string
  dayShort: string
  date: string
  meals: typeof MEALS
  getMeal: (mealType: string) => MealPlan | undefined
  onAddMeal: (mealKey: string) => void
  onRemoveMeal: (id: string) => void
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-slate-900">{dayShort}</span>
          <span className="text-sm text-slate-500">{date}</span>
        </div>
      </div>
      <div className="p-4 space-y-4">
        {meals.map(meal => {
          const planned = getMeal(meal.key)
          return (
            <div key={meal.key}>
              <div className="flex items-center gap-2 mb-2">
                <span>{meal.icon}</span>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {meal.label}
                </span>
              </div>
              {planned ? (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <p className="font-medium text-slate-900 text-sm">{planned.recipe.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{planned.recipe.prep_time_minutes} min</p>
                  <button 
                    onClick={() => onRemoveMeal(planned.id)}
                    className="text-xs text-red-600 hover:text-red-700 mt-2 font-medium"
                  >
                    Verwijderen
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onAddMeal(meal.key)}
                  className="w-full py-3 px-4 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all text-sm font-medium"
                >
                  + Maaltijd toevoegen
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ShoppingList({ items, mealCount, weekNumber, dateRange }: {
  items: ShoppingItem[]
  mealCount: number
  weekNumber: number
  dateRange: string
}) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Boodschappenlijst</h2>
              <p className="text-sm text-slate-500 mt-1">
                Week {weekNumber} • {dateRange} • {mealCount} maaltijden
              </p>
            </div>
            {items.length > 0 && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                {items.length} items
              </span>
            )}
          </div>
        </div>
        
        <div className="p-6">
          {items.length === 0 ? (
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
              {Object.keys(CATEGORY_CONFIG).map(category => {
                const categoryItems = items.filter(item => item.category === category)
                if (categoryItems.length === 0) return null
                
                const config = CATEGORY_CONFIG[category]
                
                return (
                  <div key={category}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.bg}`}>
                        {config.icon}
                      </span>
                      <h3 className={`font-semibold ${config.color}`}>{config.label}</h3>
                      <span className="text-sm text-slate-400">({categoryItems.length})</span>
                    </div>
                    <div className="space-y-2">
                      {categoryItems.map((item, idx) => (
                        <label 
                          key={idx}
                          className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
                        >
                          <input 
                            type="checkbox" 
                            className="w-5 h-5 rounded border-slate-300 text-blue-600 shrink-0"
                          />
                          <span className="flex-1 font-medium text-slate-700">{item.name}</span>
                          <span className="text-sm text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md font-medium tabular-nums shrink-0">
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Kies een recept</h2>
            <p className="text-sm text-slate-500">{selectedDay} • {selectedMeal}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
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
              onClick={() => onSelect(recipe.id)}
              className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {recipe.name}
                  </p>
                  <p className="text-sm text-slate-500 mt-1 capitalize">{recipe.category}</p>
                </div>
                <span className="text-sm text-slate-400 bg-slate-100 px-2 py-1 rounded font-medium">
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
