/**
 * Shopping List API Routes
 * GET /api/shopping-list - Get shopping list for current week
 * POST /api/shopping-list/toggle - Toggle item checked status
 */

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/shopping-list - Get shopping list
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const weekId = searchParams.get('weekId');
    
    // Get user's household
    const { data: profile } = await supabase
      .from('profiles')
      .select('household_id')
      .eq('id', session.user.id)
      .single();
    
    if (!profile?.household_id) {
      return NextResponse.json({ error: 'No household found' }, { status: 400 });
    }
    
    let query = supabase
      .from('shopping_lists')
      .select(`
        *,
        shopping_list_items(*)
      `)
      .eq('household_id', profile.household_id);
    
    if (weekId) {
      query = query.eq('week_id', weekId);
    } else {
      // Get current week
      const today = new Date().toISOString().split('T')[0];
      const { data: currentWeek } = await supabase
        .from('weeks')
        .select('id')
        .eq('household_id', profile.household_id)
        .lte('start_date', today)
        .gte('end_date', today)
        .single();
      
      if (currentWeek) {
        query = query.eq('week_id', currentWeek.id);
      }
    }
    
    const { data: shoppingList, error } = await query.single();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    return NextResponse.json({ shoppingList });
  } catch (error) {
    console.error('Shopping list API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/shopping-list - Generate shopping list
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { weekId, items } = body;
    
    // Get user's household
    const { data: profile } = await supabase
      .from('profiles')
      .select('household_id')
      .eq('id', session.user.id)
      .single();
    
    if (!profile?.household_id) {
      return NextResponse.json({ error: 'No household found' }, { status: 400 });
    }
    
    // Create or update shopping list
    const { data: shoppingList, error: listError } = await supabase
      .from('shopping_lists')
      .upsert({
        week_id: weekId,
        household_id: profile.household_id,
        status: 'generated'
      }, {
        onConflict: 'week_id'
      })
      .select()
      .single();
    
    if (listError) throw listError;
    
    // Insert items
    if (items && items.length > 0) {
      const itemsWithListId = items.map((item: any) => ({
        ...item,
        shopping_list_id: shoppingList.id
      }));
      
      await supabase
        .from('shopping_list_items')
        .upsert(itemsWithListId, {
          onConflict: 'shopping_list_id,ingredient_id'
        });
    }
    
    return NextResponse.json({ success: true, shoppingList });
  } catch (error) {
    console.error('Create shopping list error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
