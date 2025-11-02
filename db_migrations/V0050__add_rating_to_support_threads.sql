-- Add rating column to support_threads table
ALTER TABLE t_p35759334_music_label_portal.support_threads 
ADD COLUMN IF NOT EXISTS rating INTEGER CHECK (rating >= 1 AND rating <= 5);

COMMENT ON COLUMN t_p35759334_music_label_portal.support_threads.rating IS 'Artist rating of support quality (1-5 stars)';
