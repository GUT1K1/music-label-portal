-- Обнуляем баланс artist1
UPDATE users 
SET balance = 0 
WHERE id = 2;

-- Помечаем старые финансовые отчёты как архивные
UPDATE financial_reports 
SET status = 'archived' 
WHERE user_id = 2;

-- Очищаем старые задачи загрузки
UPDATE financial_upload_jobs 
SET status = 'archived' 
WHERE status IN ('completed', 'failed');