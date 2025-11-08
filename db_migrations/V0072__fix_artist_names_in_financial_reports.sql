-- Обновляем artist_name в финансовых отчетах на правильные имена из релизов
UPDATE financial_reports 
SET artist_name = 'Imbro' 
WHERE id = 1;

UPDATE financial_reports 
SET artist_name = 'gut1k' 
WHERE id = 2;