-- Migration: 003_add_recipes_and_planning.sql
-- Purpose: Extend database for v0.1 weekplanner
-- NOTE: Using IF NOT EXISTS because tables were created manually before GitHub Actions

-- Recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('breakfast', 'lunch', 'dinner', 'snack')),
  prep_time_minutes INTEGER,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  servings INTEGER DEFAULT 4,
  instructions TEXT,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  calories_per_serving INTEGER,
  protein_g DECIMAL(5,2),
  carbs_g DECIMAL(5,2),
  fat_g DECIMAL(5,2),
  tags TEXT[]
);

ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view system recipes" ON recipes
  FOR SELECT USING (household_id IS NULL);

CREATE POLICY IF NOT EXISTS "Users can view their household recipes" ON recipes
  FOR SELECT USING (household_id IN (SELECT id FROM households WHERE created_by = auth.uid()));

CREATE POLICY IF NOT EXISTS "Users can create recipes for their household" ON recipes
  FOR INSERT WITH CHECK (household_id IS NULL OR household_id IN (SELECT id FROM households WHERE created_by = auth.uid()));

-- Recipe ingredients
CREATE TABLE IF NOT EXISTS recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount DECIMAL(8,2),
  unit TEXT CHECK (unit IN ('g', 'ml', 'stuks', 'eetlepels', 'theelepels', 'sneetjes')),
  category TEXT CHECK (category IN ('groente', 'fruit', 'vlees', 'vis', 'zuivel', 'granen', 'overig')),
  calories_per_100g INTEGER,
  is_main_ingredient BOOLEAN DEFAULT true
);

ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view ingredients of accessible recipes" ON recipe_ingredients
  FOR SELECT USING (recipe_id IN (SELECT id FROM recipes WHERE household_id IS NULL OR household_id IN (SELECT id FROM households WHERE created_by = auth.uid())));

-- Meal plan items
CREATE TABLE IF NOT EXISTS meal_plan_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  recipe_id UUID REFERENCES recipes(id),
  servings_planned INTEGER DEFAULT 4,
  notes TEXT,
  is_quick_backup BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(household_id, date, meal_type)
);

CREATE INDEX IF NOT EXISTS idx_meal_plan_items_household_date ON meal_plan_items(household_id, date);

ALTER TABLE meal_plan_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view their household meal plans" ON meal_plan_items
  FOR SELECT USING (household_id IN (SELECT id FROM households WHERE created_by = auth.uid()));

-- Weekly focus
CREATE TABLE IF NOT EXISTS weekly_focus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE,
  week_starting DATE NOT NULL,
  focus_type TEXT CHECK (focus_type IN ('meer_groente', 'minder_stress', 'afvallen', 'meer_energie', 'budget', 'variety')),
  custom_note TEXT,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(household_id, week_starting)
);

ALTER TABLE weekly_focus ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view their household weekly focus" ON weekly_focus
  FOR SELECT USING (household_id IN (SELECT id FROM households WHERE created_by = auth.uid()));

-- Shopping list items
CREATE TABLE IF NOT EXISTS shopping_list_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount DECIMAL(8,2),
  unit TEXT,
  category TEXT CHECK (category IN ('groente', 'fruit', 'vlees', 'vis', 'zuivel', 'granen', 'overig', 'sauzen', 'diepvries')),
  is_checked BOOLEAN DEFAULT false,
  from_recipe_id UUID REFERENCES recipes(id),
  week_starting DATE,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  added_by UUID REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_shopping_list_household_week ON shopping_list_items(household_id, week_starting);

ALTER TABLE shopping_list_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view their household shopping list" ON shopping_list_items
  FOR SELECT USING (household_id IN (SELECT id FROM households WHERE created_by = auth.uid()));
