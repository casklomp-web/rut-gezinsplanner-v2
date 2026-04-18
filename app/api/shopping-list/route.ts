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

  // Group and aggregate ingredients by name (case insensitive)
  const grouped = ingredients?.reduce((acc: any, ing: any) => {
    const normalizedName = ing.name.toLowerCase().trim()
    if (!acc[normalizedName]) {
      acc[normalizedName] = {
        name: ing.name,
        amount: 0,
        unit: ing.unit,
        category: ing.category || 'overig'
      }
    }
    // Only aggregate if same unit, otherwise keep separate
    if (acc[normalizedName].unit === ing.unit) {
      acc[normalizedName].amount += ing.amount || 0
    }
    return acc
  }, {})

  // Normalize units (singular form)
  const unitMapping: Record<string, string> = {
    'theelepels': 'theelepel',
    'eetlepels': 'eetlepel',
    'stuks': 'stuk',
    'sneetjes': 'sneetje'
  }

  // Convert to array, round amounts, normalize units
  const items = Object.values(grouped || {}).map((item: any) => ({
    ...item,
    amount: Math.round(item.amount * 10) / 10, // Round to 1 decimal
    unit: unitMapping[item.unit] || item.unit // Normalize to singular
  }))

  return NextResponse.json({ items })
}

function getWeekEnd(weekStart: string): string {
  const date = new Date(weekStart)
  date.setDate(date.getDate() + 6)
  return date.toISOString().split('T')[0]
}
