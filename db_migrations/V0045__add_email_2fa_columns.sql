ALTER TABLE t_p35759334_music_label_portal.users
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS verification_token VARCHAR(64),
ADD COLUMN IF NOT EXISTS verification_token_expires TIMESTAMP,
ADD COLUMN IF NOT EXISTS two_fa_enabled BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS two_fa_code VARCHAR(6),
ADD COLUMN IF NOT EXISTS two_fa_code_expires TIMESTAMP;

CREATE INDEX IF NOT EXISTS idx_users_email ON t_p35759334_music_label_portal.users(email);
CREATE INDEX IF NOT EXISTS idx_users_verification_token ON t_p35759334_music_label_portal.users(verification_token);
CREATE INDEX IF NOT EXISTS idx_users_two_fa_code ON t_p35759334_music_label_portal.users(two_fa_code);