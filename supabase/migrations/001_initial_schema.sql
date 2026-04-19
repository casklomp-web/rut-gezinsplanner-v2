-- Rut App Database Schema
-- Supabase PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS & AUTH (extends Supabase auth.users)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'secondary' CHECK (role IN ('primary', 'secondary')),
  avatar_url TEXT,
  household_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- USER PREFERENCES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Dietary preferences
  dietary TEXT[] DEFAULT '{}',
  dislikes TEXT[] DEFAULT '{}',
  allergies TEXT[] DEFAULT '{}',
  
  -- Time preferences
  max_prep_time_breakfast INTEGER DEFAULT 5,
  max_prep_time_lunch INTEGER DEFAULT 10,
  max_prep_time_dinner INTEGER DEFAULT 15,
  
  -- Budget
  budget_level TEXT DEFAULT 'moderate' CHECK (budget_level IN ('tight', 'moderate', 'flexible')),
  
  -- Schedule
  training_days TEXT[] DEFAULT '{}',
  work_busy_days TEXT[] DEFAULT '{}',
  
  -- Notification preferences
  push_enabled BOOLEAN DEFAULT true,
  telegram_enabled BOOLEAN DEFAULT false,
  telegram_chat_id TEXT,
  
  -- Reminder times
  reminder_breakfast_time TEXT DEFAULT '07:30',
  reminder_breakfast_enabled BOOLEAN DEFAULT true,
  reminder_lunch_time TEXT DEFAULT '12:00',
  reminder_lunch_enabled BOOLEAN DEFAULT true,
  reminder_dinner_time TEXT DEFAULT '17:00',
  reminder_dinner_enabled BOOLEAN DEFAULT true,
  reminder_training_time TEXT DEFAULT '18:00',
  reminder_training_enabled BOOLEAN DEFAULT false,
  reminder_medication_time TEXT DEFAULT '08:00',
  reminder_medication_enabled BOOLEAN DEFAULT true,
  
  -- Goals
  weight_current NUMERIC(5,1),
  weight_goal NUMERIC(5,1),
  calorie_target INTEGER,
  protein_target INTEGER DEFAULT 120,
  training_days_per_week INTEGER DEFAULT 2,
  steps_target INTEGER DEFAULT 7000,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- ============================================================================
-- HOUSEHOLDS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.households (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  created_by UUID REFERENCES public.profiles(id),
  invite_code TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key to profiles
ALTER TABLE public.profiles 
  ADD CONSTRAINT fk_household 
  FOREIGN KEY (household_id) 
  REFERENCES public.households(id) 
  ON DELETE SET NULL;

-- ============================================================================
-- MEALS (recipes)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.meals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- Basic info
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('breakfast', 'lunch', 'dinner', 'snack')),
  tags TEXT[] DEFAULT '{}',
  
  -- Timing
  prep_time INTEGER NOT NULL,
  cook_time INTEGER NOT NULL,
  
  -- Instructions
  instructions TEXT[] DEFAULT '{}',
  
  -- Nutrition
  calories INTEGER,
  protein NUMERIC(5,1),
  carbs NUMERIC(5,1),
  fat NUMERIC(5,1),
  
  -- Properties
  is_favorite BOOLEAN DEFAULT false,
  frequency TEXT DEFAULT 'weekly' CHECK (frequency IN ('weekly', 'biweekly', 'monthly', 'occasional')),
  season TEXT[] DEFAULT '{}',
  is_prep_friendly BOOLEAN DEFAULT false,
  keeps_for_days INTEGER DEFAULT 0,
  shopping_category TEXT DEFAULT 'pantry',
  estimated_cost NUMERIC(5,2),
  
  -- Ownership
  created_by UUID REFERENCES public.profiles(id),
  household_id UUID REFERENCES public.households(id),
  is_custom BOOLEAN DEFAULT false,
  
  -- Media
  image_url TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- MEAL INGREDIENTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.meal_ingredients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  meal_id UUID REFERENCES public.meals(id) ON DELETE CASCADE NOT NULL,
  
  ingredient_id TEXT NOT NULL,
  name TEXT NOT NULL,
  amount NUMERIC(8,2) NOT NULL,
  unit TEXT NOT NULL,
  scalable BOOLEAN DEFAULT true,
  is_optional BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- MEAL VARIANTS (family, primary, child)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.meal_variants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  meal_id UUID REFERENCES public.meals(id) ON DELETE CASCADE NOT NULL,
  
  variant_type TEXT NOT NULL CHECK (variant_type IN ('family', 'primary', 'child')),
  portions INTEGER NOT NULL,
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(meal_id, variant_type)
);

-- ============================================================================
-- WEEKS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.weeks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  week_number INTEGER NOT NULL,
  year INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  
  household_id UUID REFERENCES public.households(id) ON DELETE CASCADE,
  created_by UUID REFERENCES public.profiles(id),
  
  is_generated BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  
  -- Stats
  meals_planned INTEGER DEFAULT 0,
  training_days INTEGER DEFAULT 0,
  estimated_cost NUMERIC(6,2) DEFAULT 0,
  prep_moments INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(household_id, week_number, year)
);

-- ============================================================================
-- DAYS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.days (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  week_id UUID REFERENCES public.weeks(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  day_of_week TEXT NOT NULL CHECK (day_of_week IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
  
  -- Training
  training_scheduled BOOLEAN DEFAULT false,
  training_time TEXT,
  training_description TEXT,
  training_completed BOOLEAN DEFAULT false,
  
  -- Day properties
  is_training_day BOOLEAN DEFAULT false,
  is_meal_prep_day BOOLEAN DEFAULT false,
  is_leftover_day BOOLEAN DEFAULT false,
  
  -- Checkins
  checkin_breakfast BOOLEAN DEFAULT false,
  checkin_lunch BOOLEAN DEFAULT false,
  checkin_dinner BOOLEAN DEFAULT false,
  checkin_training BOOLEAN DEFAULT false,
  checkin_walking BOOLEAN DEFAULT false,
  checkin_medication BOOLEAN DEFAULT false,
  checkin_sleep_routine BOOLEAN DEFAULT false,
  steps_actual INTEGER,
  
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(week_id, date)
);

-- ============================================================================
-- DAY MEALS (meal instances)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.day_meals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  day_id UUID REFERENCES public.days(id) ON DELETE CASCADE NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  
  meal_id UUID REFERENCES public.meals(id),
  meal_name TEXT NOT NULL,
  variant TEXT DEFAULT 'family' CHECK (variant IN ('family', 'primary', 'child')),
  portions INTEGER DEFAULT 3,
  
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  
  is_leftover BOOLEAN DEFAULT false,
  from_prep_day DATE,
  is_modified BOOLEAN DEFAULT false,
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(day_id, meal_type)
);

-- ============================================================================
-- SHOPPING LISTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.shopping_lists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  week_id UUID REFERENCES public.weeks(id) ON DELETE CASCADE NOT NULL,
  household_id UUID REFERENCES public.households(id) ON DELETE CASCADE,
  
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  estimated_total NUMERIC(6,2) DEFAULT 0,
  actual_total NUMERIC(6,2),
  status TEXT DEFAULT 'generated' CHECK (status IN ('generated', 'in_progress', 'completed')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(week_id)
);

-- ============================================================================
-- SHOPPING LIST ITEMS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.shopping_list_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  shopping_list_id UUID REFERENCES public.shopping_lists(id) ON DELETE CASCADE NOT NULL,
  
  ingredient_id TEXT NOT NULL,
  name TEXT NOT NULL,
  amount NUMERIC(8,2) NOT NULL,
  unit TEXT NOT NULL,
  display_text TEXT NOT NULL,
  
  checked BOOLEAN DEFAULT false,
  checked_at TIMESTAMPTZ,
  
  is_fresh BOOLEAN DEFAULT false,
  buy_this_week BOOLEAN DEFAULT true,
  estimated_price NUMERIC(5,2) DEFAULT 0,
  
  store TEXT DEFAULT 'other' CHECK (store IN ('aldi', 'lidl', 'ah', 'jumbo', 'dirk', 'market', 'other')),
  category TEXT DEFAULT 'pantry' CHECK (category IN ('produce', 'bakery', 'meat', 'dairy', 'frozen', 'pantry', 'drinks', 'household', 'snacks')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SEARCH HISTORY
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.search_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  query TEXT NOT NULL,
  filters JSONB DEFAULT '{}',
  results_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ONBOARDING PROGRESS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.onboarding_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  step_completed INTEGER DEFAULT 0,
  total_steps INTEGER DEFAULT 5,
  
  welcome_shown BOOLEAN DEFAULT false,
  tutorial_completed BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_meals_category ON public.meals(category);
CREATE INDEX IF NOT EXISTS idx_meals_tags ON public.meals USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_meals_household ON public.meals(household_id);
CREATE INDEX IF NOT EXISTS idx_meals_created_by ON public.meals(created_by);

CREATE INDEX IF NOT EXISTS idx_weeks_household ON public.weeks(household_id);
CREATE INDEX IF NOT EXISTS idx_weeks_dates ON public.weeks(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_days_week ON public.days(week_id);
CREATE INDEX IF NOT EXISTS idx_days_date ON public.days(date);

CREATE INDEX IF NOT EXISTS idx_day_meals_day ON public.day_meals(day_id);
CREATE INDEX IF NOT EXISTS idx_day_meals_meal ON public.day_meals(meal_id);

CREATE INDEX IF NOT EXISTS idx_shopping_lists_week ON public.shopping_lists(week_id);
CREATE INDEX IF NOT EXISTS idx_shopping_items_list ON public.shopping_list_items(shopping_list_id);
CREATE INDEX IF NOT EXISTS idx_shopping_items_checked ON public.shopping_list_items(checked);

CREATE INDEX IF NOT EXISTS idx_search_history_user ON public.search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_created ON public.search_history(created_at);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.households ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.day_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_progress ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- User preferences: users can manage their own
CREATE POLICY "Users can manage own preferences" ON public.user_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Households: members can view their household
CREATE POLICY "Household members can view" ON public.households
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.household_id = households.id 
      AND profiles.id = auth.uid()
    )
  );

-- Meals: viewable by household members or public meals
CREATE POLICY "Meals viewable by household" ON public.meals
  FOR SELECT USING (
    household_id IS NULL OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.household_id = meals.household_id 
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can create meals in their household" ON public.meals
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.household_id = meals.household_id 
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can update their meals" ON public.meals
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Users can delete their meals" ON public.meals
  FOR DELETE USING (created_by = auth.uid());

-- Weeks: viewable by household members
CREATE POLICY "Weeks viewable by household" ON public.weeks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.household_id = weeks.household_id 
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can manage weeks in their household" ON public.weeks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.household_id = weeks.household_id 
      AND profiles.id = auth.uid()
    )
  );

-- Days: viewable through week
CREATE POLICY "Days viewable through week" ON public.days
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.weeks 
      JOIN public.profiles ON profiles.household_id = weeks.household_id
      WHERE weeks.id = days.week_id 
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can manage days in their household" ON public.days
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.weeks 
      JOIN public.profiles ON profiles.household_id = weeks.household_id
      WHERE weeks.id = days.week_id 
      AND profiles.id = auth.uid()
    )
  );

-- Day meals: same as days
CREATE POLICY "Day meals viewable through day" ON public.day_meals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.days 
      JOIN public.weeks ON weeks.id = days.week_id
      JOIN public.profiles ON profiles.household_id = weeks.household_id
      WHERE days.id = day_meals.day_id 
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can manage day meals" ON public.day_meals
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.days 
      JOIN public.weeks ON weeks.id = days.week_id
      JOIN public.profiles ON profiles.household_id = weeks.household_id
      WHERE days.id = day_meals.day_id 
      AND profiles.id = auth.uid()
    )
  );

-- Shopping lists: viewable by household
CREATE POLICY "Shopping lists viewable by household" ON public.shopping_lists
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.household_id = shopping_lists.household_id 
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can manage shopping lists" ON public.shopping_lists
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.household_id = shopping_lists.household_id 
      AND profiles.id = auth.uid()
    )
  );

-- Shopping list items: same as lists
CREATE POLICY "Shopping items viewable through list" ON public.shopping_list_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.shopping_lists 
      JOIN public.profiles ON profiles.household_id = shopping_lists.household_id
      WHERE shopping_lists.id = shopping_list_items.shopping_list_id 
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can manage shopping items" ON public.shopping_list_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.shopping_lists 
      JOIN public.profiles ON profiles.household_id = shopping_lists.household_id
      WHERE shopping_lists.id = shopping_list_items.shopping_list_id 
      AND profiles.id = auth.uid()
    )
  );

-- Search history: users can manage their own
CREATE POLICY "Users can manage own search history" ON public.search_history
  FOR ALL USING (auth.uid() = user_id);

-- Onboarding progress: users can manage their own
CREATE POLICY "Users can manage own onboarding" ON public.onboarding_progress
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update trigger to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_households_updated_at BEFORE UPDATE ON public.households
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meals_updated_at BEFORE UPDATE ON public.meals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weeks_updated_at BEFORE UPDATE ON public.weeks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_days_updated_at BEFORE UPDATE ON public.days
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_day_meals_updated_at BEFORE UPDATE ON public.day_meals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shopping_lists_updated_at BEFORE UPDATE ON public.shopping_lists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shopping_list_items_updated_at BEFORE UPDATE ON public.shopping_list_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_onboarding_progress_updated_at BEFORE UPDATE ON public.onboarding_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate invite code
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    code := upper(substring(md5(random()::text), 1, 8));
    SELECT EXISTS(SELECT 1 FROM public.households WHERE invite_code = code) INTO exists_check;
    EXIT WHEN NOT exists_check;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;
