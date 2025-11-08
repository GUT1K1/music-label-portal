-- Исправить все застрявшие задачи
UPDATE financial_upload_jobs 
SET status = 'failed', 
    error_message = 'Timeout - функция не завершилась (принудительно сброшено)', 
    completed_at = NOW() 
WHERE status = 'processing';