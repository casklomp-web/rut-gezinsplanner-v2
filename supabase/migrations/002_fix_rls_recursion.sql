-- Fix RLS policies - remove infinite recursion

-- Drop old recursive policies
DROP POLICY IF EXISTS "Users can view own household" ON households;
DROP POLICY IF EXISTS "Users can view household members" ON household_members;
DROP POLICY IF EXISTS "Users can view meal plans" ON meal_plans;
DROP POLICY IF EXISTS "Users can view shopping lists" ON shopping_lists;

-- New approach: link households to auth user via a creator/owner field
-- First, add user_id to households to track who created it
ALTER TABLE households ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- Update existing households to set created_by if null (for backwards compatibility)
-- This will only work if there's data, otherwise it's fine

-- SIMPLIFIED RLS POLICIES FOR MVP

-- Households: anyone can create, but only creator can view/update their own
CREATE POLICY "Anyone can create households" ON households
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their created households" ON households
  FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Users can update their households" ON households
  FOR UPDATE USING (created_by = auth.uid());

-- Household members: anyone can create (during setup), view based on household membership
-- We use a simpler approach: check if user created the household
CREATE POLICY "Anyone can create household members" ON household_members
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view members of their households" ON household_members
  FOR SELECT USING (
    household_id IN (
      SELECT id FROM households WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update members of their households" ON household_members
  FOR UPDATE USING (
    household_id IN (
      SELECT id FROM households WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete members of their households" ON household_members
  FOR DELETE USING (
    household_id IN (
      SELECT id FROM households WHERE created_by = auth.uid()
    )
  );

-- Meal plans: same pattern
CREATE POLICY "Anyone can create meal plans" ON meal_plans
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their household meal plans" ON meal_plans
  FOR SELECT USING (
    household_id IN (
      SELECT id FROM households WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update their household meal plans" ON meal_plans
  FOR UPDATE USING (
    household_id IN (
      SELECT id FROM households WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete their household meal plans" ON meal_plans
  FOR DELETE USING (
    household_id IN (
      SELECT id FROM households WHERE created_by = auth.uid()
    )
  );

-- Shopping lists: same pattern
CREATE POLICY "Anyone can create shopping lists" ON shopping_lists
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their household shopping lists" ON shopping_lists
  FOR SELECT USING (
    meal_plan_id IN (
      SELECT id FROM meal_plans WHERE household_id IN (
        SELECT id FROM households WHERE created_by = auth.uid()
      )
    )
  );

CREATE POLICY "Users can update their household shopping lists" ON shopping_lists
  FOR UPDATE USING (
    meal_plan_id IN (
      SELECT id FROM meal_plans WHERE household_id IN (
        SELECT id FROM households WHERE created_by = auth.uid()
      )
    )
  );

CREATE POLICY "Users can delete their household shopping lists" ON shopping_lists
  FOR DELETE USING (
    meal_plan_id IN (
      SELECT id FROM meal_plans WHERE household_id IN (
        SELECT id FROM households WHERE created_by = auth.uid()
      )
    )
  );
