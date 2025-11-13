-- Создание таблицы настроек внешнего вида сайта
CREATE TABLE IF NOT EXISTS site_settings (
    id SERIAL PRIMARY KEY,
    theme_name VARCHAR(50) NOT NULL DEFAULT 'golden-night',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER
);

-- Вставляем дефолтную тему
INSERT INTO site_settings (theme_name, updated_at) 
VALUES ('golden-night', CURRENT_TIMESTAMP);

-- Создаём индекс для быстрого получения последней настройки
CREATE INDEX IF NOT EXISTS idx_site_settings_updated_at ON site_settings(updated_at DESC);