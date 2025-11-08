-- Исправить застрявшие задачи в статусе processing
UPDATE financial_upload_jobs 
SET status = 'failed', 
    error_message = 'Timeout - функция не завершилась', 
    completed_at = NOW() 
WHERE status = 'processing' AND started_at < NOW() - INTERVAL '5 minutes';