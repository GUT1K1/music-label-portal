-- Добавляем поля для чанковой обработки
ALTER TABLE financial_upload_jobs 
ADD COLUMN IF NOT EXISTS total_chunks INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS completed_chunks INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS chunk_size INTEGER DEFAULT 1000;

-- Создаём таблицу для отслеживания чанков
CREATE TABLE IF NOT EXISTS job_chunks (
    id SERIAL PRIMARY KEY,
    job_id INTEGER NOT NULL,
    chunk_number INTEGER NOT NULL,
    start_row INTEGER NOT NULL,
    end_row INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    error_message TEXT,
    matched_count INTEGER DEFAULT 0,
    processed_rows INTEGER DEFAULT 0,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(job_id, chunk_number)
);

CREATE INDEX IF NOT EXISTS idx_job_chunks_job_id ON job_chunks(job_id);
CREATE INDEX IF NOT EXISTS idx_job_chunks_status ON job_chunks(status);