-- Архивируем старые диалоги, оставляя только последний для каждого артиста
-- Для каждого артиста находим последний диалог и архивируем все остальные

UPDATE t_p35759334_music_label_portal.support_threads
SET is_archived = true
WHERE id IN (
    SELECT st1.id
    FROM t_p35759334_music_label_portal.support_threads st1
    WHERE EXISTS (
        SELECT 1
        FROM t_p35759334_music_label_portal.support_threads st2
        WHERE st2.artist_id = st1.artist_id
        AND st2.created_at > st1.created_at
    )
);

-- Добавляем частичный уникальный индекс: один активный диалог на артиста
CREATE UNIQUE INDEX unique_active_thread_per_artist 
ON t_p35759334_music_label_portal.support_threads (artist_id) 
WHERE is_archived = false;
