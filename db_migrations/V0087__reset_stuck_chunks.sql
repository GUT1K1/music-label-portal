UPDATE job_chunks 
SET status = 'pending', started_at = NULL 
WHERE status = 'processing' AND completed_at IS NULL;