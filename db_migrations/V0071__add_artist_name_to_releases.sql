-- Добавляем поле artist_name для хранения сценического имени исполнителя
ALTER TABLE releases ADD COLUMN artist_name VARCHAR(255);

-- Обновляем существующие релизы artist1 (id=2)
UPDATE releases SET artist_name = 'Imbro' WHERE id = 32;
UPDATE releases SET artist_name = 'gut1k' WHERE id = 33;