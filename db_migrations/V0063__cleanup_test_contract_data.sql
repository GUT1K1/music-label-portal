-- Очищаем тестовые данные договора из релиза #24

UPDATE releases 
SET 
  contract_pdf_url = NULL,
  contract_requisites = NULL
WHERE id = 24;