-- Migration: 004_add_recipe_tags_index.sql
-- Purpose: Add index on recipe tags for faster filtering

CREATE INDEX IF NOT EXISTS idx_recipes_tags ON recipes USING GIN(tags);

COMMENT ON INDEX idx_recipes_tags IS 'Index for filtering recipes by tags (vegetarian, quick, etc.)';
