-- Fix artist1 balance to match actual financial reports
UPDATE users 
SET balance = 12500.00
WHERE id = 2;