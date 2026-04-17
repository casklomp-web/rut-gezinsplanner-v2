-- Create households table
CREATE TABLE households (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create household_members table
CREATE TABLE household_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  household_id UUID REFERENCES households(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'member')) DEFAULT 'member',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meals table
CREATE TABLE meals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT CHECK (category IN ('breakfast', 'lunch', 'dinner')) NOT NULL,
  ingredients TEXT[] DEFAULT '{}'
);

-- Create meal_plans table
CREATE TABLE meal_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  household_id UUID REFERENCES households(id) ON DELETE CASCADE,
  week_starting DATE NOT NULL,
  days JSONB DEFAULT '[]'::jsonb,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shopping_lists table
CREATE TABLE shopping_lists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meal_plan_id UUID REFERENCES meal_plans(id) ON DELETE CASCADE,
  items JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample meals (15 meals for MVP v0.1)
INSERT INTO meals (name, category, ingredients) VALUES
-- Breakfast (5)
('Havermout met banaan', 'breakfast', ARRAY['Havermout 60g', 'Banaan 1 stuk', 'Melk 200ml']),
('Yoghurt met muesli', 'breakfast', ARRAY['Yoghurt 200g', 'Muesli 50g', 'Banaan 0.5 stuk']),
('Eieren met toast', 'breakfast', ARRAY['Eieren 2 stuks', 'Toast 2 sneetjes', 'Boter 10g']),
('Overnight oats', 'breakfast', ARRAY['Havermout 60g', 'Melk 200ml', 'Chiazaad 1 el']),
('Wentelteefjes', 'breakfast', ARRAY['Brood 4 sneetjes', 'Eieren 2 stuks', 'Melk 100ml', 'Kaneel']),

-- Lunch (5)
('Wrap met kip', 'lunch', ARRAY['Wrap 1 stuk', 'Kipfilet 100g', 'Sla', 'Hummus 2 el']),
('Wrap met gehakt', 'lunch', ARRAY['Wrap 1 stuk', 'Rundergehakt 100g', 'Paprika 0.5 stuk']),
('Soep met brood', 'lunch', ARRAY['Tomatensoep 1 blik', 'Brood 2 sneetjes', 'Kaas 30g']),
('Restjes (gisteren)', 'lunch', ARRAY['Restjes van gisteren']),
('Quiche', 'lunch', ARRAY['Quiche 1 stuk', 'Groene salade']),

-- Dinner (5)
('Pasta bolognese', 'dinner', ARRAY['Pasta 300g', 'Rundergehakt 400g', 'Tomatensaus 500ml', 'Ui 1 stuk']),
('Rijstbowl met kip', 'dinner', ARRAY['Rijst 200g', 'Kipfilet 400g', 'Broccoli 1 stuk', 'Sojasaus']),
('Bloemkool met worst', 'dinner', ARRAY['Bloemkool 1 stuk', 'Worst 6 stuks', 'Aardappels 600g']),
('Vis met aardappel', 'dinner', ARRAY['Visfilet 400g', 'Aardappels 600g', 'Groente']),
('Stamppot', 'dinner', ARRAY['Aardappels 800g', 'Boerenkool 300g', 'Gehaktballen 6 stuks']);

-- Enable RLS
ALTER TABLE households ENABLE ROW LEVEL SECURITY;
ALTER TABLE household_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;

-- RLS Policies (basic - users can only see their own household data)
CREATE POLICY "Users can view own household" ON households
  FOR ALL USING (id IN (
    SELECT household_id FROM household_members WHERE id = auth.uid()
  ));

CREATE POLICY "Users can view household members" ON household_members
  FOR ALL USING (household_id IN (
    SELECT household_id FROM household_members WHERE id = auth.uid()
  ));

CREATE POLICY "Users can view meal plans" ON meal_plans
  FOR ALL USING (household_id IN (
    SELECT household_id FROM household_members WHERE id = auth.uid()
  ));

CREATE POLICY "Users can view shopping lists" ON shopping_lists
  FOR ALL USING (meal_plan_id IN (
    SELECT id FROM meal_plans WHERE household_id IN (
      SELECT household_id FROM household_members WHERE id = auth.uid()
    )
  ));

-- Meals are readable by all (shared library)
CREATE POLICY "Meals are readable by all" ON meals
  FOR SELECT USING (true);
