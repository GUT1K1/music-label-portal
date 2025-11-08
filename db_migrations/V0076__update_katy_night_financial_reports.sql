-- Update financial reports for Katy Night to matched status
UPDATE financial_reports 
SET 
  user_id = 2,
  release_id = 34,
  status = 'matched'
WHERE 
  period = '3 квартал 2024' 
  AND artist_name = 'Katy Night' 
  AND album_name = 'Нечего терять'
  AND status = 'pending';

-- Update artist1 balance with Katy Night earnings
UPDATE users 
SET balance = balance + 9.10
WHERE id = 2;