-- Добавить колонку для хранения файла
ALTER TABLE financial_upload_jobs ADD COLUMN IF NOT EXISTS file_data BYTEA;

-- Исправить застрявшую задачу #4
UPDATE financial_upload_jobs 
SET status = 'failed', 
    error_message = 'Timeout - функция не успела (слишком большой файл для синхронной обработки)', 
    completed_at = NOW() 
WHERE id = 4;