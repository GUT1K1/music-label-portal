-- Add contract fields to releases table
ALTER TABLE releases 
ADD COLUMN IF NOT EXISTS contract_pdf_url TEXT,
ADD COLUMN IF NOT EXISTS contract_requisites JSONB;