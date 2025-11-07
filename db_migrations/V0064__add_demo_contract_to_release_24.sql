-- Добавляем реальный договор к релизу #24 для демонстрации функционала
-- В продакшене договор генерируется автоматически на 6 шаге визарда

UPDATE releases 
SET 
  contract_pdf_url = 'https://storage.yandexcloud.net/music-label-files/contracts/sample_contract.pdf',
  contract_requisites = '{
    "full_name": "Костырев Виктор Алексеевич",
    "stage_name": "Виктор Костырев",
    "citizenship": "Российская Федерация",
    "passport_data": "4509 123456, выдан 15.03.2018",
    "inn_swift": "772501234567",
    "email": "viktor.kostyrev@example.com",
    "bank_requisites": "Банк: ПАО Сбербанк\nКорр. счет: 30101810400000000225\nРасчетный счет: 40817810538000123456\nБИК: 044525225"
  }'::jsonb
WHERE id = 24;