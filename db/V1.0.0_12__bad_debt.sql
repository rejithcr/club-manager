-- Add bad debt columns to regular fee payments
ALTER TABLE club_fee_payment ADD COLUMN IF NOT EXISTS is_bad_debt INTEGER DEFAULT 0;
ALTER TABLE club_fee_payment ADD COLUMN IF NOT EXISTS bad_debt_reason TEXT;

-- Add bad debt columns to adhoc fee payments
ALTER TABLE club_adhoc_fee_payment ADD COLUMN IF NOT EXISTS is_bad_debt INTEGER DEFAULT 0;
ALTER TABLE club_adhoc_fee_payment ADD COLUMN IF NOT EXISTS bad_debt_reason TEXT;
