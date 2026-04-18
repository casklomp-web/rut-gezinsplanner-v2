import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const weekStart = searchParams.get('week_start')

  if (!weekStart) {
    return NextResponse.json({ error: 'week_start required' }, { status: 400 })
  }

  // Get meal plans for the week
  const { data: mealPlans, error: mealError } = await supabase
    .from('meal_plan_items')
    .select('recipe_id')
    .gte('date', weekStart)
    .lte('date', getWeekEnd(weekStart))

  if (mealError) {
    return NextResponse.json({ error: mealError.message }, { status: 500 })
  }

  if (!mealPlans || mealPlans.length === 0) {
    return NextResponse.json({ items: [] })
  }

  // Get ingredients for all recipes in the meal plans
  const recipeIds = mealPlans.map(mp => mp.recipe_id)
  
  const { data: ingredients, error: ingError } = await supabase
    .from('recipe_ingredients')
    .select('*')
    .in('recipe_id', recipeIds)

  if (ingError) {
    return NextResponse.json({ error: ingError.message }, { status: 500 })
  }

  // Group and aggregate ingredients
  const grouped = ingredients?.reduce((acc: any, ing: any) => {
    const key = `${ing.name}-${ing.unit}`
    if (!acc[key]) {
      acc[key] = {
        name: ing.name,
        amount: 0,
        unit: ing.unit,
        category: ing.category || 'overig'
      }
    }
    acc[key].amount += ing.amount || 0
    return acc
  }, {})

  const items = Object.values(grouped || {})

  return NextResponse.json({ items })
}

function getWeekEnd(weekStart: string): string {
  const date = new Date(weekStart)
  date.setDate(date.getDate() + 6)
  return date.toISOString().split('T')[0]
}
