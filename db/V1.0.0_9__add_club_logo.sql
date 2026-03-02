-- Add logo column to club table
ALTER TABLE club ADD COLUMN IF NOT EXISTS logo TEXT;
