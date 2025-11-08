CREATE TABLE IF NOT EXISTS financial_upload_jobs (
    id SERIAL PRIMARY KEY,
    uploaded_by INTEGER NOT NULL REFERENCES users(id),
    period VARCHAR(100) NOT NULL,
    filename VARCHAR(500),
    status VARCHAR(50) DEFAULT 'pending',
    total_rows INTEGER DEFAULT 0,
    processed_rows INTEGER DEFAULT 0,
    matched_count INTEGER DEFAULT 0,
    unmatched_count INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    started_at TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX idx_financial_jobs_status ON financial_upload_jobs(status);
CREATE INDEX idx_financial_jobs_uploaded_by ON financial_upload_jobs(uploaded_by);

COMMENT ON TABLE financial_upload_jobs IS 'Фоновые задачи обработки финансовых отчётов';
COMMENT ON COLUMN financial_upload_jobs.status IS 'pending, processing, completed, failed';