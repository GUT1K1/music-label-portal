-- Защита от дубликатов диалогов: 1 артист = 1 активный диалог

-- Создаем уникальный индекс: у одного артиста может быть только один не архивированный диалог
CREATE UNIQUE INDEX IF NOT EXISTS unique_active_thread_per_artist 
ON t_p35759334_music_label_portal.support_threads (artist_id) 
WHERE is_archived = false;

-- Архивируем дубликаты, оставляя только последний активный диалог для каждого артиста
WITH duplicate_threads AS (
    SELECT 
        id,
        artist_id,
        ROW_NUMBER() OVER (PARTITION BY artist_id ORDER BY last_message_at DESC, created_at DESC) as rn
    FROM t_p35759334_music_label_portal.support_threads
    WHERE is_archived = false
)
UPDATE t_p35759334_music_label_portal.support_threads
SET is_archived = true
WHERE id IN (
    SELECT id 
    FROM duplicate_threads 
    WHERE rn > 1
);