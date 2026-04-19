-- Migration: Add Family Task Board tables
-- Created: 2026-04-19

-- Household members table
CREATE TABLE IF NOT EXISTS household_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'member')),
    color TEXT NOT NULL DEFAULT '#3b82f6',
    avatar TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(household_id, user_id)
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    assignee_id UUID NOT NULL REFERENCES household_members(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
    recurrence TEXT NOT NULL DEFAULT 'none' CHECK (recurrence IN ('none', 'daily', 'weekly')),
    recurrence_end_date DATE,
    is_meal BOOLEAN NOT NULL DEFAULT FALSE,
    meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner')),
    recipe_id UUID REFERENCES recipes(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Task completions (for history)
CREATE TABLE IF NOT EXISTS task_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    completed_by UUID NOT NULL REFERENCES household_members(id),
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    week_number INTEGER NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_tasks_household ON tasks(household_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_household_members_household ON household_members(household_id);
CREATE INDEX IF NOT EXISTS idx_task_completions_task ON task_completions(task_id);

-- Row Level Security (RLS)
ALTER TABLE household_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_completions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for household_members
CREATE POLICY "Users can view members of their household"
    ON household_members FOR SELECT
    USING (household_id IN (
        SELECT household_id FROM household_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Admins can insert members"
    ON household_members FOR INSERT
    WITH CHECK (
        household_id IN (
            SELECT household_id FROM household_members 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update members"
    ON household_members FOR UPDATE
    USING (
        household_id IN (
            SELECT household_id FROM household_members 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can delete members"
    ON household_members FOR DELETE
    USING (
        household_id IN (
            SELECT household_id FROM household_members 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- RLS Policies for tasks
CREATE POLICY "Users can view tasks of their household"
    ON tasks FOR SELECT
    USING (household_id IN (
        SELECT household_id FROM household_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can create tasks in their household"
    ON tasks FOR INSERT
    WITH CHECK (household_id IN (
        SELECT household_id FROM household_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can update tasks in their household"
    ON tasks FOR UPDATE
    USING (household_id IN (
        SELECT household_id FROM household_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can delete tasks in their household"
    ON tasks FOR DELETE
    USING (household_id IN (
        SELECT household_id FROM household_members WHERE user_id = auth.uid()
    ));

-- RLS Policies for task_completions
CREATE POLICY "Users can view completions of their household"
    ON task_completions FOR SELECT
    USING (task_id IN (
        SELECT id FROM tasks WHERE household_id IN (
            SELECT household_id FROM household_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can create completions"
    ON task_completions FOR INSERT
    WITH CHECK (task_id IN (
        SELECT id FROM tasks WHERE household_id IN (
            SELECT household_id FROM household_members WHERE user_id = auth.uid()
        )
    ));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_household_members_updated_at
    BEFORE UPDATE ON household_members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();