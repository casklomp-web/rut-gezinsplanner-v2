import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Simpler query: get all system recipes (household_id is null)
    const { data: recipes, error } = await supabase
      .from('recipes')
      .select('*')
      .is('household_id', null)
      .order('name')

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: error.message, recipes: [] }, { status: 500 })
    }

    return NextResponse.json({ recipes: recipes || [] })
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json({ error: 'Internal error', recipes: [] }, { status: 500 })
  }
}
