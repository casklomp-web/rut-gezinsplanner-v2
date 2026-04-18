'use client'

import { useState, useEffect } from 'react'

export default function WeekPlanner() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/recipes')
      .then(r => r.json())
      .then(data => {
        setRecipes(data.recipes || [])
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="p-8">Laden...</div>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Weekplanner</h1>
      <p className="mb-4">Je hebt {recipes.length} recepten beschikbaar.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recipes.map((recipe: any) => (
          <div key={recipe.id} className="border p-4 rounded">
            <h3 className="font-semibold">{recipe.name}</h3>
            <p className="text-sm text-gray-600">{recipe.prep_time_minutes} min</p>
          </div>
        ))}
      </div>
    </div>
  )
}
