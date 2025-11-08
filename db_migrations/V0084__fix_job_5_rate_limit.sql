UPDATE financial_upload_jobs 
SET status = 'failed', 
    error_message = 'Rate limit exceeded - слишком много запросов к БД', 
    completed_at = NOW() 
WHERE id = 5;