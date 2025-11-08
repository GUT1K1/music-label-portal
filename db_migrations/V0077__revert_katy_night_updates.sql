-- Remove test Katy Night financial reports matching
UPDATE financial_reports 
SET 
  user_id = NULL,
  release_id = NULL,
  status = 'pending'
WHERE 
  period = '3 квартал 2024' 
  AND artist_name = 'Katy Night' 
  AND album_name = 'Нечего терять'
  AND user_id = 2;

-- Revert artist1 balance
UPDATE users 
SET balance = 0
WHERE id = 2;