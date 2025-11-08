-- Добавляем тестовые финансовые отчеты для artist1
INSERT INTO financial_reports (period, artist_name, album_name, amount, user_id, release_id, uploaded_by, status, uploaded_at)
VALUES 
('3 квартал 2024', '123', 'не ты', 5000.00, 2, 32, 12, 'matched', NOW()),
('3 квартал 2024', '123', 'мотыльками', 7500.00, 2, 33, 12, 'matched', NOW());

-- Обновляем баланс artist1
UPDATE users SET balance = balance + 12500.00 WHERE id = 2;