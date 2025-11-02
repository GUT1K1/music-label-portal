-- Добавляем поле баланса в таблицу users
ALTER TABLE t_p35759334_music_label_portal.users 
ADD COLUMN IF NOT EXISTS balance DECIMAL(10, 2) DEFAULT 0.00;

-- Добавляем поле изображения в таблицу news (для объявлений с картинками)
ALTER TABLE t_p35759334_music_label_portal.news 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Создаем таблицу для опросов в объявлениях
CREATE TABLE IF NOT EXISTS t_p35759334_music_label_portal.news_polls (
    id SERIAL PRIMARY KEY,
    news_id INTEGER NOT NULL,
    question TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(news_id)
);

-- Создаем таблицу для вариантов ответов опроса
CREATE TABLE IF NOT EXISTS t_p35759334_music_label_portal.poll_options (
    id SERIAL PRIMARY KEY,
    poll_id INTEGER NOT NULL,
    option_text TEXT NOT NULL,
    votes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Создаем таблицу для отслеживания голосов пользователей
CREATE TABLE IF NOT EXISTS t_p35759334_music_label_portal.poll_votes (
    id SERIAL PRIMARY KEY,
    poll_id INTEGER NOT NULL,
    option_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    voted_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(poll_id, user_id)
);