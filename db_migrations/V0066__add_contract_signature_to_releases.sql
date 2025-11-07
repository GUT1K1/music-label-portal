-- Add contract_signature field to store signature image data URL
ALTER TABLE t_p35759334_music_label_portal.releases 
ADD COLUMN contract_signature TEXT;