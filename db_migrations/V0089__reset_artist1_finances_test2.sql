-- Обнуляем баланс пользователя artist1 (ID: 2)
UPDATE users 
SET balance = 0.00 
WHERE id = 2;

-- Архивируем старые финансовые отчёты для этого пользователя
UPDATE financial_reports 
SET status = 'archived'
WHERE user_id = 2;

-- Архивируем старые джобы (меняем статус вместо удаления)
UPDATE financial_upload_jobs 
SET status = 'archived'
WHERE uploaded_by = 2 AND status IN ('completed', 'failed', 'pending', 'processing');

-- Архивируем чанки от этих джоб
UPDATE job_chunks 
SET status = 'archived'
WHERE job_id IN (
    SELECT id FROM financial_upload_jobs 
    WHERE uploaded_by = 2
);
