/**
 * Shopping List Toggle API
 * POST /api/shopping-list/toggle - Toggle item checked status
 */

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { itemId, checked } = body;
    
    if (!itemId) {
      return NextResponse.json({ error: 'Item ID required' }, { status: 400 });
    }
    
    const { data: item, error: fetchError } = await supabase
      .from('shopping_list_items')
      .select('checked')
      .eq('id', itemId)
      .single();
    
    if (fetchError) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    
    const newChecked = checked !== undefined ? checked : !item.checked;
    
    const { error: updateError } = await supabase
      .from('shopping_list_items')
      .update({
        checked: newChecked,
        checked_at: newChecked ? new Date().toISOString() : null
      })
      .eq('id', itemId);
    
    if (updateError) throw updateError;
    
    return NextResponse.json({ success: true, checked: newChecked });
  } catch (error) {
    console.error('Toggle shopping item error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
