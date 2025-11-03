-- Add release_id column to messages table for attaching releases to support messages
ALTER TABLE t_p35759334_music_label_portal.messages
ADD COLUMN release_id INTEGER REFERENCES t_p35759334_music_label_portal.releases(id);