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

  // Get any household (for now)
  const { data: households, error: hhError } = await supabase
    .from('households')
    .select('id')
    .limit(1)

  if (hhError || !households || households.length === 0) {
    return NextResponse.json({ error: 'No household found' }, { status: 404 })
  }

  const householdId = households[0].id

  const { data: mealPlans, error } = await supabase
    .from('meal_plan_items')
    .select(`*, recipe:recipes(*)`)
    .eq('household_id', householdId)
    .gte('date', weekStart)
    .lte('date', getWeekEnd(weekStart))
    .order('date')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ mealPlans: mealPlans || [] })
}

export async function POST(request: Request) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { date, meal_type, recipe_id, servings_planned, notes } = body

  // Get any household (for now)
  const { data: households, error: hhError } = await supabase
    .from('households')
    .select('id')
    .limit(1)

  if (hhError || !households || households.length === 0) {
    return NextResponse.json({ error: 'No household found' }, { status: 404 })
  }

  const householdId = households[0].id

  const { data, error } = await supabase
    .from('meal_plan_items')
    .upsert({
      household_id: householdId,
      date,
      meal_type,
      recipe_id,
      servings_planned: servings_planned || 4,
      notes,
      created_by: user.id
    }, {
      onConflict: 'household_id,date,meal_type'
    })
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

export async function DELETE(request: Request) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'id required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('meal_plan_items')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

function getWeekEnd(weekStart: string): string {
  const date = new Date(weekStart)
  date.setDate(date.getDate() + 6)
  return date.toISOString().split('T')[0]
}
