-- Создаем таблицу тем поддержки (диалогов)
CREATE TABLE IF NOT EXISTS t_p35759334_music_label_portal.support_threads (
    id SERIAL PRIMARY KEY,
    artist_id INTEGER NOT NULL REFERENCES t_p35759334_music_label_portal.users(id),
    subject VARCHAR(500) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'new', -- new, in_progress, waiting, resolved
    priority VARCHAR(50) NOT NULL DEFAULT 'normal', -- normal, urgent
    assigned_to INTEGER REFERENCES t_p35759334_music_label_portal.users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_archived BOOLEAN DEFAULT false
);

-- Добавляем новые колонки в таблицу messages для поддержки
ALTER TABLE t_p35759334_music_label_portal.messages 
ADD COLUMN IF NOT EXISTS thread_id INTEGER REFERENCES t_p35759334_music_label_portal.support_threads(id),
ADD COLUMN IF NOT EXISTS attachment_url TEXT,
ADD COLUMN IF NOT EXISTS attachment_name TEXT,
ADD COLUMN IF NOT EXISTS attachment_size INTEGER,
ADD COLUMN IF NOT EXISTS is_internal_note BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS message_type VARCHAR(50) DEFAULT 'text'; -- text, image, file, system

-- Создаем индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_support_threads_artist ON t_p35759334_music_label_portal.support_threads(artist_id);
CREATE INDEX IF NOT EXISTS idx_support_threads_status ON t_p35759334_music_label_portal.support_threads(status);
CREATE INDEX IF NOT EXISTS idx_support_threads_assigned ON t_p35759334_music_label_portal.support_threads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_messages_thread ON t_p35759334_music_label_portal.messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_support_threads_last_message ON t_p35759334_music_label_portal.support_threads(last_message_at DESC);