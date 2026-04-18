-- Migration: 003_add_recipes_and_planning.sql
-- Purpose: Extend database for v0.1 weekplanner with future-proof fields for v0.2

-- ============================================
-- 1. RECIPES (extended from meals table)
-- ============================================

CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE, -- NULL = system recipe
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
  
  -- v0.2 fields (nullable for now):
  calories_per_serving INTEGER,
  protein_g DECIMAL(5,2),
  carbs_g DECIMAL(5,2),
  fat_g DECIMAL(5,2),
  tags TEXT[] -- 'vegetarian', 'quick', 'high-protein', 'budget-friendly', 'family-favorite'
);

-- Enable RLS on recipes
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for recipes
CREATE POLICY "Users can view system recipes" ON recipes
  FOR SELECT USING (household_id IS NULL);

CREATE POLICY "Users can view their household recipes" ON recipes
  FOR SELECT USING (household_id IN (
    SELECT id FROM households WHERE created_by = auth.uid()
  ));

CREATE POLICY "Users can create recipes for their household" ON recipes
  FOR INSERT WITH CHECK (
    household_id IS NULL OR 
    household_id IN (SELECT id FROM households WHERE created_by = auth.uid())
  );

CREATE POLICY "Users can update their household recipes" ON recipes
  FOR UPDATE USING (
    household_id IN (SELECT id FROM households WHERE created_by = auth.uid())
  );

CREATE POLICY "Users can delete their household recipes" ON recipes
  FOR DELETE USING (
    household_id IN (SELECT id FROM households WHERE created_by = auth.uid())
  );

-- ============================================
-- 2. RECIPE INGREDIENTS
-- ============================================

CREATE TABLE recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount DECIMAL(8,2),
  unit TEXT CHECK (unit IN ('g', 'ml', 'stuks', 'eetlepels', 'theelepels', 'sneetjes')),
  category TEXT CHECK (category IN ('groente', 'fruit', 'vlees', 'vis', 'zuivel', 'granen', 'overig')),
  
  -- v0.2 fields:
  calories_per_100g INTEGER,
  is_main_ingredient BOOLEAN DEFAULT true
);

-- Enable RLS
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;

-- RLS: access via recipe
CREATE POLICY "Users can view ingredients of accessible recipes" ON recipe_ingredients
  FOR SELECT USING (
    recipe_id IN (
      SELECT id FROM recipes WHERE household_id IS NULL 
      OR household_id IN (SELECT id FROM households WHERE created_by = auth.uid())
    )
  );

CREATE POLICY "Users can manage ingredients of their recipes" ON recipe_ingredients
  FOR ALL USING (
    recipe_id IN (
      SELECT id FROM recipes WHERE household_id IN (
        SELECT id FROM households WHERE created_by = auth.uid()
      )
    )
  );

-- ============================================
-- 3. MEAL PLAN ITEMS (replaces/extends meal_plans structure)
-- ============================================

CREATE TABLE meal_plan_items (
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
  
  -- Ensure only one meal per type per day per household
  UNIQUE(household_id, date, meal_type)
);

-- Index for faster week queries
CREATE INDEX idx_meal_plan_items_household_date ON meal_plan_items(household_id, date);

-- Enable RLS
ALTER TABLE meal_plan_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their household meal plans" ON meal_plan_items
  FOR SELECT USING (
    household_id IN (SELECT id FROM households WHERE created_by = auth.uid())
  );

CREATE POLICY "Users can manage their household meal plans" ON meal_plan_items
  FOR ALL USING (
    household_id IN (SELECT id FROM households WHERE created_by = auth.uid())
  );

-- ============================================
-- 4. WEEKLY FOCUS (differentiating feature)
-- ============================================

CREATE TABLE weekly_focus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE,
  week_starting DATE NOT NULL,
  focus_type TEXT CHECK (focus_type IN ('meer_groente', 'minder_stress', 'afvallen', 'meer_energie', 'budget', 'variety')),
  custom_note TEXT,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(household_id, week_starting)
);

-- Enable RLS
ALTER TABLE weekly_focus ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their household weekly focus" ON weekly_focus
  FOR SELECT USING (
    household_id IN (SELECT id FROM households WHERE created_by = auth.uid())
  );

CREATE POLICY "Users can manage their household weekly focus" ON weekly_focus
  FOR ALL USING (
    household_id IN (SELECT id FROM households WHERE created_by = auth.uid())
  );

-- ============================================
-- 5. SHOPPING LIST ITEMS (replaces shopping_lists)
-- ============================================

CREATE TABLE shopping_list_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount DECIMAL(8,2),
  unit TEXT,
  category TEXT CHECK (category IN ('groente', 'fruit', 'vlees', 'vis', 'zuivel', 'granen', 'overig', 'sauzen', 'diepvries')),
  is_checked BOOLEAN DEFAULT false,
  from_recipe_id UUID REFERENCES recipes(id),
  week_starting DATE, -- for organizing by week
  added_at TIMESTAMPTZ DEFAULT NOW(),
  added_by UUID REFERENCES auth.users(id)
);

-- Index for faster queries
CREATE INDEX idx_shopping_list_household_week ON shopping_list_items(household_id, week_starting);

-- Enable RLS
ALTER TABLE shopping_list_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their household shopping list" ON shopping_list_items
  FOR SELECT USING (
    household_id IN (SELECT id FROM households WHERE created_by = auth.uid())
  );

CREATE POLICY "Users can manage their household shopping list" ON shopping_list_items
  FOR ALL USING (
    household_id IN (SELECT id FROM households WHERE created_by = auth.uid())
  );

-- ============================================
-- 6. SEED DATA: System Recipes (20 recipes for v0.1)
-- ============================================

-- Breakfast recipes
INSERT INTO recipes (name, description, category, prep_time_minutes, difficulty, servings, instructions, tags) VALUES
('Havermout met banaan en honing', 'Een voedzaam ontbijt vol vezels en energie', 'breakfast', 5, 'easy', 1, '1. Doe havermout in een kom
2. Voeg melk toe
3. Verwarm 2 min in magnetron
4. Snijd banaan in plakjes
5. Garneer met honing', ARRAY['quick', 'vegetarian', 'healthy']),

('Yoghurt bowl met muesli', 'Fris en licht ontbijt met een crunch', 'breakfast', 3, 'easy', 1, '1. Schep yoghurt in een kom
2. Voeg muesli toe
3. Snijd fruit erbij
4. Optioneel: drupje honing', ARRAY['quick', 'vegetarian', 'no-cook']),

('Geroosterde boterham met ei', 'Klassiek Nederlands ontbijt', 'breakfast', 10, 'easy', 1, '1. Rooster brood
2. Bak ei in pan
3. Serveer met boter op brood', ARRAY['quick', 'protein']),

('Overnight oats', 'Voorbereid ontbijt voor drukke ochtenden', 'breakfast', 5, 'easy', 1, '1. Meng havermout met melk in potje
2. Voeg chiazaad toe
3. Zet een nacht in koelkast
4. Ochtend: fruit erop', ARRAY['prep-ahead', 'vegetarian', 'healthy']),

('Pannenkoeken', 'Lekker voor het weekend', 'breakfast', 20, 'medium', 4, '1. Meng bloem, melk, ei en zout
2. Bak in hete pan met boter
3. Serveer met stroop of suiker', ARRAY['family-favorite', 'weekend']);

-- Lunch recipes
INSERT INTO recipes (name, description, category, prep_time_minutes, difficulty, servings, instructions, tags) VALUES
('Wrap met kip en avocado', 'Frisse lunch vol eiwitten', 'lunch', 10, 'easy', 1, '1. Warm wrap op
2. Smeer hummus
3. Leg kip en sla erop
4. Rol op en snijd doormidden', ARRAY['quick', 'protein', 'healthy']),

('Tomatensoep met kaasbroodjes', 'Warme lunch voor koude dagen', 'lunch', 15, 'easy', 2, '1. Warm tomatensoep op
2. Rooster brood met kaas
3. Serveer samen', ARRAY['quick', 'vegetarian', 'comfort']),

('Quiche Lorraine', 'Hartige taart voor de lunch', 'lunch', 45, 'medium', 4, '1. Bak deegblind
2. Meng eieren met room en spek
3. Giet in deeg
4. Bak 30 min op 180°C', ARRAY['prep-ahead', 'family']),

('Broodje gezond', 'Klassieke Nederlandse lunch', 'lunch', 5, 'easy', 1, '1. Beleg brood met kaas
2. Voeg sla, tomaat, ei toe
3. Smeer licht met mayo', ARRAY['quick', 'classic']),

('Pasta salade met tonijn', 'Koude pasta voor warme dagen', 'lunch', 15, 'easy', 2, '1. Kook pasta
2. Laat afkoelen
3. Meng met tonijn, mais, ui
4. Dressing erover', ARRAY['no-cook', 'prep-ahead']);

-- Dinner recipes
INSERT INTO recipes (name, description, category, prep_time_minutes, difficulty, servings, instructions, tags) VALUES
('Pasta Bolognese', 'Italiaanse klassieker die iedereen lust', 'dinner', 30, 'easy', 4, '1. Fruit ui en knoflook
2. Bak gehakt rul
3. Voeg tomatensaus toe
4. Laat 20 min pruttelen
5. Serveer met pasta', ARRAY['family-favorite', 'kid-friendly']),

('Rijst met kip teriyaki', 'Aziatisch geïnspireerd, snel klaar', 'dinner', 25, 'easy', 4, '1. Kook rijst
2. Bak kipblokjes
3. Voeg teriyakisaus toe
4. Serveer met broccoli', ARRAY['quick', 'asian']),

('Ovenschotel met gehakt', 'Alles in één schaal, makkelijk', 'dinner', 45, 'easy', 4, '1. Bak gehakt met ui
2. Schik in ovenschaal met aardappel
3. Kaas erover
4. Bak 30 min op 200°C', ARRAY['one-pot', 'comfort']),

('Zalm met groente uit de oven', 'Gezond en weinig afwas', 'dinner', 35, 'easy', 4, '1. Leg zalm op bakpapier
2. Groente eromheen
3. Olijfolie, zout, peper
4. Bak 25 min op 180°C', ARRAY['healthy', 'low-carb', 'quick']),

('Stamppot boerenkool', 'Hollandse pot voor koude dagen', 'dinner', 40, 'medium', 4, '1. Kook aardappels en boerenkool
2. Stamp met melk en boter
3. Bak rookworst
4. Serveer met jus', ARRAY['traditional', 'winter', 'family']),

('Tacos met gehakt', 'Mexicaanse avond, leuk met kids', 'dinner', 25, 'easy', 4, '1. Bak gehakt met tacokruiden
2. Warm taco-schelpen op
3. Zet toppings op tafel
4. Iedereen vult zelf', ARRAY['interactive', 'kid-friendly', 'mexican']),

('Gegrilde kip met couscous', 'Licht en gezond', 'dinner', 30, 'easy', 4, '1. Marineer kip
2. Gril kip
3. Giet kokend water over couscous
4. Voeg geroosterde groente toe', ARRAY['healthy', 'mediterranean']),

('Lasagne', 'Hartige Italiaanse ovenschotel', 'dinner', 60, 'medium', 6, '1. Maak bolognesesaus
2. Maak bechamelsaus
3. Bouw lagen op
4. Bak 40 min op 180°C', ARRAY['family-favorite', 'prep-ahead', 'weekend']),

('Wokgroente met noodles', 'Snel en veel groente', 'dinner', 20, 'easy', 4, '1. Kook noodles
2. Wok groente op hoog vuur
3. Voeg saus toe
4. Meng met noodles', ARRAY['quick', 'vegetarian', 'asian']),

('Hutspot met klapstuk', 'Hollandse klassieker', 'dinner', 90, 'medium', 4, '1. Kook klapstuk
2. Kook aardappels, wortel, ui
3. Stamp tot hutspot
4. Serveer met vlees en jus', ARRAY['traditional', 'winter', 'comfort']);

-- ============================================
-- 7. SEED DATA: Recipe Ingredients (sample for a few recipes)
-- ============================================

-- Havermout
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT r.id, 'Havermout', 60, 'g', 'granen', true FROM recipes r WHERE r.name = 'Havermout met banaan en honing';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT r.id, 'Melk', 200, 'ml', 'zuivel', true FROM recipes r WHERE r.name = 'Havermout met banaan en honing';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT r.id, 'Banaan', 1, 'stuks', 'fruit', true FROM recipes r WHERE r.name = 'Havermout met banaan en honing';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT r.id, 'Honing', 1, 'eetlepels', 'overig', false FROM recipes r WHERE r.name = 'Havermout met banaan en honing';

-- Pasta Bolognese
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT r.id, 'Pasta', 400, 'g', 'granen', true FROM recipes r WHERE r.name = 'Pasta Bolognese';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT r.id, 'Rundergehakt', 400, 'g', 'vlees', true FROM recipes r WHERE r.name = 'Pasta Bolognese';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT r.id, 'Tomatensaus', 500, 'ml', 'overig', true FROM recipes r WHERE r.name = 'Pasta Bolognese';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT r.id, 'Ui', 1, 'stuks', 'groente', false FROM recipes r WHERE r.name = 'Pasta Bolognese';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT r.id, 'Knoflook', 2, 'stuks', 'groente', false FROM recipes r WHERE r.name = 'Pasta Bolognese';

-- Zalm
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT r.id, 'Zalmfilet', 400, 'g', 'vis', true FROM recipes r WHERE r.name = 'Zalm met groente uit de oven';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT r.id, 'Broccoli', 1, 'stuks', 'groente', true FROM recipes r WHERE r.name = 'Zalm met groente uit de oven';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT r.id, 'Cherrytomaatjes', 250, 'g', 'groente', true FROM recipes r WHERE r.name = 'Zalm met groente uit de oven';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT r.id, 'Olijfolie', 2, 'eetlepels', 'overig', false FROM recipes r WHERE r.name = 'Zalm met groente uit de oven';

-- Stamppot
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT r.id, 'Aardappels', 800, 'g', 'groente', true FROM recipes r WHERE r.name = 'Stamppot boerenkool';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT r.id, 'Boerenkool', 300, 'g', 'groente', true FROM recipes r WHERE r.name = 'Stamppot boerenkool';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT r.id, 'Rookworst', 1, 'stuks', 'vlees', true FROM recipes r WHERE r.name = 'Stamppot boerenkool';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT r.id, 'Melk', 100, 'ml', 'zuivel', false FROM recipes r WHERE r.name = 'Stamppot boerenkool';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT r.id, 'Boter', 50, 'g', 'zuivel', false FROM recipes r WHERE r.name = 'Stamppot boerenkool';

-- Wrap
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT r.id, 'Wrap', 1, 'stuks', 'granen', true FROM recipes r WHERE r.name = 'Wrap met kip en avocado';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT r.id, 'Kipfilet', 100, 'g', 'vlees', true FROM recipes r WHERE r.name = 'Wrap met kip en avocado';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT r.id, 'Avocado', 0.5, 'stuks', 'fruit', true FROM recipes r WHERE r.name = 'Wrap met kip en avocado';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT r.id, 'Sla', 1, 'stuks', 'groente', false FROM recipes r WHERE r.name = 'Wrap met kip en avocado';
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, category, is_main_ingredient)
SELECT r.id, 'Hummus', 2, 'eetlepels', 'overig', false FROM recipes r WHERE r.name = 'Wrap met kip en avocado';

-- ============================================
-- 8. MIGRATE EXISTING DATA (if any)
-- ============================================

-- Note: Old meals table will be deprecated but kept for reference
-- New recipes table is the source of truth going forward

-- ============================================
-- 9. CLEANUP (optional - after v0.1 is stable)
-- ============================================
-- DROP TABLE meals; -- Only after confirming everything works
-- DROP TABLE meal_plans; -- Replaced by meal_plan_items
-- DROP TABLE shopping_lists; -- Replaced by shopping_list_items
