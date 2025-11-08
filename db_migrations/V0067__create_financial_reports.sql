-- Таблица для финансовых отчётов
CREATE TABLE IF NOT EXISTS financial_reports (
    id SERIAL PRIMARY KEY,
    period VARCHAR(50) NOT NULL,
    artist_name VARCHAR(255) NOT NULL,
    album_name VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    user_id INTEGER,
    release_id INTEGER,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_by INTEGER,
    status VARCHAR(50) DEFAULT 'pending'
);

CREATE INDEX idx_financial_reports_user_id ON financial_reports(user_id);
CREATE INDEX idx_financial_reports_period ON financial_reports(period);
CREATE INDEX idx_financial_reports_status ON financial_reports(status);

COMMENT ON TABLE financial_reports IS 'Финансовые отчёты по выплатам артистам';
COMMENT ON COLUMN financial_reports.period IS 'Период отчёта, например: 1 квартал 2024';
COMMENT ON COLUMN financial_reports.artist_name IS 'Имя исполнителя из Excel файла';
COMMENT ON COLUMN financial_reports.album_name IS 'Название альбома из Excel файла';
COMMENT ON COLUMN financial_reports.amount IS 'Сумма вознаграждения в рублях';
COMMENT ON COLUMN financial_reports.user_id IS 'ID пользователя (артиста), NULL если не найдено совпадение';
COMMENT ON COLUMN financial_reports.release_id IS 'ID релиза, если найдено совпадение';
COMMENT ON COLUMN financial_reports.uploaded_by IS 'ID администратора, который загрузил отчёт';
COMMENT ON COLUMN financial_reports.status IS 'Статус: pending, matched, paid';