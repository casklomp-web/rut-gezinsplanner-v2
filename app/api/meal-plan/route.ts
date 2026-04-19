/**
 * Meal Plan API Routes
 * POST /api/meal-plan - Create or update meal plan
 * DELETE /api/meal-plan - Delete meal plan
 */

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { generateWeek } from '@/lib/logic/weekGenerator';
import { Week, Day } from '@/lib/types';

// POST /api/meal-plan - Create or update
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { weekData, action = 'create' } = body;
    
    // Get user's household
    const { data: profile } = await supabase
      .from('profiles')
      .select('household_id')
      .eq('id', session.user.id)
      .single();
    
    if (!profile?.household_id) {
      return NextResponse.json({ error: 'No household found' }, { status: 400 });
    }
    
    if (action === 'generate') {
      // Generate new week from logic
      const { data: prefs } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      
      const mockUser = {
        id: session.user.id,
        name: session.user.user_metadata?.name || 'User',
        role: 'primary' as const,
        goals: {
          weightCurrent: prefs?.weight_current || undefined,
          weightGoal: prefs?.weight_goal || undefined,
          calorieTarget: prefs?.calorie_target || undefined,
          proteinTarget: prefs?.protein_target || 120,
          trainingDaysPerWeek: prefs?.training_days_per_week || 2,
          stepsTarget: prefs?.steps_target || 7000
        },
        preferences: {
          dietary: prefs?.dietary || [],
          dislikes: prefs?.dislikes || [],
          allergies: prefs?.allergies || [],
          maxPrepTime: {
            breakfast: prefs?.max_prep_time_breakfast || 5,
            lunch: prefs?.max_prep_time_lunch || 10,
            dinner: prefs?.max_prep_time_dinner || 15
          },
          budgetLevel: prefs?.budget_level || 'moderate'
        },
        schedule: {
          trainingDays: prefs?.training_days || [],
          workBusyDays: prefs?.work_busy_days || []
        },
        notifications: {
          pushEnabled: prefs?.push_enabled || false,
          telegramEnabled: prefs?.telegram_enabled || false,
          reminders: {
            breakfast: { enabled: prefs?.reminder_breakfast_enabled || true, time: prefs?.reminder_breakfast_time || '07:30' },
            lunch: { enabled: prefs?.reminder_lunch_enabled || true, time: prefs?.reminder_lunch_time || '12:00' },
            dinnerPrep: { enabled: prefs?.reminder_dinner_enabled || true, time: prefs?.reminder_dinner_time || '17:00' },
            training: { enabled: prefs?.reminder_training_enabled || false, time: prefs?.reminder_training_time || '18:00' },
            medication: { enabled: prefs?.reminder_medication_enabled || true, time: prefs?.reminder_medication_time || '08:00' }
          }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const generatedWeek = generateWeek(new Date(), mockUser);
      
      // Save to database
      const { data: weekRecord, error: weekError } = await supabase
        .from('weeks')
        .upsert({
          week_number: generatedWeek.weekNumber,
          year: generatedWeek.year,
          start_date: generatedWeek.startDate,
          end_date: generatedWeek.endDate,
          household_id: profile.household_id,
          created_by: session.user.id,
          is_generated: true,
          meals_planned: generatedWeek.stats.mealsPlanned,
          training_days: generatedWeek.stats.trainingDays,
          estimated_cost: generatedWeek.stats.estimatedCost,
          prep_moments: generatedWeek.stats.prepMoments
        }, {
          onConflict: 'household_id,week_number,year'
        })
        .select()
        .single();
      
      if (weekError) throw weekError;
      
      // Save days
      for (const day of generatedWeek.days) {
        const { data: dayRecord } = await supabase
          .from('days')
          .upsert({
            week_id: weekRecord.id,
            date: day.date,
            day_of_week: day.dayOfWeek,
            training_scheduled: day.training?.scheduled || false,
            training_time: day.training?.time,
            training_description: day.training?.description,
            is_training_day: day.isTrainingDay,
            is_meal_prep_day: day.isMealPrepDay,
            is_leftover_day: day.isLeftoverDay
          }, {
            onConflict: 'week_id,date'
          })
          .select()
          .single();
        
        // Save meals for this day
        const mealsToSave = [
          { type: 'breakfast', meal: day.meals.breakfast },
          { type: 'lunch', meal: day.meals.lunch },
          { type: 'dinner', meal: day.meals.dinner }
        ];
        
        for (const { type, meal } of mealsToSave) {
          await supabase
            .from('day_meals')
            .upsert({
              day_id: dayRecord.id,
              meal_type: type as 'breakfast' | 'lunch' | 'dinner',
              meal_name: meal.mealName,
              variant: meal.variant,
              portions: meal.portions,
              is_leftover: meal.isLeftover,
              from_prep_day: meal.fromPrepDay,
              is_modified: meal.isModified
            }, {
              onConflict: 'day_id,meal_type'
            });
        }
      }
      
      return NextResponse.json({ success: true, week: generatedWeek });
    }
    
    // Update existing week
    if (action === 'update' && weekData) {
      const { data: weekRecord } = await supabase
        .from('weeks')
        .update({
          is_locked: weekData.isLocked,
          updated_at: new Date().toISOString()
        })
        .eq('id', weekData.id)
        .select()
        .single();
      
      return NextResponse.json({ success: true, week: weekRecord });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Meal plan API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/meal-plan - Delete meal plan
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const weekId = searchParams.get('weekId');
    
    if (!weekId) {
      return NextResponse.json({ error: 'Week ID required' }, { status: 400 });
    }
    
    // Verify ownership through household
    const { data: week } = await supabase
      .from('weeks')
      .select('household_id')
      .eq('id', weekId)
      .single();
    
    if (!week) {
      return NextResponse.json({ error: 'Week not found' }, { status: 404 });
    }
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('household_id')
      .eq('id', session.user.id)
      .single();
    
    if (profile?.household_id !== week.household_id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Delete week (cascades to days and day_meals)
    const { error } = await supabase
      .from('weeks')
      .delete()
      .eq('id', weekId);
    
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete meal plan error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
