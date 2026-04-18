-- Migration: 004_test_migration.sql
-- Purpose: Test if GitHub Actions workflow works correctly
-- This is a harmless migration that just creates a test table

CREATE TABLE IF NOT EXISTS _migration_test (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tested_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clean up immediately (this is just a test)
DROP TABLE IF EXISTS _migration_test;
