-- Мигрируем существующие тикеты в систему поддержки
-- Каждый тикет становится темой поддержки

INSERT INTO t_p35759334_music_label_portal.support_threads 
    (artist_id, subject, status, priority, assigned_to, created_at, updated_at, last_message_at, is_archived)
SELECT 
    created_by as artist_id,
    title as subject,
    CASE 
        WHEN status = 'open' THEN 'new'
        WHEN status = 'in_progress' THEN 'in_progress'
        WHEN status = 'closed' THEN 'resolved'
        ELSE 'new'
    END as status,
    CASE 
        WHEN priority = 'urgent' THEN 'urgent'
        ELSE 'normal'
    END as priority,
    assigned_to,
    created_at,
    updated_at,
    COALESCE(updated_at, created_at) as last_message_at,
    CASE WHEN status = 'closed' THEN true ELSE false END as is_archived
FROM t_p35759334_music_label_portal.tickets
WHERE NOT EXISTS (
    SELECT 1 FROM t_p35759334_music_label_portal.support_threads st 
    WHERE st.artist_id = tickets.created_by 
    AND st.subject = tickets.title
    AND st.created_at = tickets.created_at
);

-- Создаем первое сообщение для каждой темы (описание тикета)
INSERT INTO t_p35759334_music_label_portal.messages 
    (thread_id, sender_id, message, created_at, is_read, message_type, attachment_url, attachment_name, attachment_size)
SELECT 
    st.id as thread_id,
    t.created_by as sender_id,
    t.description as message,
    t.created_at,
    true as is_read,
    CASE WHEN t.attachment_url IS NOT NULL THEN 'file' ELSE 'text' END as message_type,
    t.attachment_url,
    t.attachment_name,
    t.attachment_size
FROM t_p35759334_music_label_portal.tickets t
JOIN t_p35759334_music_label_portal.support_threads st 
    ON st.artist_id = t.created_by 
    AND st.subject = t.title 
    AND st.created_at = t.created_at
WHERE NOT EXISTS (
    SELECT 1 FROM t_p35759334_music_label_portal.messages m 
    WHERE m.thread_id = st.id AND m.created_at = t.created_at
);