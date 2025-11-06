-- Добавляем поля для хранения кода привязки Telegram
ALTER TABLE t_p35759334_music_label_portal.users
ADD COLUMN IF NOT EXISTS telegram_link_code VARCHAR(6),
ADD COLUMN IF NOT EXISTS telegram_link_code_expires_at TIMESTAMP;