-- Создание таблицы запросов на вывод средств
CREATE TABLE withdrawal_requests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  amount DECIMAL(10,2) NOT NULL CHECK (amount >= 1000),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('card', 'phone')),
  payment_details TEXT NOT NULL,
  comment TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMP,
  processed_by INTEGER REFERENCES users(id),
  rejection_reason TEXT
);

-- Индексы для быстрого поиска
CREATE INDEX idx_withdrawal_user_id ON withdrawal_requests(user_id);
CREATE INDEX idx_withdrawal_status ON withdrawal_requests(status);
CREATE INDEX idx_withdrawal_created_at ON withdrawal_requests(created_at DESC);

-- Комментарии к таблице
COMMENT ON TABLE withdrawal_requests IS 'Запросы артистов на вывод средств';
COMMENT ON COLUMN withdrawal_requests.user_id IS 'ID артиста';
COMMENT ON COLUMN withdrawal_requests.amount IS 'Сумма вывода (минимум 1000₽)';
COMMENT ON COLUMN withdrawal_requests.status IS 'Статус: pending, approved, rejected';
COMMENT ON COLUMN withdrawal_requests.payment_method IS 'Способ: card или phone';
COMMENT ON COLUMN withdrawal_requests.payment_details IS 'Номер карты или телефона';
COMMENT ON COLUMN withdrawal_requests.processed_by IS 'ID руководителя, обработавшего запрос';