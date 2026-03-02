-- Add attributes column to membership_requests table to store values during request phase
ALTER TABLE membership_requests ADD COLUMN IF NOT EXISTS attributes JSONB;
