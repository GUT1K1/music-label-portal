-- Добавляем тестовый договор к релизу #24 для демонстрации функционала

UPDATE releases 
SET 
  contract_pdf_url = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  contract_requisites = '{
    "full_name": "Иванов Иван Иванович",
    "stage_name": "Виктор Косарев",
    "citizenship": "РФ",
    "passport_data": "1234 567890",
    "inn_swift": "123456789012",
    "email": "artist@example.com",
    "bank_requisites": "Банк: Сбербанк\nКорр. счет: 1234567890\nРасчетный счет: 9876543210"
  }'::jsonb
WHERE id = 24;