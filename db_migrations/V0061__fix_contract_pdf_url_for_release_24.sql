-- Обновляем URL договора на рабочий PDF (пример: образец договора в публичном доступе)

UPDATE releases 
SET contract_pdf_url = 'https://www.africau.edu/images/default/sample.pdf'
WHERE id = 24;