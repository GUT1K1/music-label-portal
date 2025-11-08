-- Исправить задачу #3 которая застряла
UPDATE financial_upload_jobs 
SET status = 'failed', 
    error_message = 'Timeout - функция не успела обработать (старая версия)', 
    completed_at = NOW() 
WHERE id = 3;