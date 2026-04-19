/**
 * Supabase Database Types
 * Generated types for Rut App
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          role: 'primary' | 'secondary';
          avatar_url: string | null;
          household_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          role?: 'primary' | 'secondary';
          avatar_url?: string | null;
          household_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role?: 'primary' | 'secondary';
          avatar_url?: string | null;
          household_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          dietary: string[];
          dislikes: string[];
          allergies: string[];
          max_prep_time_breakfast: number;
          max_prep_time_lunch: number;
          max_prep_time_dinner: number;
          budget_level: 'tight' | 'moderate' | 'flexible';
          training_days: string[];
          work_busy_days: string[];
          push_enabled: boolean;
          telegram_enabled: boolean;
          telegram_chat_id: string | null;
          reminder_breakfast_time: string;
          reminder_breakfast_enabled: boolean;
          reminder_lunch_time: string;
          reminder_lunch_enabled: boolean;
          reminder_dinner_time: string;
          reminder_dinner_enabled: boolean;
          reminder_training_time: string;
          reminder_training_enabled: boolean;
          reminder_medication_time: string;
          reminder_medication_enabled: boolean;
          weight_current: number | null;
          weight_goal: number | null;
          calorie_target: number | null;
          protein_target: number;
          training_days_per_week: number;
          steps_target: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          dietary?: string[];
          dislikes?: string[];
          allergies?: string[];
          max_prep_time_breakfast?: number;
          max_prep_time_lunch?: number;
          max_prep_time_dinner?: number;
          budget_level?: 'tight' | 'moderate' | 'flexible';
          training_days?: string[];
          work_busy_days?: string[];
          push_enabled?: boolean;
          telegram_enabled?: boolean;
          telegram_chat_id?: string | null;
          reminder_breakfast_time?: string;
          reminder_breakfast_enabled?: boolean;
          reminder_lunch_time?: string;
          reminder_lunch_enabled?: boolean;
          reminder_dinner_time?: string;
          reminder_dinner_enabled?: boolean;
          reminder_training_time?: string;
          reminder_training_enabled?: boolean;
          reminder_medication_time?: string;
          reminder_medication_enabled?: boolean;
          weight_current?: number | null;
          weight_goal?: number | null;
          calorie_target?: number | null;
          protein_target?: number;
          training_days_per_week?: number;
          steps_target?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          dietary?: string[];
          dislikes?: string[];
          allergies?: string[];
          max_prep_time_breakfast?: number;
          max_prep_time_lunch?: number;
          max_prep_time_dinner?: number;
          budget_level?: 'tight' | 'moderate' | 'flexible';
          training_days?: string[];
          work_busy_days?: string[];
          push_enabled?: boolean;
          telegram_enabled?: boolean;
          telegram_chat_id?: string | null;
          reminder_breakfast_time?: string;
          reminder_breakfast_enabled?: boolean;
          reminder_lunch_time?: string;
          reminder_lunch_enabled?: boolean;
          reminder_dinner_time?: string;
          reminder_dinner_enabled?: boolean;
          reminder_training_time?: string;
          reminder_training_enabled?: boolean;
          reminder_medication_time?: string;
          reminder_medication_enabled?: boolean;
          weight_current?: number | null;
          weight_goal?: number | null;
          calorie_target?: number | null;
          protein_target?: number;
          training_days_per_week?: number;
          steps_target?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      households: {
        Row: {
          id: string;
          name: string;
          created_by: string | null;
          invite_code: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_by?: string | null;
          invite_code?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_by?: string | null;
          invite_code?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      meals: {
        Row: {
          id: string;
          name: string;
          category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
          tags: string[];
          prep_time: number;
          cook_time: number;
          instructions: string[];
          calories: number | null;
          protein: number | null;
          carbs: number | null;
          fat: number | null;
          is_favorite: boolean;
          frequency: 'weekly' | 'biweekly' | 'monthly' | 'occasional';
          season: string[];
          is_prep_friendly: boolean;
          keeps_for_days: number;
          shopping_category: string;
          estimated_cost: number | null;
          created_by: string | null;
          household_id: string | null;
          is_custom: boolean;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
          tags?: string[];
          prep_time: number;
          cook_time: number;
          instructions?: string[];
          calories?: number | null;
          protein?: number | null;
          carbs?: number | null;
          fat?: number | null;
          is_favorite?: boolean;
          frequency?: 'weekly' | 'biweekly' | 'monthly' | 'occasional';
          season?: string[];
          is_prep_friendly?: boolean;
          keeps_for_days?: number;
          shopping_category?: string;
          estimated_cost?: number | null;
          created_by?: string | null;
          household_id?: string | null;
          is_custom?: boolean;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
          tags?: string[];
          prep_time?: number;
          cook_time?: number;
          instructions?: string[];
          calories?: number | null;
          protein?: number | null;
          carbs?: number | null;
          fat?: number | null;
          is_favorite?: boolean;
          frequency?: 'weekly' | 'biweekly' | 'monthly' | 'occasional';
          season?: string[];
          is_prep_friendly?: boolean;
          keeps_for_days?: number;
          shopping_category?: string;
          estimated_cost?: number | null;
          created_by?: string | null;
          household_id?: string | null;
          is_custom?: boolean;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      weeks: {
        Row: {
          id: string;
          week_number: number;
          year: number;
          start_date: string;
          end_date: string;
          household_id: string | null;
          created_by: string | null;
          is_generated: boolean;
          is_locked: boolean;
          meals_planned: number;
          training_days: number;
          estimated_cost: number;
          prep_moments: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          week_number: number;
          year: number;
          start_date: string;
          end_date: string;
          household_id?: string | null;
          created_by?: string | null;
          is_generated?: boolean;
          is_locked?: boolean;
          meals_planned?: number;
          training_days?: number;
          estimated_cost?: number;
          prep_moments?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          week_number?: number;
          year?: number;
          start_date?: string;
          end_date?: string;
          household_id?: string | null;
          created_by?: string | null;
          is_generated?: boolean;
          is_locked?: boolean;
          meals_planned?: number;
          training_days?: number;
          estimated_cost?: number;
          prep_moments?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      days: {
        Row: {
          id: string;
          week_id: string;
          date: string;
          day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
          training_scheduled: boolean;
          training_time: string | null;
          training_description: string | null;
          training_completed: boolean;
          is_training_day: boolean;
          is_meal_prep_day: boolean;
          is_leftover_day: boolean;
          checkin_breakfast: boolean;
          checkin_lunch: boolean;
          checkin_dinner: boolean;
          checkin_training: boolean;
          checkin_walking: boolean;
          checkin_medication: boolean;
          checkin_sleep_routine: boolean;
          steps_actual: number | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          week_id: string;
          date: string;
          day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
          training_scheduled?: boolean;
          training_time?: string | null;
          training_description?: string | null;
          training_completed?: boolean;
          is_training_day?: boolean;
          is_meal_prep_day?: boolean;
          is_leftover_day?: boolean;
          checkin_breakfast?: boolean;
          checkin_lunch?: boolean;
          checkin_dinner?: boolean;
          checkin_training?: boolean;
          checkin_walking?: boolean;
          checkin_medication?: boolean;
          checkin_sleep_routine?: boolean;
          steps_actual?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          week_id?: string;
          date?: string;
          day_of_week?: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
          training_scheduled?: boolean;
          training_time?: string | null;
          training_description?: string | null;
          training_completed?: boolean;
          is_training_day?: boolean;
          is_meal_prep_day?: boolean;
          is_leftover_day?: boolean;
          checkin_breakfast?: boolean;
          checkin_lunch?: boolean;
          checkin_dinner?: boolean;
          checkin_training?: boolean;
          checkin_walking?: boolean;
          checkin_medication?: boolean;
          checkin_sleep_routine?: boolean;
          steps_actual?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      day_meals: {
        Row: {
          id: string;
          day_id: string;
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
          meal_id: string | null;
          meal_name: string;
          variant: 'family' | 'primary' | 'child';
          portions: number;
          completed: boolean;
          completed_at: string | null;
          is_leftover: boolean;
          from_prep_day: string | null;
          is_modified: boolean;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          day_id: string;
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
          meal_id?: string | null;
          meal_name: string;
          variant?: 'family' | 'primary' | 'child';
          portions?: number;
          completed?: boolean;
          completed_at?: string | null;
          is_leftover?: boolean;
          from_prep_day?: string | null;
          is_modified?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          day_id?: string;
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
          meal_id?: string | null;
          meal_name?: string;
          variant?: 'family' | 'primary' | 'child';
          portions?: number;
          completed?: boolean;
          completed_at?: string | null;
          is_leftover?: boolean;
          from_prep_day?: string | null;
          is_modified?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      shopping_lists: {
        Row: {
          id: string;
          week_id: string;
          household_id: string | null;
          generated_at: string;
          estimated_total: number;
          actual_total: number | null;
          status: 'generated' | 'in_progress' | 'completed';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          week_id: string;
          household_id?: string | null;
          generated_at?: string;
          estimated_total?: number;
          actual_total?: number | null;
          status?: 'generated' | 'in_progress' | 'completed';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          week_id?: string;
          household_id?: string | null;
          generated_at?: string;
          estimated_total?: number;
          actual_total?: number | null;
          status?: 'generated' | 'in_progress' | 'completed';
          created_at?: string;
          updated_at?: string;
        };
      };
      shopping_list_items: {
        Row: {
          id: string;
          shopping_list_id: string;
          ingredient_id: string;
          name: string;
          amount: number;
          unit: string;
          display_text: string;
          checked: boolean;
          checked_at: string | null;
          is_fresh: boolean;
          buy_this_week: boolean;
          estimated_price: number;
          store: string;
          category: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          shopping_list_id: string;
          ingredient_id: string;
          name: string;
          amount: number;
          unit: string;
          display_text: string;
          checked?: boolean;
          checked_at?: string | null;
          is_fresh?: boolean;
          buy_this_week?: boolean;
          estimated_price?: number;
          store?: string;
          category?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          shopping_list_id?: string;
          ingredient_id?: string;
          name?: string;
          amount?: number;
          unit?: string;
          display_text?: string;
          checked?: boolean;
          checked_at?: string | null;
          is_fresh?: boolean;
          buy_this_week?: boolean;
          estimated_price?: number;
          store?: string;
          category?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      search_history: {
        Row: {
          id: string;
          user_id: string;
          query: string;
          filters: Json;
          results_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          query: string;
          filters?: Json;
          results_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          query?: string;
          filters?: Json;
          results_count?: number;
          created_at?: string;
        };
      };
      onboarding_progress: {
        Row: {
          id: string;
          user_id: string;
          step_completed: number;
          total_steps: number;
          welcome_shown: boolean;
          tutorial_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          step_completed?: number;
          total_steps?: number;
          welcome_shown?: boolean;
          tutorial_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          step_completed?: number;
          total_steps?: number;
          welcome_shown?: boolean;
          tutorial_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
