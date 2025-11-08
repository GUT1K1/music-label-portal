UPDATE financial_upload_jobs 
SET status = 'failed', 
    error_message = 'Отменено - переход на чанковую обработку', 
    completed_at = NOW() 
WHERE status IN ('pending', 'processing');