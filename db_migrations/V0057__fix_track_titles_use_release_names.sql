-- Fix track titles: use release names instead of technical filenames

-- Daddy Drill - ALO
UPDATE t_p35759334_music_label_portal.release_tracks
SET title = 'ALO'
WHERE id = 7;

-- muwral - трудный подросток
UPDATE t_p35759334_music_label_portal.release_tracks
SET title = 'трудный подросток'
WHERE id = 8;